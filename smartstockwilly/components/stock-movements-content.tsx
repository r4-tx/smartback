"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, Plus, ArrowUpDown, Package, ArrowUp, ArrowDown } from "lucide-react"
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
  addStockMovement,
  listProducts,
  listStockMovements,
  type Product,
  type StockMovement,
} from "@/lib/api"

interface NewMovementFormState {
  productId: string
  type: "Entrada" | "Saida"
  quantity: string
  origin: string
}

const emptyForm: NewMovementFormState = {
  productId: "",
  type: "Entrada",
  quantity: "0",
  origin: "",
}

export function StockMovementsContent() {
  const [search, setSearch] = useState("")
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<NewMovementFormState>(emptyForm)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    void (async () => {
      const [movementsData, productsData] = await Promise.all([listStockMovements(), listProducts()])
      setMovements(movementsData)
      setProducts(productsData)
    })()
  }, [])

  const withNames = useMemo(
    () =>
      movements.map((m) => ({
        ...m,
        productName: products.find((p) => p.id === m.productId)?.name ?? "Produto desconhecido",
        unit: products.find((p) => p.id === m.productId)?.unit ?? "",
      })),
    [movements, products]
  )

  const filtered = withNames.filter((m) =>
    m.productName.toLowerCase().includes(search.toLowerCase()) ||
    m.origin.toLowerCase().includes(search.toLowerCase())
  )

  const totalProducts = useMemo(
    () => products.length,
    [products]
  )

  const totalStock = useMemo(
    () => products.reduce((acc, p) => acc + (p.stock || 0), 0),
    [products]
  )

  const totalEntries = useMemo(
    () => movements.filter((m) => m.type === "Entrada").length,
    [movements]
  )

  const totalExits = useMemo(
    () => movements.filter((m) => m.type === "Saida").length,
    [movements]
  )

  const handleFormChange = (field: keyof NewMovementFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value as any }))
  }

  const canSave =
    form.productId !== "" &&
    Number(form.quantity.replace(",", ".")) > 0 &&
    !isSaving

  const handleSubmit = () => {
    if (!canSave) return
    setIsSaving(true)
    void (async () => {
      const qty = Number(form.quantity.replace(",", "."))
      const created = await addStockMovement({
        productId: form.productId,
        type: form.type,
        quantity: Number.isFinite(qty) ? qty : 0,
        origin: form.origin.trim() || (form.type === "Entrada" ? "Ajuste manual de entrada" : "Ajuste manual de saida"),
      })
      setMovements((prev) => [created, ...prev])
      setProducts(await listProducts())
      setForm(emptyForm)
      setIsSaving(false)
    })()
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>Estoque</span>
        <span>{">"}</span>
        <span className="text-foreground font-medium">Movimentacoes</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10">
              <Package className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total de produtos</p>
              <p className="text-lg font-bold text-foreground">{totalProducts}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10">
              <ArrowUp className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Itens em estoque</p>
              <p className="text-lg font-bold text-foreground">{totalStock}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center size-9 rounded-lg bg-[#22c55e]/10">
              <ArrowUp className="size-4 text-[#22c55e]" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Entradas (registros)</p>
              <p className="text-lg font-bold text-foreground">{totalEntries}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center size-9 rounded-lg bg-destructive/10">
              <ArrowDown className="size-4 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Saidas (registros)</p>
              <p className="text-lg font-bold text-foreground">{totalExits}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1.6fr] gap-4 mb-4">
        <div className="flex items-center">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por produto ou origem"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
        </div>
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">
              Nova movimentacao manual
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <select
              className="h-9 rounded-md border border-input bg-card px-3 text-sm"
              value={form.productId}
              onChange={(e) => handleFormChange("productId", e.target.value)}
            >
              <option value="">Selecione um produto</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-3 gap-2">
              <select
                className="h-9 rounded-md border border-input bg-card px-3 text-sm"
                value={form.type}
                onChange={(e) => handleFormChange("type", e.target.value)}
              >
                <option value="Entrada">Entrada</option>
                <option value="Saida">Saida</option>
              </select>
              <Input
                placeholder="Quantidade"
                value={form.quantity}
                onChange={(e) => handleFormChange("quantity", e.target.value)}
                className="bg-card"
              />
              <Input
                placeholder="Origem (NF, Ajuste...)"
                value={form.origin}
                onChange={(e) => handleFormChange("origin", e.target.value)}
                className="bg-card"
              />
            </div>
            <Button
              className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              disabled={!canSave}
              onClick={handleSubmit}
            >
              <Plus className="size-4" />
              {isSaving ? "Salvando..." : "Registrar movimentacao"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">Movimentacoes de estoque</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4 text-foreground font-medium">Data</TableHead>
                <TableHead className="text-foreground font-medium">Produto</TableHead>
                <TableHead className="text-foreground font-medium">Tipo</TableHead>
                <TableHead className="text-foreground font-medium">Quantidade</TableHead>
                <TableHead className="text-foreground font-medium">Origem</TableHead>
                <TableHead className="text-foreground font-medium">Estoque Atual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((movement) => (
                <TableRow key={movement.id} className="hover:bg-muted/30">
                  <TableCell className="pl-4 text-sm text-muted-foreground">{movement.date}</TableCell>
                  <TableCell className="text-sm text-foreground">{movement.productName}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        movement.type === "Entrada"
                          ? "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30"
                          : "bg-destructive/10 text-destructive border-destructive/30"
                      }
                    >
                      <ArrowUpDown className="size-3 mr-1" />
                      {movement.type}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-sm font-medium ${
                      movement.type === "Entrada" ? "text-[#22c55e]" : "text-destructive"
                    }`}
                  >
                    {movement.type === "Entrada" ? "+" : "-"}
                    {movement.quantity} {movement.unit}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{movement.origin}</TableCell>
                  <TableCell className="text-sm text-foreground font-medium">
                    {movement.stockAfter} {movement.unit}
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
