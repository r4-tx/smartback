"use client"

import { Building2, FileText, Calculator, TrendingUp, CheckCircle2, Clock3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const indicadores = [
  { title: "Balancete do mes", value: "R$ 1.284.500,00", tone: "bg-primary/10 text-primary", icon: Calculator },
  { title: "Lançamentos pendentes", value: "14", tone: "bg-[#f59e0b]/10 text-[#f59e0b]", icon: Clock3 },
  { title: "Relatorios fechados", value: "38", tone: "bg-[#22c55e]/10 text-[#22c55e]", icon: CheckCircle2 },
  { title: "Crescimento", value: "+8,2%", tone: "bg-destructive/10 text-destructive", icon: TrendingUp },
]

const lancamentos = [
  { id: "CTB-001", descricao: "Fechamento mensal", status: "Concluido", data: "31/03/2026" },
  { id: "CTB-002", descricao: "Conferencia fiscal", status: "Pendente", data: "01/04/2026" },
  { id: "CTB-003", descricao: "Provisao folha", status: "Concluido", data: "30/03/2026" },
]

export function ContabilidadeContent() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>Contabilidade</span>
        <span>{">"}</span>
        <span className="text-foreground font-medium">Visao geral</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contabilidade</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe balancos, provisoes e fechamentos contabeis.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {indicadores.map((item) => (
          <Card key={item.title} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`flex items-center justify-center size-9 rounded-lg ${item.tone}`}>
                  <item.icon className="size-4" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{item.title}</p>
              <p className="text-lg font-bold text-foreground">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[0.95fr,1.05fr] gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">Resumo contabel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">Plano de contas</p>
              <p className="text-sm font-semibold text-foreground mt-1">Atualizado para o periodo atual</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">Fechamento</p>
              <p className="text-sm font-semibold text-foreground mt-1">Ultimo fechamento em 31/03/2026</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">Integracao fiscal</p>
              <p className="text-sm font-semibold text-foreground mt-1">Sincronizacao ativa com documentos fiscais</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">Lancamentos recentes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4 text-foreground font-medium">Lancamento</TableHead>
                  <TableHead className="text-foreground font-medium">Descricao</TableHead>
                  <TableHead className="text-foreground font-medium">Status</TableHead>
                  <TableHead className="text-foreground font-medium">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lancamentos.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="pl-4 text-sm text-foreground flex items-center gap-2">
                      <FileText className="size-4 text-muted-foreground" />
                      {item.id}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.descricao}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          item.status === "Concluido"
                            ? "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30"
                            : "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.data}</TableCell>
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
