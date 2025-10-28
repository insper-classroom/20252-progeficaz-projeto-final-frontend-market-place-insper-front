import type { Route } from "./+types/detail"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { productsService } from "~/services"
import { useAuth } from "~/contexts/auth.context"
import type { Product } from "~/types"
import { toast } from "sonner"
import { formatPrice, formatDate, isProductSold } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Badge } from "~/components/ui/badge"
import {
  ArrowLeft,
  Tag,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Shield
} from "lucide-react"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Detalhes do Produto - Marketplace Insper" },
    { name: "description", content: "Veja os detalhes do produto" },
  ]
}

export default function ProductDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [confirmationCode, setConfirmationCode] = useState("")
  const [isConfirming, setIsConfirming] = useState(false)

  useEffect(() => {
    if (id) {
      loadProduct()
    }
  }, [id])

  const loadProduct = async () => {
    if (!id) return
    setIsLoading(true)
    const response = await productsService.getProduct(id)
    if (response.success) {
      setProduct(response.data)
    } else {
      setError("Produto não encontrado")
    }
    setIsLoading(false)
  }

  const handleConfirmPurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsConfirming(true)

    const response = await productsService.confirmPurchase({
      confirmation_code: confirmationCode,
    })

    if (response.success) {
      toast.success("Compra confirmada com sucesso!")
      setTimeout(() => navigate("/"), 2000)
    } else {
      toast.error(response.detail)
    }
    setIsConfirming(false)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">Carregando...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Produto não encontrado</p>
            <Button onClick={() => navigate("/products")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para produtos
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isOwner = user?.id === product.owner_id
  const isSold = isProductSold(product)

  return (
    <div className="container mx-auto p-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2">{product.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Publicado em {formatDate(product.created_at)}
                  </CardDescription>
                </div>
                {isSold && (
                  <Badge variant="secondary" className="ml-4">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Vendido
                  </Badge>
                )}
                {isOwner && !isSold && (
                  <Badge className="ml-4">
                    Seu produto
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Descrição
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description || "Sem descrição fornecida pelo vendedor."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Purchase section */}
          {!isOwner && !isSold && (
            <Card>
              <CardHeader>
                <CardTitle>Comprar este produto</CardTitle>
                <CardDescription>
                  Entre em contato com o vendedor para obter o código de confirmação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleConfirmPurchase} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Código de confirmação</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="Insira o código de 8 caracteres"
                      value={confirmationCode}
                      onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
                      required
                      disabled={isConfirming}
                      maxLength={8}
                      className="font-mono text-center text-lg"
                    />
                    <p className="text-xs text-muted-foreground">
                      Peça o código ao vendedor via WhatsApp ou pessoalmente
                    </p>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isConfirming}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {isConfirming ? "Confirmando compra..." : "Confirmar compra"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {isSold && (
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-green-800">
                  <CheckCircle2 className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Produto vendido</p>
                    <p className="text-sm text-green-700">
                      Este produto já foi comprado e não está mais disponível
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isOwner && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-blue-800">
                  <Shield className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Este é o seu produto</p>
                    <p className="text-sm text-blue-700">
                      {isSold
                        ? "Seu produto foi vendido com sucesso!"
                        : "Gerencie este produto em 'Meus Anúncios'"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preço</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{formatPrice(product.price)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                <span className="text-muted-foreground">
                  Sistema de código de confirmação
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                <span className="text-muted-foreground">
                  Apenas alunos do Insper
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                <span className="text-muted-foreground">
                  Transação segura
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
