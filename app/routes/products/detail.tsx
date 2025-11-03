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
  Shield,
  User,
  MessageCircle,
  ImageIcon,
  Heart,
  Loader2,
} from "lucide-react"
import "./detail.css"

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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false)


  const handleToggleFavorite = async () => {
  if (!product) return
  setIsUpdatingFavorite(true)

  try {
    if (isFavorited) {
      const response = await productsService.unfavoriteProduct(product.id)
      if (response.success) {
        setIsFavorited(false)
        toast.success("Removido dos favoritos")
      } else {
        toast.error(response.detail ?? "Erro ao remover dos favoritos")
      }
    } else {
      const response = await productsService.favoriteProduct(product.id)
      if (response.success) {
        setIsFavorited(true)
        toast.success("Adicionado aos favoritos")
      } else {
        toast.error(response.detail ?? "Erro ao adicionar aos favoritos")
      }
    }
  } catch (err) {
    console.error(err)
    toast.error("Erro ao atualizar favoritos")
  } finally {
    setIsUpdatingFavorite(false)
  }
}
  const getWhatsAppMessage = (isSeller: boolean) => {
    if (!product || !user) return ""

    const productUrl = `${window.location.origin}/product/${product.id}`

    if (isSeller) {
      // Mensagem para o vendedor (enviada pelo comprador interessado)
      return encodeURIComponent(
        `Olá, ${product.owner.name}!\n\n` +
        `Meu nome é ${user.name} e tenho interesse no seu produto:\n\n` +
        `*${product.title}*\n` +
        `Preço: ${formatPrice(product.price)}\n\n` +
        `Podemos negociar?\n\n` +
        `Link: ${productUrl}`
      )
    } else {
      // Mensagem para o comprador (enviada pelo vendedor)
      return encodeURIComponent(
        `Olá, ${product.buyer?.name}! 👋\n\n` +
        `Sou ${user.name}, vendedor do produto que você comprou:\n\n` +
        `📦 *${product.title}*\n` +
        `💰 Preço: ${formatPrice(product.price)}\n\n` +
        `Vamos combinar a entrega?\n\n` +
        `Link: ${productUrl}`
      )
    }
  }

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
      toast.error("Produto não encontrado")
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

  const isOwner = user?.id === product.owner.id
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
          {/* Image Gallery */}
          {product.images && product.images.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="relative w-full h-96 bg-muted">
                  <img
                    src={product.images[selectedImageIndex]}
                    alt={`${product.title} - Imagem ${selectedImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="p-4 border-t">
                    <div className="grid grid-cols-5 gap-2">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative w-full h-20 rounded border-2 overflow-hidden transition-all ${
                            selectedImageIndex === index
                              ? 'border-primary'
                              : 'border-transparent hover:border-muted-foreground/50'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Miniatura ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="relative w-full h-96 bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="h-24 w-24 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">Sem imagens disponíveis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2">{product.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Publicado em {formatDate(product.created_at)}
                  </CardDescription>
                </div>

                <div className="flex flex-col items-end gap-2">
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

                  {!isOwner && !isSold && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={handleToggleFavorite}
                      disabled={isUpdatingFavorite}
                    >
                      {isUpdatingFavorite ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Heart
                          className={`h-5 w-5 ${
                            isFavorited ? "text-red-500 fill-red-500" : "text-red-500"
                          }`}
                        />
                      )}
                    </Button>
                  )}
                </div>
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
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3 text-green-800">
                  <CheckCircle2 className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Produto vendido</p>
                    <p className="text-sm text-green-700">
                      Este produto já foi comprado e não está mais disponível
                    </p>
                  </div>
                </div>

                {isOwner && product.buyer && (
                  <div className="border-t border-green-200 pt-4">
                    <p className="text-xs text-green-700 font-medium mb-3">Comprador</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                        <User className="h-5 w-5 text-green-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-green-900">{product.buyer.name}</p>
                        <p className="text-sm text-green-700">{product.buyer.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 border-green-300 text-green-800 hover:bg-green-100 hover:text-green-900"
                      onClick={() => {
                        const phone = product.buyer!.cellphone.replace(/\D/g, '')
                        const message = getWhatsAppMessage(false)
                        window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contatar comprador via WhatsApp
                    </Button>
                  </div>
                )}
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

          {!isOwner && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Vendedor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{product.owner.name}</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const phone = product.owner.cellphone.replace(/\D/g, '')
                    const message = getWhatsAppMessage(true)
                    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contatar via WhatsApp
                </Button>
              </CardContent>
            </Card>
          )}

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
