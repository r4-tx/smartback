"use client"

import { useEffect, useMemo, useState } from "react"
import { MapPin, Truck, CheckCircle2, LayoutList, LayoutGrid, Calendar, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  listClients,
  listDeliveries,
  listOrders,
  type Client,
  type Delivery,
  type DeliveryStatus,
  type Order,
  updateDeliveryStatus,
} from "@/lib/api"

type EnrichedDelivery = Delivery & {
  orderNumber: string
  orderTotal: number
  clientName: string
}

function getStatusColor(status: DeliveryStatus): string {
  switch (status) {
    case "Pendente":
      return "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30"
    case "Em rota":
      return "bg-primary/10 text-primary border-primary/30"
    case "Entregue":
      return "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30"
    case "Cancelada":
    default:
      return "bg-destructive/10 text-destructive border-destructive/30"
  }
}

function DeliveryCard({
  delivery,
  onStatusChange,
}: {
  delivery: EnrichedDelivery
  onStatusChange: (id: string, status: DeliveryStatus) => void
}) {
  const nextStatus: Record<DeliveryStatus, { label: string; value: DeliveryStatus } | null> = {
    Pendente: { label: "Iniciar rota", value: "Em rota" },
    "Em rota": { label: "Confirmar entrega", value: "Entregue" },
    Entregue: null,
    Cancelada: null,
  }

  const next = nextStatus[delivery.status]

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">#{delivery.orderNumber}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[140px]">{delivery.clientName}</p>
        </div>
        <Badge variant="outline" className={getStatusColor(delivery.status)}>
          {delivery.status}
        </Badge>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">{delivery.city || "Cidade nao informada"}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="size-3 shrink-0" />
          <span>{delivery.scheduledDate || "Sem data"}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-foreground font-medium">
          <DollarSign className="size-3 shrink-0" />
          <span>
            {delivery.orderTotal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>
      </div>

      {next && (
        <button
          onClick={() => onStatusChange(delivery.id, next.value)}
          className="w-full text-xs py-1.5 rounded-md border border-border hover:bg-muted transition-colors"
        >
          {next.label}
        </button>
      )}
      {delivery.status !== "Cancelada" && delivery.status !== "Entregue" && (
        <button
          onClick={() => onStatusChange(delivery.id, "Cancelada")}
          className="w-full text-xs py-1 rounded-md text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors"
        >
          Cancelar
        </button>
      )}
    </div>
  )
}

