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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  addProduct,
  deleteProduct,
  getProduct,
  listStockLocations,
  listProducts,
  updateProduct,
  type Product,
  type StockLocation,
} from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface NewProductFormState {
  name: string
  type: string
  code: string
  ref: string
  stock: string
  unit: string
  stockLocationId: number | null
  price: string
}

const emptyForm: NewProductFormState = {
  name: "",
  type: "Simples",
  code: "",
  ref: "",
  stock: "",
  unit: "UN",
  stockLocationId: null,
  price: "",
}

const unitOptions = [
  { value: "UN", label: "UN — Unidade" },
  { value: "PAR", label: "PAR — Par" },
  { value: "CX", label: "CX — Caixa" },
  { value: "PC", label: "PC — Peca" },
  { value: "PCT", label: "PCT — Pacote" },
  { value: "FD", label: "FD — Fardo" },
  { value: "SC", label: "SC — Saco" },
  { value: "KG", label: "KG — Quilograma" },
  { value: "G", label: "G — Grama" },
  { value: "L", label: "L — Litro" },
  { value: "ML", label: "ML — Mililitro" },
  { value: "M", label: "M — Metro" },
  { value: "CM", label: "CM — Centimetro" },
  { value: "M2", label: "M² — Metro quadrado" },
  { value: "M3", label: "M³ — Metro cubico" },
  { value: "DZ", label: "DZ — Duzia" },
  { value: "CJ", label: "CJ — Conjunto" },
  { value: "RL", label: "RL — Rolo" },
  { value: "BD", label: "BD — Balde" },
  { value: "LT", label: "LT — Lata" },
  { value: "FR", label: "FR — Frasco" },
  { value: "TB", label: "TB — Tubo" },
  { value: "PÇ", label: "PÇ — Peca" },
  { value: "TON", label: "TON — Tonelada" },
  { value: "PAL", label: "PAL — Palete/Pallet" },
]

