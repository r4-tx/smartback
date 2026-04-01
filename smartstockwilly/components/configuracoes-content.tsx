"use client"

import { Settings, Shield, Bell, UserCog, Palette, Database } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const sections = [
  {
    title: "Perfil da empresa",
    description: "Nome fantasia, documentos e dados de acesso.",
    icon: UserCog,
    badge: "Essencial",
  },
  {
    title: "Notificacoes",
    description: "Alertas de vendas, financeiro e estoque.",
    icon: Bell,
    badge: "Ativo",
  },
  {
    title: "Seguranca",
    description: "Permissoes, senhas e controle de sessao.",
    icon: Shield,
    badge: "Recomendado",
  },
  {
    title: "Aparencia",
    description: "Tema, identidade visual e exibicao da interface.",
    icon: Palette,
    badge: "Personalizacao",
  },
  {
    title: "Integracoes",
    description: "Conexoes com financeiro, fiscal e outros servicos.",
    icon: Database,
    badge: "Online",
  },
]

export function ConfiguracoesContent() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>Configuracoes</span>
        <span>{">"}</span>
        <span className="text-foreground font-medium">Visao geral</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuracoes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ajuste o comportamento do sistema, acessos e preferencia da operacao.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Card key={section.title} className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10">
                    <section.icon className="size-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-semibold text-foreground">{section.title}</CardTitle>
                </div>
                <Badge variant="outline" className="bg-muted/30 text-muted-foreground border-border">
                  {section.badge}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
