import { useState, useEffect } from "react";

const USERS_DB = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    nome: "Carlos Administrador",
    tipo: "admin",
    acessos: [
      { data: "10/05/2026", hora: "08:14" },
      { data: "09/05/2026", hora: "17:32" },
      { data: "08/05/2026", hora: "09:05" },
    ],
  },
  {
    id: 2,
    username: "joao",
    password: "joao123",
    nome: "João Silva",
    tipo: "usuario",
    acessos: [
      { data: "10/05/2026", hora: "09:00" },
      { data: "07/05/2026", hora: "14:22" },
      { data: "05/05/2026", hora: "11:48" },
    ],
  },
  {
    id: 3,
    username: "maria",
    password: "maria123",
    nome: "Maria Souza",
    tipo: "usuario",
    acessos: [
      { data: "10/05/2026", hora: "10:15" },
      { data: "08/05/2026", hora: "16:00" },
    ],
  },
  {
    id: 4,
    username: "pedro",
    password: "pedro123",
    nome: "Pedro Costa",
    tipo: "usuario",
    acessos: [
      { data: "09/05/2026", hora: "13:20" },
    ],
  },
];

const now = () => {
  const d = new Date();
  return {
    data: d.toLocaleDateString("pt-BR"),
    hora: d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  };
};

export default function App() {
  const [page, setPage] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(USERS_DB);
  const [loginErr, setLoginErr] = useState("");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  const handleLogin = async () => {
    try {
      // 1. Envia o usuário e senha para o seu Back-end em Python
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password,
        }),
      });

      
      if (!response.ok) {
        setLoginErr("Usuário ou senha incorretos. Tente novamente.");
        return;
      }

      
      const data = await response.json();
      
      
      setCurrentUser(data.user);
      setLoginErr("");
      setLoginForm({ username: "", password: "" });
      setPage(data.user.tipo === "admin" ? "admin" : "usuario");
      
    } catch (error) {
      console.error(error);
      setLoginErr("Erro de conexão com o servidor Back-end.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("login");
  };

  if (page === "login") return <LoginPage form={loginForm} setForm={setLoginForm} onLogin={handleLogin} erro={loginErr} />;
  if (page === "usuario") return <UserPage user={currentUser} onLogout={handleLogout} />;
  if (page === "admin") return <AdminPage currentUser={currentUser} users={users} setUsers={setUsers} onLogout={handleLogout} />;
}

function LoginPage({ form, setForm, onLogin, erro }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #C8E6FA 0%, #A8D4F5 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <span style={{
        position: "absolute",
        fontSize: 320,
        fontWeight: 900,
        color: "rgba(255,255,255,0.22)",
        userSelect: "none",
        lineHeight: 1,
        bottom: -60,
        right: -20,
        letterSpacing: -20,
      }}>10</span>

      <div style={{
        background: "#fff",
        borderRadius: 20,
        padding: "48px 40px",
        width: 360,
        boxShadow: "0 8px 40px rgba(0,80,160,0.13)",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "#C8E6FA", display: "inline-flex",
            alignItems: "center", justifyContent: "center", marginBottom: 12,
          }}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="#2563EB" strokeWidth="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a2744" }}>Sistema de Acesso</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#6b7a99" }}>Faça login para continuar</p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7a99", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>USUÁRIO</label>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && onLogin()}
            placeholder="Digite seu usuário"
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "11px 14px", borderRadius: 10,
              border: "1.5px solid #dde3f0", fontSize: 14,
              outline: "none", color: "#1a2744", background: "#ffffff",
              transition: "border 0.2s",
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7a99", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>SENHA</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && onLogin()}
            placeholder="Digite sua senha"
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "11px 14px", borderRadius: 10,
              border: "1.5px solid #dde3f0", fontSize: 14,
              outline: "none", color: "#1a2744", background: "#ffffff",
            }}
          />
        </div>

        {erro && (
          <div style={{
            background: "#FEE2E2", border: "1px solid #FECACA",
            borderRadius: 8, padding: "10px 14px",
            fontSize: 13, color: "#991B1B", marginBottom: 16,
          }}>{erro}</div>
        )}

        <button
          onClick={onLogin}
          style={{
            width: "100%", padding: "13px",
            background: "#4ADE80", border: "none",
            borderRadius: 10, fontSize: 15, fontWeight: 700,
            color: "#14532D", cursor: "pointer",
            transition: "background 0.2s, transform 0.1s",
          }}
          onMouseOver={(e) => e.target.style.background = "#22C55E"}
          onMouseOut={(e) => e.target.style.background = "#4ADE80"}
        >Entrar</button>


      </div>
    </div>
  );
}

