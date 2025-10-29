import type { Route } from "./+types/sales"
import { useState, useEffect } from "react"
import { Link } from "react-router"
import { authService } from "~/services"
import type { Product } from "~/types"
import { toast } from "sonner"
import { formatPrice, formatRelativeTime } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import {
  TrendingUp,
  Package,
  User,
  MessageCircle,
  Loader2,
  ImageIcon,
  CheckCircle2,
} from "lucide-react"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Minhas Vendas - Marketplace Insper" },
    { name: "description", content: "Veja seus produtos vendidos" },
  ]
}

export default function Sales() {
  const [sales, setSales] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSales()
  }, [])

  const loadSales = async () => {
    setIsLoading(true)
    const response = await authService.getMySales()
    if (response.success) {
      setSales(response.data.sales)
    } else {
      toast.error("Erro ao carregar vendas")
    }
    setIsLoading(false)
  }

  const getWhatsAppMessage = (product: Product) => {
    if (!product.buyer) return ""

    const productUrl = `${window.location.origin}/product/${product.id}`
    return encodeURIComponent(
      `Olá, ${product.buyer.name}! 👋\n\n` +
      `Obrigado por comprar meu produto:\n\n` +
      `📦 *${product.title}*\n` +
      `💰 Preço: ${formatPrice(product.price)}\n\n` +
      `Vamos combinar a entrega?\n\n` +
      `Link: ${productUrl}`
    )
  }

  const totalRevenue = sales.reduce((sum, product) => sum + product.price, 0)

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Minhas Vendas</h1>
        </div>
        <p className="text-muted-foreground">
          Produtos que você vendeu no marketplace
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : sales.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma venda realizada</h3>
            <p className="text-muted-foreground mb-6">
              Você ainda não vendeu nenhum produto. Comece anunciando!
            </p>
            <Link to="/my-products">
              <Button>
                <Package className="h-4 w-4 mr-2" />
                Anunciar Produto
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Revenue Card */}
          <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Total em Vendas</p>
                  <p className="text-3xl font-bold text-green-900 mt-1">
                    {formatPrice(totalRevenue)}
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    {sales.length} {sales.length === 1 ? "produto vendido" : "produtos vendidos"}
                  </p>
                </div>
                <div className="p-4 bg-green-100 rounded-full">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sales.map((product) => (
              <Card key={product.id} className="flex flex-col border-green-200 bg-green-50/30">
                {product.thumbnail ? (
                  <div className="relative w-full h-48 bg-muted">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Vendido
                    </Badge>
                  </div>
                ) : (
                  <div className="relative w-full h-48 bg-muted flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
                    <Badge className="absolute top-2 right-2 bg-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Vendido
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="truncate">{product.title}</CardTitle>
                  <CardDescription>
                    {formatRelativeTime(product.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description || "Sem descrição"}
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {formatPrice(product.price)}
                  </p>

                  {/* Buyer Info */}
                  {product.buyer && (
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4 space-y-3">
                      <p className="text-xs font-medium text-green-800">Comprador</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                          <User className="h-4 w-4 text-green-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-green-900">{product.buyer.name}</p>
                          <p className="text-xs text-green-700">{product.buyer.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-green-300 text-green-800 hover:bg-green-100 hover:text-green-900"
                        onClick={() => {
                          const phone = product.buyer!.cellphone.replace(/\D/g, '')
                          const message = getWhatsAppMessage(product)
                          window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
                        }}
                      >
                        <MessageCircle className="h-3 w-3 mr-2" />
                        Contatar comprador
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Link to={`/product/${product.id}`} className="w-full">
                    <Button variant="outline" className="w-full border-green-300 hover:bg-green-100">
                      Ver detalhes
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
