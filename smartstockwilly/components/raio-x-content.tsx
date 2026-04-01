"use client"

import { BarChart3, ArrowUpRight, ArrowDownRight, TrendingUp, Package, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const insights = [
  {
    title: "Faturamento do mes",
    value: "R$ 284.500,00",
    change: "+12,4%",
    tone: "bg-[#22c55e]/10 text-[#22c55e]",
    icon: TrendingUp,
  },
  {
    title: "Pedidos em aberto",
    value: "38",
    change: "-3,2%",
    tone: "bg-[#f59e0b]/10 text-[#f59e0b]",
    icon: AlertCircle,
  },
  {
    title: "Itens com giro alto",
    value: "112",
    change: "+8,9%",
    tone: "bg-primary/10 text-primary",
    icon: Package,
  },
  {
    title: "Margem operacional",
    value: "32,8%",
    change: "+1,7%",
    tone: "bg-destructive/10 text-destructive",
    icon: BarChart3,
  },
]

const highlights = [
  { metric: "Vendas", value: "R$ 144 mil", trend: "up" },
  { metric: "Estoque", value: "R$ 91 mil", trend: "up" },
  { metric: "Despesas", value: "R$ 48 mil", trend: "down" },
  { metric: "Lucro", value: "R$ 53 mil", trend: "up" },
]

const alerts = [
  { item: "Produto com baixo estoque", status: "2 itens", priority: "Alta" },
  { item: "Contas vencendo em 7 dias", status: "9 títulos", priority: "Media" },
  { item: "Pedidos atrasados", status: "5 pedidos", priority: "Alta" },
]

export function RaioXContent() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>Raio X</span>
        <span>{">"}</span>
        <span className="text-foreground font-medium">Visao geral</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Raio X</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visao consolidada de vendas, estoque, margens e alertas operacionais.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {insights.map((item) => (
          <Card key={item.title} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`flex items-center justify-center size-9 rounded-lg ${item.tone}`}>
                  <item.icon className="size-4" />
                </div>
                <span
                  className={`text-xs font-medium flex items-center gap-0.5 ${
                    item.change.startsWith("+") ? "text-[#22c55e]" : "text-destructive"
                  }`}
                >
                  {item.change.startsWith("+") ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                  {item.change}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{item.title}</p>
              <p className="text-lg font-bold text-foreground">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr,0.8fr] gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">Indicadores chave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {highlights.map((item) => (
                <div key={item.metric} className="rounded-lg border border-border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">{item.metric}</p>
                  <p className="text-sm font-semibold text-foreground mt-1 flex items-center gap-1">
                    {item.value}
                    {item.trend === "up" ? <ArrowUpRight className="size-3.5 text-[#22c55e]" /> : <ArrowDownRight className="size-3.5 text-destructive" />}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">Alertas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4 text-foreground font-medium">Item</TableHead>
                  <TableHead className="text-foreground font-medium">Status</TableHead>
                  <TableHead className="text-foreground font-medium">Prioridade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.item} className="hover:bg-muted/30">
                    <TableCell className="pl-4 text-sm text-foreground">{alert.item}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{alert.status}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          alert.priority === "Alta"
                            ? "bg-destructive/10 text-destructive border-destructive/30"
                            : "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30"
                        }
                      >
                        {alert.priority}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