function UserPage({ user, onLogout }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#C8E6FA",
      fontFamily: "'Segoe UI', sans-serif",
      padding: 24,
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a2744" }}>Área do Usuário</h2>
          <button onClick={onLogout} style={{
            padding: "8px 18px", borderRadius: 8,
            background: "rgba(255,255,255,0.7)", border: "1px solid #b0c8e8",
            cursor: "pointer", fontSize: 13, color: "#2563EB", fontWeight: 600,
          }}>Sair</button>
        </div>

        <div style={{
          background: "#fff", borderRadius: 16, padding: 24,
          marginBottom: 20, boxShadow: "0 2px 12px rgba(0,80,160,0.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "#C8E6FA", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 700, color: "#2563EB",
            }}>{user.nome[0]}</div>
            <div>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a2744" }}>{user.nome}</p>
              <p style={{ margin: "3px 0 0", fontSize: 13, color: "#6b7a99" }}>ID: #{String(user.id).padStart(4, "0")}</p>
            </div>
            <span style={{
              marginLeft: "auto", background: "#DCFCE7",
              color: "#15803D", fontSize: 12, fontWeight: 600,
              padding: "4px 12px", borderRadius: 20,
            }}>Usuário Comum</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <InfoCard label="Nome de usuário" value={user.username} />
            <InfoCard label="Tipo de conta" value="Usuário padrão" />
          </div>
        </div>

        <div style={{
          background: "#fff", borderRadius: 16, padding: 24,
          boxShadow: "0 2px 12px rgba(0,80,160,0.08)",
        }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#1a2744" }}>Últimos Acessos</h3>
          {user.acessos.map((a, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", padding: "10px 0",
              borderBottom: i < user.acessos.length - 1 ? "1px solid #F1F5F9" : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: i === 0 ? "#22C55E" : "#CBD5E1", display: "block",
                }}/>
                <span style={{ fontSize: 14, color: "#374151" }}>{a.data}</span>
              </div>
              <span style={{ fontSize: 13, color: "#6b7a99", fontWeight: 500 }}>{a.hora}</span>
              {i === 0 && <span style={{ fontSize: 11, background: "#F0FDF4", color: "#15803D", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>Atual</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminPage({ currentUser, users, setUsers, onLogout }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", password: "", nome: "", tipo: "usuario" });
  const [msg, setMsg] = useState("");

  const filtered = users.filter(
    (u) =>
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  const promover = (id) => {
    setUsers(users.map((u) => u.id === id ? { ...u, tipo: "admin" } : u));
    if (selected?.id === id) setSelected({ ...selected, tipo: "admin" });
    setMsg("Usuário promovido a administrador com sucesso!");
    setTimeout(() => setMsg(""), 3000);
  };

  const criarUsuario = () => {
    if (!newUser.username || !newUser.password || !newUser.nome) {
      setMsg("Preencha todos os campos!");
      setTimeout(() => setMsg(""), 3000);
      return;
    }
    const novo = { ...newUser, id: Date.now(), acessos: [] };
    setUsers([...users, novo]);
    setNewUser({ username: "", password: "", nome: "", tipo: "usuario" });
    setShowNew(false);
    setMsg("Novo usuário criado com sucesso!");
    setTimeout(() => setMsg(""), 3000);
  };

  const todosAcessos = [...users]
    .flatMap((u) => u.acessos.map((a) => ({ ...a, nome: u.nome })))
    .sort((a, b) => b.hora.localeCompare(a.hora))
    .slice(0, 8);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1E3A5F",
      fontFamily: "'Segoe UI', sans-serif",
      color: "#fff",
      padding: 24,
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Painel do Administrador</h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#93B8D9" }}>Bem-vindo, {currentUser.nome}</p>
          </div>
          <button onClick={onLogout} style={{
            padding: "8px 18px", borderRadius: 8,
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            cursor: "pointer", fontSize: 13, color: "#fff", fontWeight: 600,
          }}>Sair</button>
        </div>

        {msg && (
          <div style={{
            background: "#4ADE80", color: "#14532D",
            borderRadius: 10, padding: "12px 18px",
            fontWeight: 600, fontSize: 14, marginBottom: 20,
          }}>{msg}</div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
          <StatCard label="Total de usuários" value={users.length} color="#2563EB" />
          <StatCard label="Administradores" value={users.filter((u) => u.tipo === "admin").length} color="#7C3AED" />
          <StatCard label="Usuários comuns" value={users.filter((u) => u.tipo === "usuario").length} color="#059669" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Usuários</h3>
              <button onClick={() => setShowNew(!showNew)} style={{
                padding: "6px 14px", borderRadius: 8, background: "#4ADE80",
                border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#14532D",
              }}>+ Novo</button>
            </div>

            {showNew && (
              <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: 14, marginBottom: 14 }}>
                <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, color: "#93B8D9" }}>Novo usuário</p>
                {["nome", "username", "password"].map((f) => (
                  <input key={f} value={newUser[f]}
                    onChange={(e) => setNewUser({ ...newUser, [f]: e.target.value })}
                    placeholder={f === "nome" ? "Nome completo" : f === "username" ? "Nome de usuário" : "Senha"}
                    type={f === "password" ? "password" : "text"}
                    style={{
                      width: "100%", boxSizing: "border-box", marginBottom: 8,
                      padding: "8px 12px", borderRadius: 8,
                      border: "none", fontSize: 13, background: "rgba(255,255,255,0.15)",
                      color: "#fff", outline: "none",
                    }}
                  />
                ))}
                <select value={newUser.tipo} onChange={(e) => setNewUser({ ...newUser, tipo: e.target.value })}
                  style={{
                    width: "100%", boxSizing: "border-box", marginBottom: 10,
                    padding: "8px 12px", borderRadius: 8,
                    border: "none", fontSize: 13, background: "rgba(255,255,255,0.15)", color: "#fff",
                  }}>
                  <option value="usuario">Usuário comum</option>
                  <option value="admin">Administrador</option>
                </select>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={criarUsuario} style={{ flex: 1, padding: "8px", borderRadius: 8, background: "#4ADE80", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, color: "#14532D" }}>Criar</button>
                  <button onClick={() => setShowNew(false)} style={{ flex: 1, padding: "8px", borderRadius: 8, background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", fontSize: 13, color: "#fff" }}>Cancelar</button>
                </div>
              </div>
            )}

            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar usuário..."
              style={{
                width: "100%", boxSizing: "border-box", marginBottom: 10,
                padding: "9px 12px", borderRadius: 8,
                border: "none", fontSize: 13, background: "rgba(255,255,255,0.12)",
                color: "#fff", outline: "none",
              }}
            />

            <div style={{ maxHeight: 280, overflowY: "auto" }}>
              {filtered.map((u) => (
                <div key={u.id} onClick={() => setSelected(selected?.id === u.id ? null : u)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                    background: selected?.id === u.id ? "rgba(96,165,250,0.25)" : "rgba(255,255,255,0.05)",
                    marginBottom: 6, transition: "background 0.15s",
                  }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: u.tipo === "admin" ? "#7C3AED" : "#2563EB",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0,
                  }}>{u.nome[0]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.nome}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#93B8D9" }}>@{u.username}</p>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                    background: u.tipo === "admin" ? "rgba(124,58,237,0.3)" : "rgba(37,99,235,0.3)",
                    color: u.tipo === "admin" ? "#C4B5FD" : "#93C5FD",
                  }}>{u.tipo === "admin" ? "ADMIN" : "USER"}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            {selected ? (
              <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
                <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>Detalhes</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: selected.tipo === "admin" ? "#7C3AED" : "#2563EB",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, fontWeight: 700, color: "#fff",
                  }}>{selected.nome[0]}</div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>{selected.nome}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#93B8D9" }}>@{selected.username}</p>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                  <InfoCardDark label="ID" value={`#${String(selected.id).padStart(4, "0")}`} />
                  <InfoCardDark label="Tipo" value={selected.tipo === "admin" ? "Administrador" : "Usuário"} />
                  <InfoCardDark label="Acessos" value={selected.acessos.length} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <p style={{ margin: "0 0 8px", fontSize: 12, color: "#93B8D9", fontWeight: 600 }}>ÚLTIMOS ACESSOS</p>
                  {selected.acessos.slice(0, 3).map((a, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: 13 }}>
                      <span style={{ color: "#CBD5E1" }}>{a.data}</span>
                      <span style={{ color: "#93B8D9" }}>{a.hora}</span>
                    </div>
                  ))}
                  {selected.acessos.length === 0 && <p style={{ color: "#93B8D9", fontSize: 13 }}>Nenhum acesso registrado</p>}
                </div>
                {selected.tipo === "usuario" && (
                  <button onClick={() => promover(selected.id)} style={{
                    width: "100%", padding: "10px", borderRadius: 8,
                    background: "#7C3AED", border: "none", cursor: "pointer",
                    fontSize: 13, fontWeight: 700, color: "#fff",
                  }}>⬆ Promover a Administrador</button>
                )}
              </div>
            ) : (
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 20, marginBottom: 20, textAlign: "center", height: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#93B8D9", fontSize: 14 }}>Selecione um usuário para ver os detalhes</p>
              </div>
            )}

            <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>Histórico Geral de Acessos</h3>
              {todosAcessos.map((a, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", fontSize: 12 }}>
                  <span style={{ color: "#CBD5E1", fontWeight: 500 }}>{a.nome}</span>
                  <span style={{ color: "#93B8D9" }}>{a.data} {a.hora}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.08)", borderRadius: 14,
      padding: "18px 20px", borderLeft: `4px solid ${color}`,
    }}>
      <p style={{ margin: "0 0 6px", fontSize: 12, color: "#93B8D9", fontWeight: 600 }}>{label.toUpperCase()}</p>
      <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#fff" }}>{value}</p>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "10px 14px" }}>
      <p style={{ margin: "0 0 3px", fontSize: 11, color: "#6b7a99", fontWeight: 600 }}>{label.toUpperCase()}</p>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1a2744" }}>{value}</p>
    </div>
  );
}

function InfoCardDark({ label, value }) {
  return (
    <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "8px 12px" }}>
      <p style={{ margin: "0 0 2px", fontSize: 10, color: "#93B8D9", fontWeight: 600 }}>{label.toUpperCase()}</p>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#fff" }}>{value}</p>
    </div>
  );
}
