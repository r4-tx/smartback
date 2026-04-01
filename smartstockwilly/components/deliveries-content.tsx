"use client"

import { useEffect, useMemo, useState } from "react"
import { MapPin, Truck, CheckCircle2 } from "lucide-react"
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

export function DeliveriesContent() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [clients, setClients] = useState<Client[]>([])

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
    return { pending, onRoute, delivered }
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">Entregas e rotas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4 text-foreground font-medium">Pedido</TableHead>
                <TableHead className="text-foreground font-medium">Cliente</TableHead>
                <TableHead className="text-foreground font-medium">Cidade / Rota</TableHead>
                <TableHead className="text-foreground font-medium">Data programada</TableHead>
                <TableHead className="text-right text-foreground font-medium">Valor pedido</TableHead>
                <TableHead className="text-foreground font-medium">Status</TableHead>
                <TableHead className="text-right text-foreground font-medium">Alterar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enriched.map((delivery) => (
                <TableRow key={delivery.id} className="hover:bg-muted/30">
                  <TableCell className="pl-4 text-sm text-foreground">
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
                  <TableCell className="text-right text-xs text-muted-foreground space-x-1">
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
        </CardContent>
      </Card>
    </div>
  )
}
