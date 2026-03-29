import os
import json

HISTORY_DIR = "./chat_history"
os.makedirs(HISTORY_DIR, exist_ok=True)

def save_history(session_id: str, messages: list):
    # Convert to simple dictionary format 
    clean_messages = []
    for m in messages:
        if hasattr(m, 'model_dump'): 
            clean_messages.append(m.model_dump())
        elif isinstance(m, dict):
            clean_messages.append(m)
        else:
            clean_messages.append(dict(m))

    with open(f"{HISTORY_DIR}/{session_id}.json", "w") as f:
        json.dump(clean_messages, f, indent=2)

def get_history(session_id: str):
    file_path = f"{HISTORY_DIR}/{session_id}.json"
    
    if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
        return []
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read().strip()
            if not content:
                return []
            return json.loads(content) 
    except (json.JSONDecodeError, UnicodeDecodeError) as e:
        print(f"Error in session {session_id}: {e}")
        return []