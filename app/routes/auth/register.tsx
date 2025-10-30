import type { Route } from "./+types/register"
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
import "../auth/register.css"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Criar conta - Marketplace Insper" },
    { name: "description", content: "Crie sua conta no marketplace" },
  ]
}

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const cellphone = formData.get("cellphone") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    const result = await register({ name, email, cellphone, password })

    if (result.success) {
      toast.success("Conta criada com sucesso! Faça login para continuar")
      navigate("/login")
    } else {
      toast.error(result.error || "Erro ao criar conta")
      setIsLoading(false)
    }
  }

  return (
    <div className="register-container">
      <Card className="register-card">
        <CardHeader className="register-header">
          <CardTitle className="register-title">Criar conta</CardTitle>
          <CardDescription className="register-description">
            Preencha os dados abaixo para criar sua conta
          </CardDescription>
          <CardAction className="register-action">
            <Link to="/login">
              <Button variant="link" className="register-link">Já tenho conta</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent className="register-content">
          <form onSubmit={handleSubmit} id="register-form">
            <div className="flex flex-col gap-6">
              <div className="register-field">
                <Label htmlFor="name" className="register-label">Nome completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="João Silva"
                  required
                  disabled={isLoading}
                  className="register-input"
                />
              </div>
              <div className="register-field">
                <Label htmlFor="email" className="register-label">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu.nome@insper.edu.br"
                  required
                  disabled={isLoading}
                  className="register-input"
                />
              </div>
              <div className="register-field">
                <Label htmlFor="cellphone" className="register-label">Telefone (com código do país)</Label>
                <Input
                  id="cellphone"
                  name="cellphone"
                  type="tel"
                  placeholder="+5511999999999"
                  required
                  disabled={isLoading}
                  className="register-input"
                />
              </div>
              <div className="register-field">
                <Label htmlFor="password" className="register-label">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isLoading}
                  className="register-input"
                />
              </div>
              <div className="register-field">
                <Label htmlFor="confirmPassword" className="register-label">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  disabled={isLoading}
                  className="register-input"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="register-footer">
          <Button
            type="submit"
            form="register-form"
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
