"use client"

import { Download, FileText, QrCode, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const boletos = [
  { id: "B-1024", cliente: "Loja Alfa", valor: "R$ 1.240,00", vencimento: "08/03/2026", status: "Aberto" },
  { id: "B-1025", cliente: "Mercado Central", valor: "R$ 890,00", vencimento: "12/03/2026", status: "Pago" },
  { id: "B-1026", cliente: "Distribuidora Norte", valor: "R$ 4.210,00", vencimento: "15/03/2026", status: "Vencido" },
]

export function BoletosContent() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>Financeiro</span>
        <span>{">"}</span>
        <span className="text-foreground font-medium">Boletos</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Boletos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Emissao, acompanhamento e baixa de boletos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="size-4" />
            Exportar
          </Button>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="size-4" />
            Novo boleto
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Boletos abertos</p>
            <p className="text-lg font-bold text-foreground">18</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Liquidados hoje</p>
            <p className="text-lg font-bold text-foreground">6</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Valor em aberto</p>
            <p className="text-lg font-bold text-foreground">R$ 26.430,00</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-lg font-semibold text-foreground">Lista de boletos</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Buscar boleto..." className="pl-9 bg-card" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4 text-foreground font-medium">Numero</TableHead>
                <TableHead className="text-foreground font-medium">Cliente</TableHead>
                <TableHead className="text-foreground font-medium">Vencimento</TableHead>
                <TableHead className="text-right text-foreground font-medium">Valor</TableHead>
                <TableHead className="text-foreground font-medium">Status</TableHead>
                <TableHead className="text-center text-foreground font-medium">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {boletos.map((boleto) => (
                <TableRow key={boleto.id} className="hover:bg-muted/30">
                  <TableCell className="pl-4 text-sm text-foreground flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground" />
                    {boleto.id}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{boleto.cliente}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{boleto.vencimento}</TableCell>
                  <TableCell className="text-right text-sm font-medium text-foreground">{boleto.valor}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        boleto.status === "Pago"
                          ? "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30"
                          : boleto.status === "Aberto"
                            ? "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30"
                            : "bg-destructive/10 text-destructive border-destructive/30"
                      }
                    >
                      {boleto.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" className="size-7">
                      <QrCode className="size-3.5 text-muted-foreground" />
                    </Button>
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
