import pyodbc

SERVER = 'LOCALHOST\\SQLEXPRESS'
DATABASE = 'SistemaAcesso'

CONNECTION_STRING = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={SERVER};DATABASE={DATABASE};Trusted_Connection=yes;'

def get_connection():
    """Abre e retorna uma conexão com o banco de dados SQL Server."""
    try:
        conn = pyodbc.connect(CONNECTION_STRING)
        return conn
    except Exception as e:
        print(f"Erro ao conectar com o banco de dados: {e}")
        raise e