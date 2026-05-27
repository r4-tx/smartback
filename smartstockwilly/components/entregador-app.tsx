"use client"

import { useEffect, useMemo, useState } from "react"
import {
  listClients,
  listDeliveries,
  listOrders,
  login,
  updateDeliveryStatus,
  type Client,
  type Delivery,
  type DeliveryStatus,
  type Order,
} from "@/lib/api"

type Tela = "login" | "home" | "detalhe" | "confirmado"

type EntregaRica = Delivery & {
  clientName: string
  orderNumber: string
  orderTotal: number
  orderItems: Order["items"]
}

function tagStyle(status: DeliveryStatus): { background: string; color: string } {
  if (status === "Pendente")  return { background: "#fffbeb", color: "#d97706" }
  if (status === "Em rota")   return { background: "#eff6ff", color: "#3b5bdb" }
  if (status === "Entregue")  return { background: "#f0fdf4", color: "#16a34a" }
  return { background: "#fef2f2", color: "#ef4444" }
}

export function EntregadorApp() {
  const [tela, setTela] = useState<Tela>("login")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [userName, setUserName] = useState("")
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)

  const [entregas, setEntregas] = useState<Delivery[]>([])
  const [pedidos, setPedidos] = useState<Order[]>([])
  const [clientes, setClientes] = useState<Client[]>([])
  const [entregaSelecionada, setEntregaSelecionada] = useState<EntregaRica | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErro("")
    setCarregando(true)
    try {
      const res = await login({ email, password: senha })
      setUserName(res.userName)
      await carregarDados()
      setTela("home")
    } catch {
      setErro("E-mail ou senha incorretos.")
    } finally {
      setCarregando(false)
    }
  }

  async function carregarDados() {
    const [e, p, c] = await Promise.all([listDeliveries(), listOrders(), listClients()])
    setEntregas(e)
    setPedidos(p)
    setClientes(c)
  }

  const entregasRicas = useMemo<EntregaRica[]>(() =>
    entregas.map((d) => {
      const pedido = pedidos.find((p) => p.id === d.orderId)
      const cliente = clientes.find((c) => c.id === d.clientId)
      return {
        ...d,
        clientName: cliente?.name ?? "Cliente não encontrado",
        orderNumber: pedido?.number ?? "-",
        orderTotal: pedido?.total ?? 0,
        orderItems: pedido?.items ?? [],
      }
    }),
    [entregas, pedidos, clientes]
  )

  const totais = useMemo(() => ({
    pendentes: entregas.filter((d) => d.status === "Pendente").length,
    emRota:    entregas.filter((d) => d.status === "Em rota").length,
    entregues: entregas.filter((d) => d.status === "Entregue").length,
    total:     entregas.filter((d) => d.status !== "Cancelada").length,
  }), [entregas])

  const progresso = totais.total === 0 ? 0 : Math.round((totais.entregues / totais.total) * 100)

  async function alterarStatus(id: string, status: DeliveryStatus) {
    const atualizada = await updateDeliveryStatus(id, status)
    setEntregas((prev) => prev.map((d) => (d.id === id ? atualizada : d)))
    if (entregaSelecionada?.id === id) {
      setEntregaSelecionada((prev) => prev ? { ...prev, status } : prev)
    }
  }

  function abrirDetalhe(entrega: EntregaRica) {
    setEntregaSelecionada(entrega)
    setTela("detalhe")
  }

  async function confirmarEntrega() {
    if (!entregaSelecionada) return
    await alterarStatus(entregaSelecionada.id, "Entregue")
    setTela("confirmado")
  }

  // recalcula entrega selecionada quando entregas mudam
  useEffect(() => {
    if (!entregaSelecionada) return
    const atualizada = entregasRicas.find((e) => e.id === entregaSelecionada.id)
    if (atualizada) setEntregaSelecionada(atualizada)
  }, [entregasRicas])

  const hoje = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })

  return (
    <div style={{ background: "#e5e7eb", minHeight: "100vh", display: "flex", justifyContent: "center", padding: "24px 16px", fontFamily: "'Geist', 'Inter', sans-serif" }}>
      <div style={{ width: 360, background: "#f5f5f5", border: "5px solid #222", borderRadius: 28, overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* ====== TELA LOGIN ====== */}
        {tela === "login" && (
          <div>
            <div style={{ background: "#3b5bdb", padding: "36px 20px 28px", textAlign: "center" }}>
              <div style={{ fontSize: 32 }}>📦</div>
              <h2 style={{ color: "white", fontSize: 20, fontWeight: 700, margin: "6px 0 4px" }}>SmartStock</h2>
              <p style={{ color: "#c5cef9", fontSize: 13 }}>Área do entregador</p>
            </div>

            <form onSubmit={handleLogin} style={{ background: "white", margin: 14, borderRadius: 8, padding: 20, border: "1px solid #ddd" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 4 }}>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                style={{ width: "100%", padding: "9px 10px", border: "1px solid #ccc", borderRadius: 5, fontSize: 14, fontFamily: "inherit", marginBottom: 14 }}
              />

              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 4 }}>Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: "100%", padding: "9px 10px", border: "1px solid #ccc", borderRadius: 5, fontSize: 14, fontFamily: "inherit", marginBottom: 14 }}
              />

              {erro && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 10 }}>{erro}</p>}

              <button
                type="submit"
                disabled={carregando}
                style={{ width: "100%", padding: 11, background: carregando ? "#93a3d8" : "#3b5bdb", color: "white", border: "none", borderRadius: 5, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              >
                {carregando ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: 11, color: "#999", padding: "8px 0 16px" }}>SmartStock © 2026</p>
          </div>
        )}

        {/* ====== TELA HOME ====== */}
        {tela === "home" && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1, overflowY: "auto" }}>
            <div style={{ background: "#3b5bdb", padding: "16px 16px 14px", color: "white" }}>
              <p style={{ fontSize: 12, opacity: 0.8 }}>Bom dia 👋</p>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>{userName}</h3>
              <small style={{ fontSize: 11, opacity: 0.65 }}>{hoje}</small>
            </div>

            <div style={{ display: "flex", gap: 8, padding: "12px 12px 0" }}>
              {[
                { n: totais.pendentes, t: "Pendentes", cor: "#f59e0b" },
                { n: totais.emRota,    t: "Em rota",   cor: "#3b5bdb" },
                { n: totais.entregues, t: "Entregues", cor: "#22c55e" },
              ].map(({ n, t, cor }) => (
                <div key={t} style={{ flex: 1, border: "1px solid #ddd", borderRadius: 6, padding: "10px 6px", textAlign: "center", background: "white" }}>
                  <b style={{ fontSize: 22, display: "block", color: cor }}>{n}</b>
                  <span style={{ fontSize: 10, color: "#777" }}>{t}</span>
                </div>
              ))}
            </div>

            <div style={{ margin: "12px 12px 0", background: "white", border: "1px solid #ddd", borderRadius: 6, padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#555", marginBottom: 6 }}>
                <span>Progresso do dia</span>
                <b>{progresso}%</b>
              </div>
              <div style={{ background: "#e0e0e0", height: 8, borderRadius: 4 }}>
                <div style={{ background: "#22c55e", height: 8, borderRadius: 4, width: `${progresso}%`, transition: "width 0.4s" }} />
              </div>
              <small style={{ fontSize: 11, color: "#999", display: "block", marginTop: 5 }}>{totais.entregues} de {totais.total} entregas concluídas</small>
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: "#999", padding: "14px 14px 6px", textTransform: "uppercase" }}>
              Todas as entregas
            </div>

            {entregasRicas.length === 0 && (
              <p style={{ textAlign: "center", fontSize: 13, color: "#aaa", padding: 24 }}>Nenhuma entrega encontrada</p>
            )}

            {entregasRicas.map((d) => (
              <div
                key={d.id}
                onClick={() => abrirDetalhe(d)}
                style={{ background: "white", border: "1px solid #ddd", borderRadius: 6, margin: "0 12px 10px", padding: 12, cursor: "pointer" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div>
                    <strong style={{ fontSize: 13, color: "#1e293b" }}>#{d.orderNumber} — {d.clientName}</strong>
                    <small style={{ display: "block", fontSize: 11, color: "#888", marginTop: 2 }}>{d.city}</small>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 3, height: "fit-content", ...tagStyle(d.status) }}>
                    {d.status}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "#888" }}>
                  📅 {d.scheduledDate} &nbsp;&nbsp;
                  💰 {d.orderTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
              </div>
            ))}

            <div style={{ background: "white", borderTop: "1px solid #ddd", display: "flex", padding: "8px 0 10px", marginTop: "auto" }}>
              {[["🏠","Início"],["📦","Entregas"],["🗺️","Rota"],["👤","Perfil"]].map(([icon, label], i) => (
                <div key={label} style={{ flex: 1, textAlign: "center", fontSize: 10, color: i === 0 ? "#3b5bdb" : "#999", cursor: "pointer", fontWeight: i === 0 ? 600 : 400 }}>
                  <div style={{ fontSize: 18 }}>{icon}</div>
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====== TELA DETALHE ====== */}
        {tela === "detalhe" && entregaSelecionada && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1, overflowY: "auto" }}>
            <div style={{ background: "white", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #e0e0e0" }}>
              <button onClick={() => setTela("home")} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#3b5bdb", fontFamily: "inherit" }}>←</button>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>Pedido #{entregaSelecionada.orderNumber}</span>
            </div>

            <div style={{ background: "#3b5bdb", padding: "14px 16px", color: "white" }}>
              <small style={{ fontSize: 12, opacity: 0.75 }}>Cliente</small>
              <h2 style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>{entregaSelecionada.clientName}</h2>
              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 3, display: "inline-block", marginTop: 6, ...tagStyle(entregaSelecionada.status) }}>
                {entregaSelecionada.status}
              </span>
            </div>

            <div style={{ background: "white", border: "1px solid #ddd", borderRadius: 6, margin: 12 }}>
              {[
                ["Cidade",         entregaSelecionada.city || "—"],
                ["Data",           entregaSelecionada.scheduledDate || "—"],
                ["Total do pedido", entregaSelecionada.orderTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 14px", borderBottom: "1px solid #f0f0f0", fontSize: 13 }}>
                  <span style={{ color: "#888" }}>{k}</span>
                  <span style={{ fontWeight: 600, color: k === "Total do pedido" ? "#3b5bdb" : "#1e293b" }}>{v}</span>
                </div>
              ))}
            </div>

            {entregaSelecionada.orderItems.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", padding: "4px 14px 6px" }}>Itens do pedido</div>
                <div style={{ background: "white", border: "1px solid #ddd", borderRadius: 6, margin: "0 12px" }}>
                  {entregaSelecionada.orderItems.map((item) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "9px 14px", borderBottom: "1px solid #f0f0f0", fontSize: 13 }}>
                      <div>
                        <span style={{ color: "#1e293b" }}>Produto</span>
                        <small style={{ display: "block", color: "#999", fontSize: 11 }}>{item.quantity} un</small>
                      </div>
                      <span style={{ fontWeight: 600 }}>
                        {item.subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div style={{ padding: "14px 12px", display: "flex", flexDirection: "column", gap: 8, marginTop: "auto" }}>
              {entregaSelecionada.status !== "Entregue" && entregaSelecionada.status !== "Cancelada" && (
                <button
                  onClick={confirmarEntrega}
                  style={{ padding: 12, background: "#22c55e", color: "white", border: "none", borderRadius: 5, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                >
                  ✓ Confirmar entrega
                </button>
              )}
              {entregaSelecionada.status === "Pendente" && (
                <button
                  onClick={() => alterarStatus(entregaSelecionada.id, "Em rota")}
                  style={{ padding: 12, background: "#3b5bdb", color: "white", border: "none", borderRadius: 5, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                >
                  🚛 Iniciar rota
                </button>
              )}
              {entregaSelecionada.status !== "Cancelada" && entregaSelecionada.status !== "Entregue" && (
                <button
                  onClick={() => alterarStatus(entregaSelecionada.id, "Cancelada")}
                  style={{ padding: 11, background: "white", color: "#ef4444", border: "1px solid #ef4444", borderRadius: 5, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                >
                  Cancelar entrega
                </button>
              )}
              {(entregaSelecionada.status === "Entregue" || entregaSelecionada.status === "Cancelada") && (
                <button
                  onClick={() => setTela("home")}
                  style={{ padding: 12, background: "#f1f3f5", color: "#1e293b", border: "1px solid #ddd", borderRadius: 5, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                >
                  Voltar
                </button>
              )}
            </div>
          </div>
        )}

        {/* ====== TELA CONFIRMADO ====== */}
        {tela === "confirmado" && entregaSelecionada && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ background: "white", padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>SmartStock</span>
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 24px" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>Entrega confirmada!</h2>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
                Pedido <b>#{entregaSelecionada.orderNumber}</b><br />
                para <b>{entregaSelecionada.clientName}</b><br />
                foi registrado como entregue.
              </p>
              <button
                onClick={() => setTela("home")}
                style={{ marginTop: 24, width: "100%", padding: 12, background: "#3b5bdb", color: "white", border: "none", borderRadius: 5, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              >
                Voltar ao início
              </button>
            </div>

            <div style={{ background: "white", borderTop: "1px solid #ddd", display: "flex", padding: "8px 0 10px" }}>
              {[["🏠","Início"],["📦","Entregas"],["🗺️","Rota"],["👤","Perfil"]].map(([icon, label], i) => (
                <div key={label} style={{ flex: 1, textAlign: "center", fontSize: 10, color: i === 0 ? "#3b5bdb" : "#999", fontWeight: i === 0 ? 600 : 400 }}>
                  <div style={{ fontSize: 18 }}>{icon}</div>
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
