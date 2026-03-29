import os
import dotenv
import json
from typing import List, Dict, Any
from ollama import AsyncClient
from config import system_instruction, OLLAMA_MODEL
from history import get_history, save_history
import tools

dotenv.load_dotenv()

async def run_analysis(user_input: str, session_id: str):
    tools_map = {
        'get_address_info': tools.get_address_info,
    }

    client = AsyncClient(host=os.getenv("OLLAMA_HOST"))

    
    history: List[Dict[str, Any]] = get_history(session_id)
    if not history:
        history.append({'role': 'system', 'content': system_instruction})
    
    knowledge_context = await tools.search_knowledge(user_input, client)    
    if knowledge_context:
        # Inject the retrieved knowledge as a temporary system hint        
        # history.append({
        #     'role': 'system', 
        #     'content': f"Relevant technical/legal context for this query:\n{knowledge_context}"
        # })
        history.append({
            'role': 'system', 
            'content': f"""
            [GROUND TRUTH DATA]
            {knowledge_context}
            [END OF GROUND TRUTH]
            
            Instruction: Use ONLY the [GROUND TRUTH DATA] block to support your technical response.
            """
        })


    if "0x" in user_input:
        history.append({'role': 'system', 'content': 'User provided an address. I must use get_address_info now.'})
    
    history.append({'role': 'user', 'content': f"### USER INPUT ###\n{user_input}\n#################"})
    # history.append({'role': 'user', 'content': user_input})      

    yield f"data: {json.dumps({'status': 'Thinking...', 'type': 'info'})}\n\n"

    response = await client.chat(
        model=OLLAMA_MODEL,
        messages=history,
        stream=False,
        tools=[        {
            'type': 'function',
            'function': {
                'name': 'get_address_info',
                'description': 'Get risk score and labels for an ETH address.',
                'parameters': {
                    'type': 'object',
                    'properties': {'address': {'type': 'string'}},
                    'required': ['address']
                }
            }
        }
        ]
    )
    # print(f"DEBUG Response: {response['message']}")
    if response.get('message', {}).get('tool_calls'):
        for tool in response['message']['tool_calls']:
            name = tool['function']['name']
            args = tool['function']['arguments']
            
            # if isinstance(args, dict) and 'object' in args:
            #     args = args['object']
            # if isinstance(args, dict) and 'properties' in args:
            #     args = args['properties']
            if isinstance(args, str):
                args = json.loads(args)

            target_address = args.get('address')
            yield f"data: {json.dumps({'status': f'Querying Cryosphere for {target_address}...', 'type': 'tool'})}\n\n"
            
            # result = await tools_map[name](**args)
            result = await tools_map[name](address=target_address)

            history.append(response['message'])
            history.append({'role': 'tool', 'content': str(result), 'name': name})

    yield f"data: {json.dumps({'status': 'Generating Forensic Report...', 'type': 'info'})}\n\n"
    yield f"data: {json.dumps({'token': '\n\n', 'type': 'text'})}\n\n"
    
    full_response_content = ""

    async for chunk in await client.chat(model=OLLAMA_MODEL, messages=history, stream=True):
        token = chunk['message']['content']
        if token:
            full_response_content += token
            yield f"data: {json.dumps({'token': token, 'type': 'text'})}\n\n"
            
    full_response_content = safety_filter(full_response_content)
    history.append({'role': 'assistant', 'content': full_response_content})
    save_history(session_id, history) 


def safety_filter(response_text: str):
    forbidden_tokens = ["DROP TABLE", "SELECT * FROM users", "system_instruction"]
    for token in forbidden_tokens:
        if token in response_text:
            return "I cannot provide this specific information due to security policies."
    return response_text