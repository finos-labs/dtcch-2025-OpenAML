FROM qwen2.5-coder:14b

# Define a temperatura mais baixa para evitar alucinações em dados forenses
PARAMETER temperature 0.1
# Aumenta o contexto para 32k (ideal para relatórios longos e muitos labels)
PARAMETER num_ctx 32768
# Garante que o modelo use a GPU L4 ao máximo
PARAMETER num_gpu 99

SYSTEM """
You are OpenKYT, a forensic intelligence engine. 
IMPORTANT: When you need to call a tool, you must use the native tool-calling feature. 
DO NOT wrap tool calls in markdown code blocks like ```json. 
If the user provides an Ethereum address, call get_address_info(address=...) immediately.
"""

ollama create openkyt-model -f Modelfile

sudo systemctl edit ollama.service

[Service]
Environment="OLLAMA_FLASH_ATTENTION=1"
Environment="CUDA_VISIBLE_DEVICES=0"

ollama run openkyt-model


CREATE TABLE IF NOT EXISTS rag_knowledge (
    id UUID DEFAULT generateUUIDv4(),
    content String,           -- Text (Ex: Artigo do MiCA, glossário)
    metadata_source LowCardinality(String) ,   -- 'Legislação', 'Paper', 'Glossário'
    embedding Array(Float32), -- the  nomic-embed-text vector
    
    -- Index (HNSW)
    INDEX idx_vector embedding TYPE vector_similarity('L2Distance', 'hnsw', 16, 200, 100, 'f32') GRANULARITY 1
) ENGINE = MergeTree()
ORDER BY id;



-- Create the user with a secure password
CREATE USER investigator_read IDENTIFIED WITH sha256_password BY 'YourSecurePassword123!';

-- Create a read-only role
CREATE ROLE read_only_nowa;

-- Grant SELECT permission only on the 'nowa' database
GRANT SELECT ON nowa.* TO read_only_nowa;

-- Assign the role to your user
GRANT read_only_nowa TO investigator_read;