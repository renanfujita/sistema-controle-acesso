from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from src.database import get_connection
from src.security import verify_password, create_access_token, get_password_hash
import pyodbc

app = FastAPI(title="API Sistema de Controle de Acesso")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/login")
def login(req: LoginRequest):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        
        query = """
            SELECT U.Id, U.Nome, U.Username, U.Senha, T.Nome AS Tipo
            FROM Usuarios U
            INNER JOIN TiposUsuario T ON T.Id = U.TipoId
            WHERE U.Username = ?
        """
        cursor.execute(query, req.username)
        row = cursor.fetchone()

        
        if not row:
            raise HTTPException(status_code=401, detail="Usuário ou senha incorretos.")

        user_id = row[0]
        nome = row[1]
        db_username = row[2]
        db_password = row[3]
        tipo = row[4]

        
        if not verify_password(req.password, db_password):
            raise HTTPException(status_code=401, detail="Usuário ou senha incorretos.")

        
        cursor.execute("EXEC SP_RegistrarAcesso @UsuarioId=?", user_id)
        conn.commit()

        
        cursor.execute("SELECT TOP 3 DataHora FROM Acessos WHERE UsuarioId = ? ORDER BY DataHora DESC", user_id)
        acessos_db = cursor.fetchall()
        acessos_formatados = []
        for a in acessos_db:
            
            acessos_formatados.append({
                "data": a[0].strftime("%d/%m/%Y"),
                "hora": a[0].strftime("%H:%M")
            })

        
        token_data = {"sub": db_username, "id": user_id, "tipo": tipo, "nome": nome}
        token = create_access_token(token_data)

        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "nome": nome,
                "username": db_username,
                "tipo": tipo,
                "acessos": acessos_formatados
            }
        }

    except pyodbc.Error as e:
        raise HTTPException(status_code=500, detail="Erro no banco de dados.")
    finally:
        conn.close()


# Estrutura do pacote de novo usuário que o Front-end vai enviar
class NovoUsuarioRequest(BaseModel):
    nome: str
    username: str
    password: str
    tipo: str

@app.post("/usuarios")
def criar_usuario(req: NovoUsuarioRequest):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # 1. CRIPTOGRAFIA NA PRÁTICA: Transforma a senha em texto num Hash irreversível
        senha_criptografada = get_password_hash(req.password)

        # 2. Define o ID do tipo de usuário conforme a tabela TiposUsuario (1 para admin, 2 para usuário comum)
        tipo_id = 1 if req.tipo == "admin" else 2

        # 3. Insere o novo usuário no banco de dados já com a senha protegida
        query = """
            INSERT INTO Usuarios (Username, Senha, Nome, TipoId)
            VALUES (?, ?, ?, ?)
        """
        cursor.execute(query, req.username, senha_criptografada, req.nome, tipo_id)
        conn.commit()

        return {"mensagem": "Usuário criado com sucesso!"}

    except pyodbc.IntegrityError:
        # Evita que o sistema quebre se tentarem cadastrar um username que já existe
        raise HTTPException(status_code=400, detail="Este nome de usuário já está em uso.")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro interno ao criar usuário.")
    finally:
        conn.close()