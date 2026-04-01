"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Home, Plus, Trash2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createOrder,
  listClients,
  listProducts,
  type Client,
  type NewOrderItemInput,
  type Order,
  type Product,
} from "@/lib/api"

interface ProductLine {
  id: number
  productId: string
  name: string
  quantity: number
  unitPrice: number
  discount: number
  subtotal: number
}

export function SalesOrderContent() {
  const [clientId, setClientId] = useState("")
  const [priceTable, setPriceTable] = useState("")
  const [representative, setRepresentative] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [productsCatalog, setProductsCatalog] = useState<Product[]>([])
  const [products, setProducts] = useState<ProductLine[]>([
    { id: 1, productId: "", name: "", quantity: 0, unitPrice: 0, discount: 0, subtotal: 0 },
  ])
  const [saving, setSaving] = useState(false)
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      const [clientsData, productsData] = await Promise.all([listClients(), listProducts()])
      setClients(clientsData)
      setProductsCatalog(productsData)
    })()
  }, [])

  const addProduct = () => {
    setProducts([
      ...products,
      {
        id: products.length + 1,
        productId: "",
        name: "",
        quantity: 0,
        unitPrice: 0,
        discount: 0,
        subtotal: 0,
      },
    ])
  }

  const removeProduct = (id: number) => {
    if (products.length > 1) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  const updateProduct = (id: number, field: keyof ProductLine, value: string | number) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          const updated = { ...p, [field]: value }
          updated.subtotal = updated.quantity * updated.unitPrice - updated.discount
          return updated
        }
        return p
      })
    )
  }

  const handleProductSearchChange = (lineId: number, value: string) => {
    const matched = productsCatalog.find(
      (p) =>
        p.code === value ||
        p.ref === value ||
        p.name.toLowerCase().startsWith(value.toLowerCase())
    )
    setProducts((prev) =>
      prev.map((line) =>
        line.id === lineId
          ? {
              ...line,
              productId: matched?.id ?? "",
              name: matched ? matched.name : value,
              unitPrice: matched?.price ?? line.unitPrice,
            }
          : line
      )
    )
  }

  const totalItems = useMemo(
    () => products.reduce((acc, p) => acc + p.quantity, 0),
    [products]
  )
  const totalDiscount = useMemo(
    () => products.reduce((acc, p) => acc + p.discount, 0),
    [products]
  )
  const total = useMemo(
    () => products.reduce((acc, p) => acc + p.subtotal, 0),
    [products]
  )

  const canSave =
    clientId !== "" &&
    products.some((p) => p.productId && p.quantity > 0 && p.unitPrice > 0) &&
    !saving

  const handleSaveOrder = () => {
    if (!clientId) {
      setError("Selecione um cliente antes de salvar o pedido.")
      return
    }
    if (!products.some((p) => p.productId && p.quantity > 0 && p.unitPrice > 0)) {
      setError("Adicione pelo menos um produto valido ao pedido.")
      return
    }
    if (saving) return
    setSaving(true)
    setError(null)
    void (async () => {
      try {
        const items: NewOrderItemInput[] = products
          .filter((p) => p.productId && p.quantity > 0 && p.unitPrice > 0)
          .map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
            unitPrice: p.unitPrice,
            discount: p.discount,
          }))
        const order = await createOrder({
          clientId,
          items,
          status: "Orcamento",
        })
        setCreatedOrder(order)
        setProducts([
          { id: 1, productId: "", name: "", quantity: 0, unitPrice: 0, discount: 0, subtotal: 0 },
        ])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nao foi possivel salvar o pedido")
      } finally {
        setSaving(false)
      }
    })()
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="text-primary hover:text-primary/80">
          <Home className="size-4" />
        </Link>
        <span>/</span>
        <Link href="/vendas/pedidos" className="text-primary hover:underline">
          Pedidos de venda
        </Link>
        <span>/</span>
        <span className="text-foreground">Novo pedido de venda</span>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-light text-foreground mb-2">{"Orcamento #G1"}</h1>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm text-primary">
                  SMARTSTOCK{" "}
                  <button className="text-muted-foreground hover:underline text-xs">
                    (alterar filial)
                  </button>
                </span>
                <span className="text-sm text-muted-foreground">
                  (Vendedor nao informado){" "}
                  <button className="text-primary hover:underline text-xs">
                    (alterar vendedor)
                  </button>
                </span>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">
              Emissao: 04/03/2026
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-foreground mb-1.5 block">Cliente</label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-foreground mb-1.5 block">Tabela de precos:</label>
                <Select value={priceTable} onValueChange={setPriceTable}>
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Selecione uma tabela de preco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tabela1">Tabela Padrao</SelectItem>
                    <SelectItem value="tabela2">Tabela Atacado</SelectItem>
                    <SelectItem value="tabela3">Tabela Promocional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-foreground mb-1.5 block">Representante:</label>
                <Select value={representative} onValueChange={setRepresentative}>
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Representante" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rep1">Carlos Silva</SelectItem>
                    <SelectItem value="rep2">Ana Oliveira</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                className="bg-[#22c55e] text-[#ffffff] hover:bg-[#16a34a] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving}
                onClick={handleSaveOrder}
              >
                {saving ? "Salvando pedido..." : "Salvar pedido / orcamento"}
              </Button>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            {error ? (
              <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            ) : null}
            <div className="grid grid-cols-12 gap-3 mb-3">
              <div className="col-span-5">
                <h3 className="text-base font-semibold text-foreground">Produto</h3>
              </div>
              <div className="col-span-1 text-center">
                <span className="text-sm font-medium text-foreground">Quantidade</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="text-sm font-medium text-foreground">Valor unitario</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="text-sm font-medium text-foreground">Desconto unitario</span>
              </div>
              <div className="col-span-1 text-center">
                <span className="text-sm font-medium text-foreground">Subtotal</span>
              </div>
              <div className="col-span-1" />
            </div>

            {products.map((product) => (
              <div key={product.id} className="grid grid-cols-12 gap-3 mb-3 items-center">
                <div className="col-span-5">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Nome, codigo interno ou referencia"
                      value={product.name}
                      onChange={(e) => handleProductSearchChange(product.id, e.target.value)}
                      className="bg-card"
                    />
                    <Button variant="ghost" size="icon" className="size-8 shrink-0">
                      <ChevronDown className="size-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => updateProduct(product.id, "quantity", Number(e.target.value))}
                    className="text-center bg-card"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={product.unitPrice}
                    onChange={(e) => updateProduct(product.id, "unitPrice", Number(e.target.value))}
                    className="text-center bg-card"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={product.discount}
                    onChange={(e) => updateProduct(product.id, "discount", Number(e.target.value))}
                    className="text-center bg-card"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    value={`R$ ${product.subtotal.toFixed(2)}`}
                    readOnly
                    className="text-center bg-muted/30"
                  />
                </div>
                <div className="col-span-1 flex items-center justify-center gap-1">
                  <Button variant="ghost" size="icon" className="size-7">
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => removeProduct(product.id)}
                  >
                    <Trash2 className="size-3.5 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}

            <button
              onClick={addProduct}
              className="text-sm text-primary hover:underline mt-2"
            >
              Adicionar produto
            </button>

            <div className="flex flex-col items-end mt-8 gap-2">
              <div className="flex items-center gap-8 text-sm">
                <span className="text-muted-foreground">Quantidade de itens:</span>
                <span className="text-foreground font-medium">{totalItems}</span>
              </div>
              <div className="flex items-center gap-8 text-sm">
                <span className="text-muted-foreground">Descontos:</span>
                <span className="text-foreground">
                  R$ {totalDiscount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-8 text-sm">
                <span className="text-muted-foreground">Frete:</span>
                <span className="text-foreground">R$ 0,00</span>
              </div>
              <div className="flex items-center gap-8 mt-2 pt-2 border-t border-border">
                <span className="text-lg font-medium text-foreground">Total:</span>
                <span className="text-lg font-bold text-primary">
                  R$ {total.toFixed(2)}
                </span>
              </div>
              <button className="text-sm text-primary hover:underline mt-1">
                Aplicar desconto no total
              </button>
            </div>

            {createdOrder && (
              <div className="mt-6 rounded-md border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground flex flex-col gap-1">
                <span>
                  Pedido <span className="font-semibold text-foreground">#{createdOrder.number}</span> criado com
                  sucesso.
                </span>
                <span>
                  Valor total:{" "}
                  <span className="font-semibold text-foreground">
                    {createdOrder.total.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </span>
                <span>
                  O estoque foi atualizado e uma entrega pendente foi gerada automaticamente.
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
