"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, MoreVertical, Plus, Phone, Mail } from "lucide-react"
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
import { addSupplier, listSuppliers, type Supplier } from "@/lib/api"

interface NewSupplierFormState {
  name: string
  cpfCnpj: string
  phone: string
  email: string
  city: string
}

const emptyForm: NewSupplierFormState = {
  name: "",
  cpfCnpj: "",
  phone: "",
  email: "",
  city: "",
}

export function SuppliersContent() {
  const [search, setSearch] = useState("")
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [form, setForm] = useState<NewSupplierFormState>(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void refreshList()
  }, [])

  const refreshList = async () => {
    const data = await listSuppliers()
    setSuppliers(data)
  }

  const filtered = useMemo(
    () =>
      suppliers.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.cpfCnpj.includes(search)
      ),
    [suppliers, search]
  )

  const handleFormChange = (field: keyof NewSupplierFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canSave = form.name.trim().length > 0 && form.cpfCnpj.trim().length > 0

  const handleCreateSupplier = () => {
    if (!canSave || isSaving) return
    setIsSaving(true)
    setError(null)
    void (async () => {
      try {
        await addSupplier({
          name: form.name.trim(),
          cpfCnpj: form.cpfCnpj.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          city: form.city.trim(),
        })
        await refreshList()
        setForm(emptyForm)
        setShowForm(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nao foi possivel salvar o fornecedor")
      } finally {
        setIsSaving(false)
      }
    })()
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>Cadastros</span>
        <span>{">"}</span>
        <span className="text-foreground font-medium">Fornecedores</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CPF/CNPJ"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          onClick={() => setShowForm((prev) => !prev)}
        >
          <Plus className="size-4" />
          Novo fornecedor
        </Button>
      </div>

      {showForm ? (
        <Card className="bg-card border-border mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">Cadastro rapido de fornecedor</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2">
            {error ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            ) : null}
            <Input
              placeholder="Nome / Razao social"
              value={form.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              className="bg-card"
            />
            <Input
              placeholder="CPF/CNPJ"
              value={form.cpfCnpj}
              onChange={(e) => handleFormChange("cpfCnpj", e.target.value)}
              className="bg-card"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input
                placeholder="Telefone"
                value={form.phone}
                onChange={(e) => handleFormChange("phone", e.target.value)}
                className="bg-card"
              />
              <Input
                placeholder="E-mail"
                value={form.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
                className="bg-card"
              />
            </div>
            <Input
              placeholder="Cidade / UF"
              value={form.city}
              onChange={(e) => handleFormChange("city", e.target.value)}
              className="bg-card"
            />
            <div className="flex gap-2">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleCreateSupplier}
                disabled={!canSave || isSaving}
              >
                {isSaving ? "Salvando..." : "Salvar fornecedor"}
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

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">Fornecedores cadastrados</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4 text-foreground font-medium">Nome</TableHead>
                <TableHead className="text-foreground font-medium">CPF/CNPJ</TableHead>
                <TableHead className="text-foreground font-medium">Telefone</TableHead>
                <TableHead className="text-foreground font-medium">E-mail</TableHead>
                <TableHead className="text-foreground font-medium">Cidade</TableHead>
                <TableHead className="text-foreground font-medium">Situacao</TableHead>
                <TableHead className="text-center text-foreground font-medium">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((supplier) => (
                <TableRow key={supplier.id} className="hover:bg-muted/30">
                  <TableCell className="pl-4 text-sm font-medium text-foreground">{supplier.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{supplier.cpfCnpj}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="size-3" />
                      {supplier.phone}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="size-3" />
                      {supplier.email}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{supplier.city}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        supplier.status === "Ativo"
                          ? "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30"
                          : "bg-muted text-muted-foreground border-border"
                      }
                    >
                      {supplier.status}
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
                        <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Desativar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-primary/5">
            <span className="text-sm font-semibold text-foreground">
              TOTAL: <span className="font-normal">{suppliers.length} Fornecedores</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
