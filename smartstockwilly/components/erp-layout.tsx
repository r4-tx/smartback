"use client"

import { useEffect, useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ErpSidebar } from "@/components/erp-sidebar"
import { ErpHeader } from "@/components/erp-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getSession, setSession, type UserSession } from "@/lib/api"

function LoginScreen() {
  const [email, setEmail] = useState("admin@smartstock.com")
  const [password, setPassword] = useState("123")
  const [isLoading, setIsLoading] = useState(false)

  const canLogin = email.trim().length > 0 && password.trim().length > 0

  const handleLogin = () => {
    if (!canLogin) return
    setIsLoading(true)
    const session: UserSession = {
      isLoggedIn: true,
      userName: "Admin Smartstock",
    }
    setSession(session)
    // simples recarregamento para forcar leitura da sessao
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">
            Acessar Smartstock
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-foreground">E-mail</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-card"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-foreground">Senha</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-card"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Para demonstracao, voce pode usar qualquer combinacao de e-mail e senha.
          </p>
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleLogin}
            disabled={!canLogin || isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar no sistema"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function ErpLayout({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<UserSession | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    void (async () => {
      const s = await getSession()
      setSessionState(s)
      setIsReady(true)
    })()
  }, [])

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm">
        Carregando interface...
      </div>
    )
  }

  if (!session || !session.isLoggedIn) {
    return <LoginScreen />
  }

  return (
    <SidebarProvider>
      <ErpSidebar />
      <SidebarInset>
        <ErpHeader />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
