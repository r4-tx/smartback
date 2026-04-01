"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Search, MoreVertical, Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  listClients,
  listOrders,
  type Client,
  type Order,
  type OrderStatus,
  updateOrderStatus,
} from "@/lib/api"

function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case "Faturado":
      return "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30"
    case "Cancelado":
      return "bg-destructive/10 text-destructive border-destructive/30"
    case "Pendente":
      return "bg-primary/10 text-primary border-primary/30"
    case "Entregue":
      return "bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
    case "Orcamento":
    default:
      return "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30"
  }
}

export function SalesListContent() {
  const [search, setSearch] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    void (async () => {
      const [ordersData, clientsData] = await Promise.all([listOrders(), listClients()])
      setOrders(ordersData)
      setClients(clientsData)
    })()
  }, [])

  const withClient = useMemo(
    () =>
      orders.map((o) => ({
        ...o,
        clientName: clients.find((c) => c.id === o.clientId)?.name ?? "Cliente nao encontrado",
      })),
    [orders, clients]
  )

  const filtered = withClient.filter(
    (o) =>
      o.clientName.toLowerCase().includes(search.toLowerCase()) ||
      o.number.includes(search)
  )

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    void (async () => {
      const updated = await updateOrderStatus(orderId, status)
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)))
    })()
  }

  const totalAmount = useMemo(
    () => orders.reduce((acc, o) => acc + (o.total || 0), 0),
    [orders]
  )

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>Vendas</span>
        <span>{">"}</span>
        <span className="text-foreground font-medium">Pedidos de venda</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente ou numero"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-sm">
            <Filter className="size-3.5" />
            Filtros
          </Button>
        </div>
        <Link href="/vendas/orcamentos">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus className="size-4" />
            Novo pedido de venda
          </Button>
        </Link>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Pedidos de venda</CardTitle>
          <div className="text-sm text-muted-foreground flex gap-4">
            <span>
              Pedidos:{" "}
              <span className="font-semibold text-foreground">{orders.length}</span>
            </span>
            <span>
              Total:{" "}
              <span className="font-semibold text-foreground">
                {totalAmount.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4 text-foreground font-medium">Numero</TableHead>
                <TableHead className="text-foreground font-medium">Data</TableHead>
                <TableHead className="text-foreground font-medium">Cliente</TableHead>
                <TableHead className="text-right text-foreground font-medium">Valor total</TableHead>
                <TableHead className="text-foreground font-medium">Status</TableHead>
                <TableHead className="text-center text-foreground font-medium">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/30">
                  <TableCell className="pl-4 text-sm font-medium text-foreground">
                    #{order.number}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                  <TableCell className="text-sm text-foreground">{order.clientName}</TableCell>
                  <TableCell className="text-right text-sm font-medium text-foreground">
                    {order.total.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-7">
                          <MoreVertical className="size-3.5 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, "Orcamento")}>
                          Marcar como orçamento
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, "Pendente")}>
                          Marcar como pendente
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, "Faturado")}>
                          Marcar como faturado
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, "Entregue")}>
                          Marcar como entregue
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleStatusChange(order.id, "Cancelado")}
                        >
                          Cancelar pedido
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
