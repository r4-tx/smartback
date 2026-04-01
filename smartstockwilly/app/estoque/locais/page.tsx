"use client"

import { useEffect, useMemo, useState } from "react"
import { ErpLayout } from "@/components/erp-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { addStockLocation, listStockLocations, type StockLocation } from "@/lib/api"

interface NewStockLocationFormState {
  name: string
  address: string
  products: string
}

const emptyForm: NewStockLocationFormState = {
  name: "",
  address: "",
  products: "0",
}

export default function StockLocationsPage() {
  const [locations, setLocations] = useState<StockLocation[]>([])
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<NewStockLocationFormState>(emptyForm)

  useEffect(() => {
    void refreshList()
  }, [])

  const refreshList = async () => {
    const data = await listStockLocations()
    setLocations(data)
  }

  const filtered = useMemo(
    () =>
      locations.filter(
        (location) =>
          location.name.toLowerCase().includes(search.toLowerCase()) ||
          location.address.toLowerCase().includes(search.toLowerCase())
      ),
    [locations, search]
  )

  const canSave = form.name.trim().length > 0 && form.address.trim().length > 0 && !Number.isNaN(Number(form.products))

  const handleCreateLocation = () => {
    if (!canSave || isSaving) return
    setIsSaving(true)
    setError(null)
    void (async () => {
      try {
        await addStockLocation({
          name: form.name.trim(),
          address: form.address.trim(),
          products: Number(form.products),
        })
        await refreshList()
        setForm(emptyForm)
        setShowForm(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nao foi possivel salvar o local")
      } finally {
        setIsSaving(false)
      }
    })()
  }

  return (
    <ErpLayout>
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>Estoque</span>
          <span>{">"}</span>
          <span className="text-foreground font-medium">Locais de Estoque</span>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Locais de Estoque</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Cadastre os enderecos fisicos do seu estoque diretamente no banco.
            </p>
          </div>
          <div className="flex gap-3">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou endereco"
              className="w-full lg:w-80 bg-card"
            />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2" onClick={() => setShowForm((prev) => !prev)}>
              <Plus className="size-4" />
              Novo local
            </Button>
          </div>
        </div>

        {showForm ? (
          <Card className="bg-card border-border mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-foreground">Cadastro rapido de local</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              {error ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              ) : null}
              <Input
                placeholder="Nome do local"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="bg-card"
              />
              <Input
                placeholder="Endereco"
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                className="bg-card"
              />
              <Input
                type="number"
                min={0}
                placeholder="Quantidade de produtos"
                value={form.products}
                onChange={(e) => setForm((prev) => ({ ...prev, products: e.target.value }))}
                className="bg-card"
              />
              <div className="flex gap-2">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleCreateLocation} disabled={!canSave || isSaving}>
                  {isSaving ? "Salvando..." : "Salvar local"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setError(null)
                    setForm(emptyForm)
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((loc) => (
            <Card key={loc.id} className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="size-4 text-primary" />
                  {loc.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{loc.address}</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{loc.products.toLocaleString("pt-BR")}</span> produtos
                  </p>
                  <Badge
                    variant="outline"
                    className={loc.status === "Ativo" ? "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30" : "bg-muted text-muted-foreground border-border"}
                  >
                    {loc.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-border bg-primary/5 px-4 py-3 text-sm font-semibold text-foreground">
          TOTAL: <span className="font-normal">{locations.length} locais cadastrados</span>
        </div>
      </div>
    </ErpLayout>
  )
}
