import os
import asyncio
import uuid
from ollama import AsyncClient
from lib.clickhouse import ClickHouseClient
from lib.extract_pdf_text import extract_text_from_pdf


ch_client = ClickHouseClient() 

async def get_embedding(ollama_client, text):
    """
    Sends text to Ollama and retrieves the vector embedding.
    """
    response = await ollama_client.embeddings(
        model='nomic-embed-text',
        prompt=text
    )
    return response['embedding']

def chunk_text(text, chunk_size=1000, overlap=150):
    """
    Splits long text into smaller overlapping chunks to preserve semantic context.
    """
    chunks = []
    start = 0
    text_len = len(text)
    
    while start < text_len:
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk.strip())
        # Move the start pointer back by 'overlap' to maintain context between chunks
        start += (chunk_size - overlap)
        
    return chunks

async def process_document(file_path, source_name):
    """
    Main workflow: Read, Chunk, Embed, and Store.
    """
    # 1. Initialize the Async Ollama Client
    ollama_client = AsyncClient(host=os.getenv("OLLAMA_HOST"))

    # if pdf extract text
    if file_path.endswith(".pdf"):
        full_text = extract_text_from_pdf(file_path)
    else:
        with open(file_path, 'r', encoding='utf-8') as f:
            full_text = f.read()
    
    # 3. Create overlapping chunks
    text_chunks = chunk_text(full_text)
    print(f"[*] Document split into {len(text_chunks)} chunks.")
    
    batch_data = []
    
    for i, chunk in enumerate(text_chunks):
        if not chunk: continue
        
        try:
            # 4. Generate the 768-dimension vector on your L4 GPU
            vector = await get_embedding(ollama_client, chunk)
            
            # Prepare data for ClickHouse
            # Format: (id, content, metadata_source, embedding)
            batch_data.append((
                uuid.uuid4(), 
                chunk, 
                source_name, 
                vector
            ))
            
            # 5. Perform batch insertion every 20 chunks to optimize performance
            if len(batch_data) >= 20:
                insert_query = "INSERT INTO rag_knowledge (id, content, metadata_source, embedding) VALUES"
                ch_client.execute(insert_query, batch_data)
                batch_data = []
                print(f"[+] Progress: {i+1}/{len(text_chunks)} chunks indexed.")
                
        except Exception as e:
            print(f"[!] Error processing chunk {i}: {e}")

    # Insert remaining chunks
    if batch_data:
        ch_client.execute("INSERT INTO rag_knowledge (id, content, metadata_source, embedding) VALUES", batch_data)

    print(f"\n[SUCCESS] '{source_name}' has been fully indexed in Cryosphere.")

if __name__ == "__main__":
    # Example execution
    # Replace 'mica_regulation.txt' with your actual file path
    #asyncio.run(process_document("glossary.txt", "Glossary"))
    # get parameters from command line
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--file_path", type=str, required=True)
    parser.add_argument("--source_name", type=str, required=True)
    args = parser.parse_args()
    asyncio.run(process_document(args.file_path, args.source_name))