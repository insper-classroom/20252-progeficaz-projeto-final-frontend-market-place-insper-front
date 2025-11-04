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
import "./profile.css"

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
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Meu perfil</h1>
        <p className="profile-subtitle">
          Informações da sua conta
        </p>
      </div>

      <Card className="profile-card">
        <CardHeader className="profile-card-header">
          <CardTitle className="profile-card-title">Informações pessoais</CardTitle>
          <CardDescription className="profile-card-subtitle">
            Dados cadastrados no marketplace
          </CardDescription>
        </CardHeader>
  <CardContent className="profile-card-content">
          <div className="profile-info-grid">
            <Label className="profile-label">Nome</Label>
            <p className="profile-value">{user.name}</p>
          </div>

          <div className="profile-info-grid">
            <Label className="profile-label">Email</Label>
            <p className="profile-value">{user.email}</p>
          </div>

          <div className="profile-info-grid">
            <Label className="profile-label">Telefone</Label>
            <p className="profile-value">{user.cellphone}</p>
          </div>

          <div className="profile-info-grid">
            <Label className="profile-label">Membro desde</Label>
            <p className="profile-value">{formatDate(user.created_at)}</p>
          </div>

          <div className="profile-info-grid">
            <Label className="profile-label">ID do usuário</Label>
            <p className="profile-user-id">{user.id}</p>
          </div>
        </CardContent>
        <CardFooter className="profile-card-footer">
          <Button variant="outline" onClick={handleLogout}>
            Sair da conta
          </Button>
        </CardFooter>
      </Card>

      <div className="profile-buttons">
        <Button variant="outline" onClick={() => navigate("/my-products")} className="profile-button">
          Meus produtos
        </Button>
        <Button variant="outline" onClick={() => navigate("/products")} className="profile-button">
          Ver produtos disponíveis
        </Button>
      </div>
    </div>
  )
}