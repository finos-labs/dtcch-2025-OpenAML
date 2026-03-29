from lib.clickhouse import ClickHouseClient

def add_to_waitlist(email: str, session_id: str):
    client = ClickHouseClient()
    SQL = "INSERT INTO marketing_leads (email, session_id) VALUES (%(email)s, %(session_id)s)"
    client.execute(SQL, {'email': email, 'session_id': session_id})
    return True