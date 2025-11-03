import type { Route } from "./+types/login"
import { useState, type FormEvent } from "react"
import { useAuth } from "~/contexts/auth.context"
import { useNavigate, Link } from "react-router"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import "../auth/login.css"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - Marketplace Insper" },
    { name: "description", content: "Faça login na sua conta" },
  ]
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const result = await login({ email, password })

    if (result.success) {
      toast.success("Login realizado com sucesso!")
      navigate("/")
    } else {
      toast.error(result.error || "Erro ao fazer login")
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <Card className="login-card">
        <CardHeader className="login-header">
          <CardTitle className="login-title">Login</CardTitle>
          <CardDescription className="login-description">
            Entre com seu email Insper para acessar o marketplace
          </CardDescription>
          <CardAction className="login-action">
            <Link to="/register">
              <Button variant="link" className="login-link">Criar conta</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent className="login-content">
          <form onSubmit={handleSubmit} id="login-form">
            <div className="flex flex-col gap-6">
              <div className="login-field">
                <Label htmlFor="email" className="login-label">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu.nome@insper.edu.br"
                  required
                  disabled={isLoading}
                  className="login-input"
                />
              </div>
              <div className="login-field">
                <Label htmlFor="password" className="login-label">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isLoading}
                  className="login-input"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="login-footer">
          <Button
            type="submit"
            form="login-form"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
