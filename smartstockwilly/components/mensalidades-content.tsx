"use client"

import { Clock3, CreditCard, Plus, Search, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mensalidades = [
  { id: "M-01", plano: "Plano Gold", cliente: "Academia Vigor", valor: "R$ 129,90", status: "Ativa" },
  { id: "M-02", plano: "Plano Premium", cliente: "Escola Nova Era", valor: "R$ 249,90", status: "Vencida" },
  { id: "M-03", plano: "Plano Basic", cliente: "Studio Prime", valor: "R$ 89,90", status: "Ativa" },
]

export function MensalidadesContent() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>Financeiro</span>
        <span>{">"}</span>
        <span className="text-foreground font-medium">Mensalidades</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mensalidades</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Controle de recorrencia, contratos e renovacoes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Search className="size-4" />
            Buscar contrato
          </Button>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="size-4" />
            Nova mensalidade
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Mensalidades ativas</p>
            <p className="text-lg font-bold text-foreground">124</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Vencidas</p>
            <p className="text-lg font-bold text-foreground">7</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Receita recorrente</p>
            <p className="text-lg font-bold text-foreground">R$ 18.560,00</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">Mensalidades cadastradas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4 text-foreground font-medium">Contrato</TableHead>
                <TableHead className="text-foreground font-medium">Cliente</TableHead>
                <TableHead className="text-foreground font-medium">Plano</TableHead>
                <TableHead className="text-right text-foreground font-medium">Valor</TableHead>
                <TableHead className="text-foreground font-medium">Status</TableHead>
                <TableHead className="text-center text-foreground font-medium">Atualizacao</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mensalidades.map((mensalidade) => (
                <TableRow key={mensalidade.id} className="hover:bg-muted/30">
                  <TableCell className="pl-4 text-sm text-foreground flex items-center gap-2">
                    <CreditCard className="size-4 text-muted-foreground" />
                    {mensalidade.id}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{mensalidade.cliente}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{mensalidade.plano}</TableCell>
                  <TableCell className="text-right text-sm font-medium text-foreground">{mensalidade.valor}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        mensalidade.status === "Ativa"
                          ? "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30"
                          : "bg-destructive/10 text-destructive border-destructive/30"
                      }
                    >
                      {mensalidade.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="size-3.5" />
                      Hoje
                    </span>
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
