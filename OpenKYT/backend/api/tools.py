import requests
from lib.clickhouse import ClickHouseClient
import json
import re

def is_valid_address(address: str) -> bool:
    return bool(re.match(r"^0x[a-fA-F0-9]{40}$", address))

async def search_knowledge(query_text: str, ollama_client):
    # 1. Connect to Ollama to embed the search query
    
    #ollama_client = AsyncClient(host=os.getenv("OLLAMA_HOST"))
    resp = await ollama_client.embeddings(model="nomic-embed-text", prompt=query_text)
    vector = resp['embedding']

    # 2. Query ClickHouse for the most similar chunks
    # We use L2Distance as defined in your table index
    client = ClickHouseClient()        
    query = """
        SELECT content, metadata_source 
        FROM rag_knowledge 
        ORDER BY L2Distance(embedding, %(vec)s) ASC 
        LIMIT 3
    """
    results = client.execute(query, {'vec': vector})
    
    # Format the results for the LLM context
    context_text = "\n".join([f"Source [{r[1]}]: {r[0]}" for r in results])
    # print('debugknow:', context_text)
    return context_text

async def get_address_info(address: str):    
    if not is_valid_address(address):
        return "Invalid address"
    try:
        contract_info = await get_contract_info(address)
        address_label = await get_address_label(address)
        risk_score = await check_risk_score(address)        
        
        result = ""
        if contract_info is not None:
            result = contract_info
        if address_label is not None:
            result = result + "\n" + str(address_label)
        if risk_score is not None:
            result = result + "\n" + str(risk_score)
        # print(result)
        return result


    except Exception as e:
        print(f"Error: {e}")
        return "None"


async def check_risk_score(address: str):
    response = requests.get(f"https://api.nowa.sh/checkaddress/{address}")
    if response.status_code == 200:
        row = response.json()
        if row.get("note", "") == "new":
            return None
        return response.json()
    return None

async def get_address_label(address: str):
    if len(address) != 42 or not address.startswith("0x"):
        return None
    try:
        client = ClickHouseClient()        
        # remove the 0x prefix and convert to lowercase
        address = address[2:]
        result = client.execute("SELECT label FROM address_labels final WHERE address=unhex(%(address)s)", {'address': address})
        if not result:
            return json.dumps({"error": "Label not found"})
        row = result[0]
        return json.dumps({"label": row[0]})

    except Exception as e:
        print(f"Error: {e}")
        return None

async def get_contract_info(address: str):
    if len(address) != 42 or not address.startswith("0x"):
        return None
    try:
        client = ClickHouseClient()        
        # remove the 0x prefix and convert to lowercase
        address = address[2:]
        result = client.execute(" select protocol_name, contract_type, display_name , updated_at from known_contracts final  where address=unhex(%(address)s)", {'address': address})
        if not result:
            return json.dumps({"error": "Contract not found"})

        data = {
            "protocol": result[0][0],
            "type": result[0][1],
            "name": result[0][2],
            "updated": str(result[0][3])
        }

        return json.dumps(data)
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    res = get_address_label("0x7488bd11187cfb253c1079420eedb2dd1cf045a0")
    print(res)
