import type { Route } from "./+types/my-products"
import { useState, useEffect, type FormEvent } from "react"
import { productsService } from "~/services"
import { useAuth } from "~/contexts/auth.context"
import type { Product } from "~/types"
import { toast } from "sonner"
import { formatPrice, formatRelativeTime, isProductSold, copyToClipboard } from "~/lib/utils"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  PlusCircle,
  Package,
  Copy,
  CheckCircle2,
  QrCode,
  AlertCircle,
  Loader2,
} from "lucide-react"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Meus Produtos - Marketplace Insper" },
    { name: "description", content: "Gerencie seus produtos" },
  ]
}

export default function MyProducts() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [generatingCodeFor, setGeneratingCodeFor] = useState<string | null>(null)
  const [codes, setCodes] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) {
      loadMyProducts()
    }
  }, [user])

  const loadMyProducts = async () => {
    if (!user) return
    setIsLoading(true)
    const response = await productsService.getMyProducts(user.id)
    if (response.success) {
      setProducts(response.data)
    }
    setIsLoading(false)
  }

  const handleCreateProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsCreating(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string)

    const response = await productsService.createProduct({
      title,
      description,
      price,
    })

    if (response.success) {
      toast.success("Produto criado com sucesso!")
      setIsCreateDialogOpen(false)
      loadMyProducts()
      e.currentTarget.reset()
    } else {
      toast.error(response.detail)
    }
    setIsCreating(false)
  }

  const handleGenerateCode = async (productId: string) => {
    setGeneratingCodeFor(productId)
    const response = await productsService.generateCode(productId)
    if (response.success) {
      setCodes((prev) => ({ ...prev, [productId]: response.data.confirmation_code }))
      toast.success("Código gerado! Envie para o comprador")
    } else {
      toast.error("Erro ao gerar código")
    }
    setGeneratingCodeFor(null)
  }

  const handleCopyCode = async (code: string) => {
    const success = await copyToClipboard(code)
    if (success) {
      toast.success("Código copiado para área de transferência!")
    } else {
      toast.error("Erro ao copiar código")
    }
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meus Anúncios</h1>
          <p className="text-muted-foreground">
            Gerencie seus produtos e gere códigos de confirmação para vendas
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <PlusCircle className="h-5 w-5 mr-2" />
              Anunciar Produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo produto</DialogTitle>
              <DialogDescription>
                Preencha os dados do produto que deseja vender
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProduct} id="create-product-form">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="iPhone 13 Pro"
                    required
                    disabled={isCreating}
                    maxLength={200}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Seminovo, 256GB, azul"
                    disabled={isCreating}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="3500.00"
                    required
                    disabled={isCreating}
                  />
                </div>
              </div>
            </form>
            <DialogFooter>
              <Button
                type="submit"
                form="create-product-form"
                disabled={isCreating}
              >
                {isCreating ? "Criando..." : "Criar produto"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : products.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">Nenhum produto anunciado</h3>
            <p className="text-muted-foreground mb-6">
              Comece a vender criando seu primeiro anúncio
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Criar primeiro anúncio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const sold = isProductSold(product)
            const code = codes[product.id]

            return (
              <Card key={product.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="truncate">{product.title}</CardTitle>
                      <CardDescription>
                        {formatRelativeTime(product.created_at)}
                      </CardDescription>
                    </div>
                    {sold && (
                      <Badge variant="secondary" className="shrink-0">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Vendido
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description || "Sem descrição"}
                  </p>
                  <p className="text-2xl font-bold">{formatPrice(product.price)}</p>

                  {sold ? (
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle2 className="h-5 w-5" />
                        <p className="text-sm font-medium">
                          Produto vendido com sucesso!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {code ? (
                        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <QrCode className="h-4 w-4 text-blue-600" />
                            <p className="text-xs font-medium text-blue-600">
                              Código de confirmação
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 text-xl font-mono font-bold text-blue-900 tracking-wider bg-white rounded px-3 py-2 text-center">
                              {code}
                            </code>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleCopyCode(code)}
                              className="shrink-0"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-blue-700">
                            Envie este código para o comprador
                          </p>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleGenerateCode(product.id)}
                          disabled={generatingCodeFor === product.id}
                        >
                          {generatingCodeFor === product.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Gerando código...
                            </>
                          ) : (
                            <>
                              <QrCode className="h-4 w-4 mr-2" />
                              Gerar código de venda
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