export function ProductsContent() {
  const [search, setSearch] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [products, setProducts] = useState<Product[]>([])
  const [locations, setLocations] = useState<StockLocation[]>([])
  const [form, setForm] = useState<NewProductFormState>(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editForm, setEditForm] = useState<NewProductFormState>(emptyForm)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    void refreshList()
  }, [])

  const refreshList = async () => {
    const [productsData, locationsData] = await Promise.all([listProducts(), listStockLocations()])
    setProducts(productsData)
    setLocations(locationsData)
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

  const handleFormChange = (field: keyof NewProductFormState, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [field]: value as never }))
  }

  const canSave =
    form.name.trim().length > 0 &&
    form.code.trim().length > 0 &&
    form.stockLocationId !== null

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
          stockLocationId: form.stockLocationId,
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

  const handleDuplicate = async (product: Product) => {
    try {
      await addProduct({
        name: `${product.name} (Copia)`,
        type: product.type,
        code: `${product.code}-COPIA`,
        ref: product.ref,
        stock: product.stock,
        unit: product.unit,
        stockLocationId: product.stockLocationId ?? null,
        price: product.price,
      })
      await refreshList()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel duplicar o produto")
    }
  }

  const handleViewDetails = async (productId: number) => {
    try {
      const data = await getProduct(productId)
      setDetailsProduct(data)
      setIsDetailsOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel carregar os detalhes do produto")
    }
  }

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product)
    setEditForm({
      name: product.name,
      type: product.type,
      code: product.code,
      ref: product.ref,
      stock: String(product.stock),
      unit: product.unit,
      stockLocationId: product.stockLocationId ?? null,
      price: String(product.price),
    })
    setIsEditOpen(true)
  }

  const handleEditChange = (field: keyof NewProductFormState, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveEdit = async () => {
    if (!editingProduct || isUpdating) return
    setIsUpdating(true)
    try {
      const stockNumber = Number(editForm.stock.replace(",", "."))
      const priceNumber = Number(editForm.price.replace(",", "."))
      await updateProduct(editingProduct.id, {
        name: editForm.name.trim(),
        type: editForm.type.trim() || "Simples",
        code: editForm.code.trim(),
        ref: editForm.ref.trim(),
        stock: Number.isFinite(stockNumber) ? stockNumber : 0,
        unit: editForm.unit.trim() || "UN",
        stockLocationId: editForm.stockLocationId,
        price: Number.isFinite(priceNumber) ? priceNumber : 0,
      })
      await refreshList()
      setIsEditOpen(false)
      setEditingProduct(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel editar o produto")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleOpenDelete = (product: Product) => {
    setDeletingProduct(product)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingProduct || isDeleting) return
    setIsDeleting(true)
    try {
      await deleteProduct(deletingProduct.id)
      await refreshList()
      setIsDeleteOpen(false)
      setDeletingProduct(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel excluir o produto")
    } finally {
      setIsDeleting(false)
    }
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
            <div className="grid grid-cols-4 gap-2">
              <Input
                placeholder="Estoque inicial"
                value={form.stock}
                onChange={(e) => handleFormChange("stock", e.target.value)}
                className="bg-card"
              />
              <Select value={form.unit} onValueChange={(value) => handleFormChange("unit", value)}>
                <SelectTrigger className="bg-card w-full">
                  <SelectValue placeholder="Unidade (PAR, UN...)" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {unitOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Preco de venda"
                value={form.price}
                onChange={(e) => handleFormChange("price", e.target.value)}
                className="bg-card"
              />
              <Select
                value={form.stockLocationId !== null ? String(form.stockLocationId) : undefined}
                onValueChange={(value) => handleFormChange("stockLocationId", Number(value))}
              >
                <SelectTrigger className="bg-card w-full">
                  <SelectValue placeholder="Local de estoque" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={String(location.id)}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                        <DropdownMenuItem onClick={() => handleOpenEdit(product)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => void handleDuplicate(product)}>Duplicar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => void handleViewDetails(product.id)}>Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem
                          className="bg-destructive text-white hover:bg-destructive/90 focus:bg-destructive/90"
                          onClick={() => handleOpenDelete(product)}
                        >
                          Excluir
                        </DropdownMenuItem>
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

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do produto</DialogTitle>
            <DialogDescription>Informacoes completas do produto selecionado.</DialogDescription>
          </DialogHeader>
          {detailsProduct ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="font-semibold">Nome:</span> {detailsProduct.name}</div>
              <div><span className="font-semibold">Codigo:</span> {detailsProduct.code}</div>
              <div><span className="font-semibold">Referencia:</span> {detailsProduct.ref}</div>
              <div><span className="font-semibold">Tipo:</span> {detailsProduct.type}</div>
              <div><span className="font-semibold">Unidade:</span> {detailsProduct.unit}</div>
              <div>
                <span className="font-semibold">Local:</span>{" "}
                {locations.find((l) => l.id === detailsProduct.stockLocationId)?.name ?? "Nao definido"}
              </div>
              <div><span className="font-semibold">Estoque:</span> {detailsProduct.stock}</div>
              <div>
                <span className="font-semibold">Preco:</span>{" "}
                {detailsProduct.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
              <div><span className="font-semibold">Situacao:</span> {detailsProduct.status}</div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar produto</DialogTitle>
            <DialogDescription>Atualize os dados e salve para persistir no banco.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Nome do produto"
              value={editForm.name}
              onChange={(e) => handleEditChange("name", e.target.value)}
              className="bg-card"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input
                placeholder="Codigo interno"
                value={editForm.code}
                onChange={(e) => handleEditChange("code", e.target.value)}
                className="bg-card"
              />
              <Input
                placeholder="Referencia interna"
                value={editForm.ref}
                onChange={(e) => handleEditChange("ref", e.target.value)}
                className="bg-card"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Input
                placeholder="Estoque inicial"
                value={editForm.stock}
                onChange={(e) => handleEditChange("stock", e.target.value)}
                className="bg-card"
              />
              <Select value={editForm.unit} onValueChange={(value) => handleEditChange("unit", value)}>
                <SelectTrigger className="bg-card w-full">
                  <SelectValue placeholder="Unidade (PAR, UN...)" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {unitOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Preco de venda"
                value={editForm.price}
                onChange={(e) => handleEditChange("price", e.target.value)}
                className="bg-card"
              />
              <Select
                value={editForm.stockLocationId !== null ? String(editForm.stockLocationId) : undefined}
                onValueChange={(value) => handleEditChange("stockLocationId", Number(value))}
              >
                <SelectTrigger className="bg-card w-full">
                  <SelectValue placeholder="Local de estoque" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={String(location.id)}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
            <Button onClick={() => void handleSaveEdit()} disabled={isUpdating}>
              {isUpdating ? "Salvando..." : "Salvar alteracoes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa acao removera o produto {deletingProduct ? `"${deletingProduct.name}"` : ""} do banco de dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => void handleConfirmDelete()}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
