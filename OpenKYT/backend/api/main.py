import os
import dotenv
from fastapi import FastAPI, Response
from fastapi.responses import StreamingResponse
from fastapi import Request
from pydantic import BaseModel
from starlette.middleware.sessions import SessionMiddleware
from uuid import uuid4
from run_analysis import run_analysis
from waitlist import add_to_waitlist

dotenv.load_dotenv()

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY"))

class ResetSession(BaseModel):
    session_id: str

@app.post("/analyze")
async def analyze(request: Request):
    data = await request.json()
    prompt = data.get("prompt")
    session_id = request.session.get("session_id")
    if not session_id:
        session_id = str(uuid4())
        request.session["session_id"] = session_id    
    return StreamingResponse(run_analysis(prompt, session_id), media_type="text/event-stream")

@app.get("/reset")
async def reset(request: Request):
    request.session.clear()
    return {"message": "Session reset successfully"}

@app.post("/waitlist")
async def waitlist(request: Request):
    data = await request.json()
    email = data.get("email")
    session_id = request.session.get("session_id")
    add_to_waitlist(email, session_id)
    return {"message": "Email added to waitlist"}
