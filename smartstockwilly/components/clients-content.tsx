"use client"

import { useEffect, useState } from "react"
import { Search, MoreVertical, Plus, Mail, Phone } from "lucide-react"
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
import { addClient, listClients, type Client } from "@/lib/api"

interface NewClientFormState {
  name: string
  cpfCnpj: string
  phone: string
  email: string
  city: string
}

const emptyForm: NewClientFormState = {
  name: "",
  cpfCnpj: "",
  phone: "",
  email: "",
  city: "",
}

export function ClientsContent() {
  const [search, setSearch] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [form, setForm] = useState<NewClientFormState>(emptyForm)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    void (async () => {
      setClients(await listClients())
    })()
  }, [])

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.cpfCnpj.includes(search)
  )

  const handleChange = (field: keyof NewClientFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canSave =
    form.name.trim().length > 0 &&
    form.cpfCnpj.trim().length > 0

  const handleSubmit = () => {
    if (!canSave || isSaving) return
    setIsSaving(true)
    void (async () => {
      const created = await addClient({
        name: form.name.trim(),
        cpfCnpj: form.cpfCnpj.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        city: form.city.trim(),
      })
      setClients((prev) => [created, ...prev])
      setForm(emptyForm)
      setIsSaving(false)
    })()
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>Cadastros</span>
        <span>{">"}</span>
        <span className="text-foreground font-medium">Clientes</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1.4fr] gap-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou CPF/CNPJ"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
        </div>
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">
              Novo cliente rapido
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Input
              placeholder="Nome / Razao social"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="bg-card"
            />
            <Input
              placeholder="CPF/CNPJ"
              value={form.cpfCnpj}
              onChange={(e) => handleChange("cpfCnpj", e.target.value)}
              className="bg-card"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input
                placeholder="Telefone"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="bg-card"
              />
              <Input
                placeholder="E-mail"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="bg-card"
              />
            </div>
            <Input
              placeholder="Cidade / UF"
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="bg-card"
            />
            <Button
              className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              disabled={!canSave || isSaving}
              onClick={handleSubmit}
            >
              <Plus className="size-4" />
              {isSaving ? "Salvando..." : "Salvar cliente"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">Clientes cadastrados</CardTitle>
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
              {filtered.map((client) => (
                <TableRow key={client.id} className="hover:bg-muted/30">
                  <TableCell className="pl-4 text-sm font-medium text-foreground">{client.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{client.cpfCnpj}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="size-3 text-muted-foreground" />
                      {client.phone}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="size-3 text-muted-foreground" />
                      {client.email}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{client.city}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        client.status === "Ativo"
                          ? "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30"
                          : "bg-muted text-muted-foreground border-border"
                      }
                    >
                      {client.status}
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
                        <DropdownMenuItem>Editar (demo)</DropdownMenuItem>
                        <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Historico de compras</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Desativar (nao implementado)</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-primary/5">
            <span className="text-sm font-semibold text-foreground">
              TOTAL: <span className="font-normal">{clients.length} Clientes</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
