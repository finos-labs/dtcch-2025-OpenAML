import ollama
import tools


# 2. Map function names to actual objects
tools_map = {
    'add_numbers': tools.add_numbers,
    'subtract_numbers': tools.subtract_numbers,
    'multiply_numbers': tools.multiply_numbers,
    'divide_numbers': tools.divide_numbers
}

OLLAMA_IP = "127.0.0.1"  # using tunnel to Glacier Server

# create client to ollama
client = ollama.Client(host=f'http://{OLLAMA_IP}:11434')

def run_forensic_agent(user_input):

    SYSTEM_PROMPT = """
        You are a Senior Crypto Forensic Investigator. 
        1. If the user asks a general question about blockchain, law, or crypto, answer directly using your internal knowledge.
        2. If the user provides an Ethereum address (0x...), use the 'check_address_forensics' tool to fetch real data from the Cryosphere database.
        3. Never hallucinate or invent transaction data. If the tool returns no data, say you don't have information on that specific address.
        4. Be concise, technical, and professional.
        """
    messages = [
        {'role': 'system', 'content': SYSTEM_PROMPT},
        {'role': 'user', 'content': user_input}
    ]

    response = client.chat(
            model='llama3.1:8b',
        messages=messages,
        #tools=tools # 
    )

    # If the model did not call a tool, it just answered a general question
    if not response.get('message', {}).get('tool_calls'):
        return response['message']['content']

def run_calculator_agent(prompt):

    # 3. Define the tools for the LLM
    # This tells the model what functions exist and what parameters they take
    tools = [
        {
            'type': 'function',
            'function': {
                'name': 'add_numbers',
                'description': 'Add two numbers together',
                'parameters': {
                    'type': 'object',
                    'properties': {
                        'a': {'type': 'number'},
                        'b': {'type': 'number'}
                    },
                    'required': ['a', 'b']
                }
            }
        },
        {
            'type': 'function',
            'function': {
                'name': 'subtract_numbers',
                'description': 'Subtract two numbers',
                'parameters': {
                    'type': 'object',
                    'properties': {
                        'a': {'type': 'number'},
                        'b': {'type': 'number'}
                    },
                    'required': ['a', 'b']
                }
            }
        },
        {
            'type': 'function',
            'function': {
                'name': 'multiply_numbers',
                'description': 'Multiply two numbers',
                'parameters': {
                    'type': 'object',
                    'properties': {
                        'a': {'type': 'number'},
                        'b': {'type': 'number'}
                    },
                    'required': ['a', 'b']
                }
            }
        },
        {
            'type': 'function',
            'function': {
                'name': 'divide_numbers',
                'description': 'Divide two numbers',
                'parameters': {
                    'type': 'object',
                    'properties': {
                        'a': {'type': 'number'},
                        'b': {'type': 'number'}
                    },
                    'required': ['a', 'b']
                }
            }
        }
    ]

    


    #response = ollama.chat( # local
    response = client.chat(
        model='llama3.1:8b',
        messages=[{'role': 'user', 'content': prompt}],
        tools=tools
    )
   
    # 5. Check if the model wants to call a tool
    if response.get('message', {}).get('tool_calls'):
        for tool in response['message']['tool_calls']:
            function_name = tool['function']['name']
            args = tool['function']['arguments']
            
            # Execute the local function
            result = tools_map[function_name](**args)
            print(f"DEBUG: LLM called {function_name} with {args} -> Result: {result}")
            
            # 6. Final call: Give the result back to the LLM to format a response
            # final_response = ollama.chat( # local
            final_response = client.chat(
                model='llama3.1:8b',
                messages=[
                    {'role': 'user', 'content': prompt},
                    response['message'],
                    {'role': 'tool', 'content': str(result), 'name': function_name}
                ]
            )
            return final_response['message']['content']
    
    return response['message']['content']

# 7. CLI Loop
if __name__ == "__main__":
    
    
    while True:
        query = input("\nForensic Query (or 'exit'): ")
        if query.lower() == 'exit': break
        print("Agent:", run_forensic_agent(query))
        # Tools Sample
        # query = input("\nMath Query (or 'exit'): ")
        # print("Agent:", run_calculator_agent(query))