
1. Install Ollama & Models
Download Ollama and pull the models needed for reasoning and embedding.
Bash
# Install Ollama (Linux/Mac/Windows)
curl -fsSL https://ollama.com/install.sh | sh

# Pull required models
ollama pull llama3.1:8b
ollama pull nomic-embed-text



2. Hardcoded Prompt + Tool Mocking
Test the "Logic" before connecting the database. Define a tool schema that the LLM understands.
Python
# tools.py
def add_numbers(a, b):
    return a + b

# Mock logic: If prompt contains 'sum', call add_numbers

2.1 Create Google Cloud Server to handle Ollama due to heavy memory requirements - Glacier / Cryosphere / Vostok
```bash
NVIDIA L4 1 GPU  16GB RAM  U$516
Disk / 100GB balanced
Disk /mnt/ollama 100GB SSD
SO Ubuntu 24.04 Deep Learning VM with CUDA + Pytorch M131 (use the filter box to find it)
sudo fdisk  /dev/nvme0n2  ( n/p/1/enter/enter/w)
sudo mkfs.ext4 /dev/nvme0n2p1
/dev/nvme0n2p1  /mnt/ollama     ext4    defaults 0  2
sudo systemctl edit ollama.service
```

```bash
[Service]
Environment="OLLAMA_MODELS=/mnt/ollama"
Environment="OLLAMA_HOST=0.0.0.0"
Environment="OLLAMA_NUM_PARALLEL=4"
Environment="OLLAMA_MAX_LOADED_MODELS=2"
$ sudo systemctl daemon-reload
$ sudo systemctl restart ollama
```

3. ClickHouse Data Functions
Write optimized functions to fetch your forensic data.
Python
import clickhouse_connect

client = clickhouse_connect.get_client(host='localhost')

def get_wallet_labels(address):
    return client.query(f"SELECT label FROM forensic_db.labels WHERE address='{address}'").result_rows

def check_blocklist(address):
    return client.query(f"SELECT reason FROM forensic_db.blocklist WHERE address='{address}'").result_rows



4. CLI Prompt Simulator
Create a script to test the interaction loop without a UI.
Python
while True:
    user_input = input("Forensic Query: ")
    # logic to detect if it's an address or legal question
    # calls functions from step 3



5. React Interface
A simple dashboard for the end-user.
Component: ChatInterface.js (Message list + Input)
Component: WalletSummary.js (Side panel for labels/risk scores)
State: Use useState to handle the streaming response.

6. Asynchronous Python Backend
Use FastAPI to handle multiple users without blocking.
Python
from fastapi import FastAPI
import asyncio

app = FastAPI()

@app.post("/ask")
async def ask_forensic(query: str):
    # Use await to call Ollama/ClickHouse
    return {"response": "Analysis result..."}



7. Function Integration (The Agent)
Connect the LLM to the ClickHouse tools using a dispatcher.
Logic: The LLM receives the prompt $\rightarrow$ identifies it needs wallet data $\rightarrow$ returns a tool call $\rightarrow$ Python executes the ClickHouse query $\rightarrow$ Result is sent back to LLM for final report.

8. Legal RAG Import
Prepare the legal database for semantic search.
Chunking: Split legal PDFs/text into 500-character chunks.
Embedding: Convert chunks to vectors via nomic-embed-text.
Storage: Insert into ClickHouse Array(Float32) column with HNSW index.

9. Legal Context Implementation
Merge data and law in the final prompt.
Hybrid Prompt: > "Based on ClickHouse data, wallet 0x123 is a Mixer. According to the [Retrieved Legal Text] from Estonia, this transaction is classified as high risk. Explain why."

Next Step for you:
Would you like the Python code for Step 2 (the Tool Dispatcher) so you can test how the LLM decides between "Searching a Wallet" vs "Searching Law"?