function PainelView({
  enriched,
  onStatusChange,
}: {
  enriched: EnrichedDelivery[]
  onStatusChange: (id: string, status: DeliveryStatus) => void
}) {
  const columns: { title: string; status: DeliveryStatus; color: string }[] = [
    { title: "Pendentes", status: "Pendente", color: "text-[#f59e0b]" },
    { title: "Em rota", status: "Em rota", color: "text-primary" },
    { title: "Entregues", status: "Entregue", color: "text-[#22c55e]" },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {columns.map((col) => {
        const items = enriched.filter((d) => d.status === col.status)
        return (
          <div key={col.status} className="space-y-3">
            <div className="flex items-center justify-between">
              <p className={`text-sm font-semibold ${col.color}`}>{col.title}</p>
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>
            <div className="space-y-2 min-h-[80px]">
              {items.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">Nenhuma entrega</p>
              ) : (
                items.map((d) => (
                  <DeliveryCard key={d.id} delivery={d} onStatusChange={onStatusChange} />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function DeliveriesContent() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [view, setView] = useState<"lista" | "painel">("painel")

  useEffect(() => {
    void (async () => {
      const [deliveriesData, ordersData, clientsData] = await Promise.all([
        listDeliveries(),
        listOrders(),
        listClients(),
      ])
      setDeliveries(deliveriesData)
      setOrders(ordersData)
      setClients(clientsData)
    })()
  }, [])

  const enriched = useMemo(
    () =>
      deliveries.map((d) => {
        const order = orders.find((o) => o.id === d.orderId)
        const client = clients.find((c) => c.id === d.clientId)
        return {
          ...d,
          orderNumber: order?.number ?? "-",
          orderTotal: order?.total ?? 0,
          clientName: client?.name ?? "Cliente nao encontrado",
        }
      }),
    [deliveries, orders, clients]
  )

  const totals = useMemo(() => {
    const pending = deliveries.filter((d) => d.status === "Pendente").length
    const onRoute = deliveries.filter((d) => d.status === "Em rota").length
    const delivered = deliveries.filter((d) => d.status === "Entregue").length
    const total = deliveries.filter((d) => d.status !== "Cancelada").length
    const progress = total === 0 ? 0 : Math.round((delivered / total) * 100)
    return { pending, onRoute, delivered, total, progress }
  }, [deliveries])

  const handleStatusChange = (id: string, status: DeliveryStatus) => {
    void (async () => {
      const updated = await updateDeliveryStatus(id, status)
      setDeliveries((prev) => prev.map((d) => (d.id === id ? updated : d)))
    })()
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>Logistica</span>
        <span>{">"}</span>
        <span className="text-foreground font-medium">Entregas</span>
      </div>

      {/* cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center size-9 rounded-lg bg-[#f59e0b]/10">
              <Truck className="size-4 text-[#f59e0b]" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pendentes</p>
              <p className="text-lg font-bold text-foreground">{totals.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10">
              <MapPin className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Em rota</p>
              <p className="text-lg font-bold text-foreground">{totals.onRoute}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center size-9 rounded-lg bg-[#22c55e]/10">
              <CheckCircle2 className="size-4 text-[#22c55e]" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Entregues</p>
              <p className="text-lg font-bold text-foreground">{totals.delivered}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* barra de progresso */}
      <Card className="bg-card border-border mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Progresso das entregas</p>
            <p className="text-sm font-semibold text-foreground">{totals.progress}%</p>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-[#22c55e] rounded-full transition-all duration-500"
              style={{ width: `${totals.progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {totals.delivered} de {totals.total} entregas concluidas
          </p>
        </CardContent>
      </Card>

      {/* abas lista / painel */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">Entregas e rotas</CardTitle>
            <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
              <button
                onClick={() => setView("painel")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs transition-colors ${
                  view === "painel"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="size-3" />
                Painel
              </button>
              <button
                onClick={() => setView("lista")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs transition-colors ${
                  view === "lista"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutList className="size-3" />
                Lista
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {view === "painel" ? (
            <PainelView enriched={enriched} onStatusChange={handleStatusChange} />
          ) : (
            <div className="overflow-x-auto -mx-6">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6 text-foreground font-medium">Pedido</TableHead>
                    <TableHead className="text-foreground font-medium">Cliente</TableHead>
                    <TableHead className="text-foreground font-medium">Cidade / Rota</TableHead>
                    <TableHead className="text-foreground font-medium">Data programada</TableHead>
                    <TableHead className="text-right text-foreground font-medium">Valor</TableHead>
                    <TableHead className="text-foreground font-medium">Status</TableHead>
                    <TableHead className="text-right pr-6 text-foreground font-medium">Alterar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enriched.map((delivery) => (
                    <TableRow key={delivery.id} className="hover:bg-muted/30">
                      <TableCell className="pl-6 text-sm text-foreground">
                        #{delivery.orderNumber}
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {delivery.clientName}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {delivery.city}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {delivery.scheduledDate}
                      </TableCell>
                      <TableCell className="text-right text-sm text-foreground font-medium">
                        {delivery.orderTotal.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(delivery.status)}>
                          {delivery.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6 text-xs text-muted-foreground space-x-1">
                        <button
                          className="px-2 py-1 rounded-md border border-border hover:bg-muted"
                          onClick={() => handleStatusChange(delivery.id, "Pendente")}
                        >
                          Pendente
                        </button>
                        <button
                          className="px-2 py-1 rounded-md border border-border hover:bg-muted"
                          onClick={() => handleStatusChange(delivery.id, "Em rota")}
                        >
                          Em rota
                        </button>
                        <button
                          className="px-2 py-1 rounded-md border border-border hover:bg-muted"
                          onClick={() => handleStatusChange(delivery.id, "Entregue")}
                        >
                          Entregue
                        </button>
                        <button
                          className="px-2 py-1 rounded-md border border-destructive text-destructive hover:bg-destructive/10"
                          onClick={() => handleStatusChange(delivery.id, "Cancelada")}
                        >
                          Cancelar
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
