import type { Route } from "./+types/profile"
import { useAuth } from "~/contexts/auth.context"
import { useNavigate } from "react-router"
import { formatDate } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Label } from "~/components/ui/label"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Perfil - Marketplace Insper" },
    { name: "description", content: "Veja seu perfil" },
  ]
}

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meu perfil</h1>
        <p className="text-muted-foreground">
          Informações da sua conta
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações pessoais</CardTitle>
          <CardDescription>
            Dados cadastrados no marketplace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label>Nome</Label>
            <p className="text-lg">{user.name}</p>
          </div>

          <div className="grid gap-2">
            <Label>Email</Label>
            <p className="text-lg">{user.email}</p>
          </div>

          <div className="grid gap-2">
            <Label>Membro desde</Label>
            <p className="text-lg">{formatDate(user.created_at)}</p>
          </div>

          <div className="grid gap-2">
            <Label>ID do usuário</Label>
            <p className="text-sm text-muted-foreground font-mono">{user.id}</p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" onClick={handleLogout}>
            Sair da conta
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Button variant="outline" onClick={() => navigate("/my-products")}>
          Meus produtos
        </Button>
        <Button variant="outline" onClick={() => navigate("/products")}>
          Ver produtos disponíveis
        </Button>
      </div>
    </div>
  )
}
