"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Search,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Plus,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react"
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
import { addProduct, listProducts, type Product } from "@/lib/api"

interface NewProductFormState {
  name: string
  type: string
  code: string
  ref: string
  stock: string
  unit: string
  price: string
}

const emptyForm: NewProductFormState = {
  name: "",
  type: "Simples",
  code: "",
  ref: "",
  stock: "0",
  unit: "UN",
  price: "0",
}

export function ProductsContent() {
  const [search, setSearch] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<NewProductFormState>(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void refreshList()
  }, [])

  const refreshList = async () => {
    const data = await listProducts()
    setProducts(data)
  }

  const filtered = useMemo(() => {
    const term = search.toLowerCase()
    let result = products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.code.includes(search) ||
        p.ref.includes(search)
    )
    if (!sortColumn) return result
    return [...result].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1
      const av = (a as any)[sortColumn]
      const bv = (b as any)[sortColumn]
      if (typeof av === "number" && typeof bv === "number") {
        return (av - bv) * dir
      }
      return String(av).localeCompare(String(bv)) * dir
    })
  }, [products, search, sortColumn, sortDir])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDir("asc")
    }
  }

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) return <ChevronDown className="size-3 text-muted-foreground/50" />
    return sortDir === "asc" ? (
      <ChevronUp className="size-3 text-primary" />
    ) : (
      <ChevronDown className="size-3 text-primary" />
    )
  }

  const handleFormChange = (field: keyof NewProductFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canSave =
    form.name.trim().length > 0 &&
    form.code.trim().length > 0

  const handleSubmit = () => {
    if (!canSave || isSaving) return
    setIsSaving(true)
    setError(null)
    void (async () => {
      try {
        const stockNumber = Number(form.stock.replace(",", "."))
        const priceNumber = Number(form.price.replace(",", "."))
        await addProduct({
          name: form.name.trim(),
          type: form.type.trim() || "Simples",
          code: form.code.trim(),
          ref: form.ref.trim(),
          stock: Number.isFinite(stockNumber) ? stockNumber : 0,
          unit: form.unit.trim() || "UN",
          price: Number.isFinite(priceNumber) ? priceNumber : 0,
        })
        await refreshList()
        setForm(emptyForm)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nao foi possivel salvar o produto")
      } finally {
        setIsSaving(false)
      }
    })()
  }

  const totalStock = useMemo(
    () => products.reduce((acc, p) => acc + (p.stock || 0), 0),
    [products]
  )

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>Cadastros</span>
        <span>{">"}</span>
        <span className="text-foreground font-medium">Produtos</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1.6fr] gap-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 w-full max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Busque por nome, codigo ou referencia interna"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card"
              />
            </div>
            <button className="text-sm text-primary hover:underline">
              Busca avancada
            </button>
          </div>
        </div>
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">
              Cadastro rapido de produto
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {error ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            ) : null}
            <Input
              placeholder="Nome do produto"
              value={form.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              className="bg-card"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input
                placeholder="Codigo interno"
                value={form.code}
                onChange={(e) => handleFormChange("code", e.target.value)}
                className="bg-card"
              />
              <Input
                placeholder="Referencia interna"
                value={form.ref}
                onChange={(e) => handleFormChange("ref", e.target.value)}
                className="bg-card"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Estoque inicial"
                value={form.stock}
                onChange={(e) => handleFormChange("stock", e.target.value)}
                className="bg-card"
              />
              <Input
                placeholder="Unidade (PAR, UN...)"
                value={form.unit}
                onChange={(e) => handleFormChange("unit", e.target.value)}
                className="bg-card"
              />
              <Input
                placeholder="Preco de venda"
                value={form.price}
                onChange={(e) => handleFormChange("price", e.target.value)}
                className="bg-card"
              />
            </div>
            <Button
              className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              disabled={!canSave || isSaving}
              onClick={handleSubmit}
            >
              <Plus className="size-4" />
              {isSaving ? "Salvando..." : "Salvar produto"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">Produtos cadastrados</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                A listagem abaixo exibe os seus produtos cadastrados.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm text-muted-foreground gap-1.5"
                onClick={() => void refreshList()}
              >
                <RefreshCw className="size-3.5" />
                Atualizar listagem
              </Button>
              <Button variant="ghost" size="sm" className="text-sm text-muted-foreground gap-1.5">
                <FileSpreadsheet className="size-3.5" />
                Exportar como planilha
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto lg:overflow-visible">
            <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-primary/5 hover:bg-primary/5">
                <TableHead className="pl-4">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1 text-foreground"
                  >
                    Nome do produto
                    <SortIcon column="name" />
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <button
                    onClick={() => handleSort("type")}
                    className="flex items-center gap-1 text-foreground"
                  >
                    Tipo de variacao
                    <SortIcon column="type" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("code")}
                    className="flex items-center gap-1 text-foreground"
                  >
                    Codigo
                    <SortIcon column="code" />
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <button
                    onClick={() => handleSort("ref")}
                    className="flex items-center gap-1 text-foreground"
                  >
                    Referencia interna
                    <SortIcon column="ref" />
                  </button>
                </TableHead>
                <TableHead className="text-center">Estoque total</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("price")}
                    className="flex items-center gap-1 text-foreground"
                  >
                    Preco de venda
                    <SortIcon column="price" />
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center gap-1 text-foreground"
                  >
                    Situacao
                    <SortIcon column="status" />
                  </button>
                </TableHead>
                <TableHead className="text-center">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/30">
                  <TableCell className="pl-4">
                    <div className="flex items-center gap-2">
                      <ChevronDown className="size-3.5 text-muted-foreground" />
                      <span className="text-sm text-foreground">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {product.type}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{product.code}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {product.ref}
                  </TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {product.stock} {product.unit}
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {product.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="text-[#22c55e] border-[#22c55e]/30 bg-[#22c55e]/10">
                      {product.status}
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
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Duplicar</DropdownMenuItem>
                        <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-primary/5">
            <span className="text-sm font-semibold text-foreground">
              TOTAL: <span className="font-normal">{products.length} Produtos</span>
            </span>
            <span className="text-sm text-muted-foreground">
              Estoque total:{" "}
              <span className="font-semibold text-foreground">
                {totalStock} itens
              </span>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
