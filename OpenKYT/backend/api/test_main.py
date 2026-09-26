import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch
import main

client = TestClient(app)

def test_reset():
    response = client.get("/reset")
    assert response.status_code == 200
    assert response.json() == {"message": "Session reset successfully"}

@patch('main.add_to_waitlist')
def test_waitlist(mock_add_to_waitlist):
    response = client.post("/waitlist", json={"email": "test@example.com"})
    assert response.status_code == 200
    assert response.json() == {"message": "Email added to waitlist"}
    mock_add_to_waitlist.assert_called_once()
