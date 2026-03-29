import os
from clickhouse_driver import Client
from dotenv import load_dotenv

load_dotenv()


class ClickHouseClient:
    def __init__(self):
        self.host = os.getenv('CLICKHOUSE_HOST', 'localhost')
        self.port = int(os.getenv('CLICKHOUSE_PORT', 9000))
        self.user = os.getenv('CLICKHOUSE_USER', 'default')
        self.password = os.getenv('CLICKHOUSE_PASSWORD', '')
        self.database = os.getenv('CLICKHOUSE_DB', 'default')
        self.client = None

    def get_client(self):
        if not self.client:
            try:
                self.client = Client(
                    host=self.host,
                    port=self.port,
                    user=self.user,
                    password=self.password,
                    database=self.database
                )
            except Exception as e:
                print(f"Failed to connect to ClickHouse: {e}")
                raise
        return self.client

    def query(self, query):
        client = self.get_client()
        try:
            return client.execute(query)
        except Exception as e:
            print(f"Failed to execute query: {e}")
            raise

    def execute(self, query, params=None):
        client = self.get_client()
        try:
            return client.execute(query, params)
        except Exception as e:
            print(f"Failed to execute query: {e}")
            raise