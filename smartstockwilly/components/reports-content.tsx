"use client"

import { BarChart3, FileText, LineChart, TrendingUp, Download, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const reportCards = [
  {
    title: "Vendas do mes",
    value: "R$ 284.500,00",
    description: "+12,4% em relacao ao mes anterior",
    icon: TrendingUp,
    tone: "bg-[#22c55e]/10 text-[#22c55e]",
  },
  {
    title: "Pedidos faturados",
    value: "184",
    description: "38 pendentes de faturamento",
    icon: FileText,
    tone: "bg-primary/10 text-primary",
  },
  {
    title: "Produtos com baixa rotacao",
    value: "27",
    description: "Itens exigem revisao de estoque",
    icon: BarChart3,
    tone: "bg-[#f59e0b]/10 text-[#f59e0b]",
  },
  {
    title: "Ticket medio",
    value: "R$ 1.546,20",
    description: "Crescimento de 4,1% no periodo",
    icon: LineChart,
    tone: "bg-destructive/10 text-destructive",
  },
]

const topReports = [
  { name: "Resumo financeiro", status: "Disponivel", updatedAt: "Hoje, 08:15" },
  { name: "Performance de vendas", status: "Disponivel", updatedAt: "Hoje, 08:15" },
  { name: "Estoque critico", status: "Requer atencao", updatedAt: "Hoje, 08:15" },
  { name: "Fiscal e documentos", status: "Disponivel", updatedAt: "Hoje, 08:15" },
]

export function ReportsContent() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>Relatorios</span>
        <span>{">"}</span>
        <span className="text-foreground font-medium">Visao geral</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Central de relatorios</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe indicadores de vendas, estoque, financeiro e fiscal em um so lugar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <CalendarDays className="size-4" />
            Ultimos 30 dias
          </Button>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="size-4" />
            Exportar relatorio
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {reportCards.map((card) => (
          <Card key={card.title} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`flex items-center justify-center size-9 rounded-lg ${card.tone}`}>
                  <card.icon className="size-4" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{card.title}</p>
              <p className="text-lg font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr,1fr] gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">Resumo rapido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-7 gap-2 items-end h-56">
              {[42, 58, 40, 72, 64, 88, 76].map((height, index) => (
                <div key={index} className="flex flex-col items-center gap-2 h-full">
                  <div
                    className="w-full rounded-t-md bg-primary/80"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {["S", "T", "Q", "Q", "S", "S", "D"][index]}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">Pedidos analisados</p>
                <p className="text-sm font-semibold text-foreground mt-1">1.248 registros</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">Margem media</p>
                <p className="text-sm font-semibold text-foreground mt-1">32,8%</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">Alertas ativos</p>
                <p className="text-sm font-semibold text-foreground mt-1">5 itens</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">Relatorios disponiveis</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4 text-foreground font-medium">Relatorio</TableHead>
                  <TableHead className="text-foreground font-medium">Status</TableHead>
                  <TableHead className="text-foreground font-medium">Atualizacao</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topReports.map((report) => (
                  <TableRow key={report.name} className="hover:bg-muted/30">
                    <TableCell className="pl-4 text-sm text-foreground">{report.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          report.status === "Disponivel"
                            ? "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30"
                            : "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30"
                        }
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{report.updatedAt}</TableCell>
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
