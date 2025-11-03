import type { Route } from "./+types/my-products"
import { useState, useEffect, type FormEvent } from "react"
import { productsService } from "~/services"
import { useAuth } from "~/contexts/auth.context"
import type { Product, ProductCategory, ProductCondition } from "~/types"
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
import { Textarea } from "~/components/ui/textarea"
import { Badge } from "~/components/ui/badge"
import { Switch } from "~/components/ui/switch"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  PlusCircle,
  Package,
  Copy,
  CheckCircle2,
  QrCode,
  AlertCircle,
  Loader2,
  User,
  MessageCircle,
  ImagePlus,
  X,
  Star,
} from "lucide-react"
import "./my-products.css"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Meus Produtos - Marketplace Insper" },
    { name: "description", content: "Gerencie seus produtos" },
  ]
}

const CATEGORIES: { value: ProductCategory; label: string; description: string }[] = [
  { value: "eletrônicos", label: "Eletrônicos", description: "Smartphones, laptops, tablets..." },
  { value: "eletrodomésticos", label: "Eletrodomésticos", description: "Geladeira, micro-ondas..." },
  { value: "móveis", label: "Móveis", description: "Sofás, mesas, cadeiras..." },
  { value: "outros", label: "Outros", description: "Livros, roupas, decoração..." },
]

const CONSERVATION_STATES: { 
  value: ProductCondition
  label: string
  description: string
  color: string
}[] = [
  { 
    value: "novo", 
    label: "Novo",
    description: "Produto nunca usado, na embalagem",
    color: "text-green-600"
  },
  { 
    value: "seminovo", 
    label: "Seminovo",
    description: "Usado com poucos sinais de uso",
    color: "text-blue-600"
  },
  { 
    value: "usado", 
    label: "Usado",
    description: "Marcas visíveis de uso",
    color: "text-orange-600"
  },
]

export default function MyProducts() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [generatingCodeFor, setGeneratingCodeFor] = useState<string | null>(null)
  const [codes, setCodes] = useState<Record<string, string>>({})
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [uploadingImagesFor, setUploadingImagesFor] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  // New form states
  const [category, setCategory] = useState<ProductCategory>("eletrônicos")
  const [conservationState, setConservationState] = useState<ProductCondition>("usado")
  const [isFeatured, setIsFeatured] = useState(false)

  const getWhatsAppMessageToBuyer = (product: Product) => {
    if (!user || !product.buyer) return ""

    const productUrl = `${window.location.origin}/product/${product.id}`

    return encodeURIComponent(
      `Olá, ${product.buyer.name}!\n\n` +
      `Sou ${user.name}, vendedor do produto que você comprou:\n\n` +
      `*${product.title}*\n` +
      `Preço: ${formatPrice(product.price)}\n\n` +
      `Vamos combinar a entrega?\n\n` +
      `Link: ${productUrl}`
    )
  }

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
      category,
      estado_de_conservacao: conservationState,
    })

    if (response.success) {
      const productId = response.data.product.id

      // Upload images if any were selected
      if (selectedImages.length > 0) {
        setUploadingImagesFor(productId)
        let uploadedCount = 0

        for (const imageFile of selectedImages) {
          const uploadResponse = await productsService.uploadImage(productId, imageFile)
          if (uploadResponse.success) {
            uploadedCount++
          }
        }

        setUploadingImagesFor(null)

        if (uploadedCount > 0) {
          toast.success(`Produto criado com ${uploadedCount} imagem(ns)!`)
        } else {
          toast.success("Produto criado, mas erro ao fazer upload das imagens")
        }
      } else {
        toast.success("Produto criado com sucesso!")
      }

      // Reset form
      setIsCreateDialogOpen(false)
      setSelectedImages([])
      setCategory("eletrônicos")
      setConservationState("usado")
      setIsFeatured(false)
      loadMyProducts()
      e.currentTarget.reset()
    } else {
      toast.error(response.detail)
    }
    setIsCreating(false)
  }

  const handleUpdateProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingProduct) return
    setIsCreating(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string)

    const response = await productsService.updateProduct(editingProduct.id, {
      title,
      description,
      price,
      category,
      estado_de_conservacao: conservationState,
      em_destaque: isFeatured,
    })

    if (response.success && selectedImages.length > 0) {
      setUploadingImagesFor(editingProduct.id)
      let uploadedCount = 0

      for (const imageFile of selectedImages) {
        const uploadResponse = await productsService.uploadImage(editingProduct.id, imageFile)
        if (uploadResponse.success) uploadedCount++
      }

      setUploadingImagesFor(null)

      if (uploadedCount > 0)
        toast.success(`Produto atualizado com ${uploadedCount} imagem(ns)!`)
      else
        toast.error("Erro ao enviar imagens")
    }

    if (response.success) {
      toast.success("Produto atualizado com sucesso!")
      await loadMyProducts()
      setIsEditDialogOpen(false)
      setEditingProduct(null)
      setSelectedImages([])
      loadMyProducts()
    } else {
      toast.error(response.detail || "Erro ao atualizar o produto!")
    }

    setIsCreating(false)
  }

  const handleDeleteProduct = async () => {
    if (!editingProduct) return

    const confirmed = window.confirm(`Tem certeza que deseja excluir "${editingProduct.title}"?`)
    if (!confirmed) return

    setIsCreating(true)
    const response = await productsService.deleteProduct(editingProduct.id)

    if (response.success) {
      toast.success("Produto excluído com sucesso!")
      setIsEditDialogOpen(false)
      setEditingProduct(null)
      await loadMyProducts()
    } else {
      toast.error(response.detail || "Erro ao excluir o produto.")
    }

    setIsCreating(false)
  }



  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      
      // Validate file count
      if (selectedImages.length + files.length > 5) {
        toast.error("Você pode adicionar no máximo 5 imagens")
        return
      }

      // Validate file sizes (5MB max)
      const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024)
      if (invalidFiles.length > 0) {
        toast.error("Algumas imagens excedem 5MB")
        return
      }

      setSelectedImages((prev) => [...prev, ...files])
    }
  }

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
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

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setCategory(product.category)
    setConservationState(product.estado_de_conservacao)
    setIsFeatured(product.em_destaque)
    setIsEditDialogOpen(true)
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
    <div className="my-products-container">
      <div className="my-products-header">
        <div>
          <h1 className="my-products-title">Meus Anúncios</h1>
          <p className="my-products-subtitle">
            Gerencie seus produtos e gere códigos de confirmação para vendas
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="my-products-create-button">
              <PlusCircle className="my-products-create-icon" />
              Anunciar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="dialog-content">
            <DialogHeader>
              <DialogTitle>Novo produto</DialogTitle>
              <DialogDescription>
                Preencha os dados do produto que deseja vender
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProduct} id="create-product-form">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Informações Básicas</h3>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="title">
                      Título <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Ex: iPhone 13 Pro 256GB"
                      required
                      disabled={isCreating}
                      maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground">
                      Máximo 200 caracteres
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Descreva o produto em detalhes..."
                      disabled={isCreating}
                      rows={4}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="price">
                      Preço (R$) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      required
                      disabled={isCreating}
                    />
                  </div>
                </div>

                {/* Category & Conservation */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-sm">Categoria e Estado</h3>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="category">
                      Categoria <span className="text-destructive">*</span>
                    </Label>
                    <Select value={category} onValueChange={(v) => setCategory(v as ProductCategory)}>
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <div className="flex flex-col">
                              <span className="font-medium">{cat.label}</span>
                              <span className="text-xs text-muted-foreground">
                                {cat.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="conservation">
                      Estado de Conservação <span className="text-destructive">*</span>
                    </Label>
                    <Select 
                      value={conservationState} 
                      onValueChange={(v) => setConservationState(v as ProductCondition)}
                    >
                      <SelectTrigger id="conservation">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONSERVATION_STATES.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            <div className="flex flex-col">
                              <span className={`font-medium ${state.color}`}>
                                {state.label}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {state.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                    <div className="flex-1 space-y-0.5">
                      <Label htmlFor="featured" className="flex items-center gap-2 cursor-pointer">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Produto em Destaque
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Destacar produto na página inicial
                      </p>
                    </div>
                    <Switch
                      id="featured"
                      checked={isFeatured}
                      onCheckedChange={setIsFeatured}
                      disabled={isCreating}
                    />
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-4 border-t pt-4">
                  <div>
                    <Label htmlFor="images">Imagens (opcional)</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Adicione até 5 imagens (máx. 5MB cada)
                    </p>
                    <Input
                      id="images"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      multiple
                      onChange={handleImageSelect}
                      disabled={isCreating}
                      className="cursor-pointer"
                    />
                  </div>

                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          {index === 0 && (
                            <Badge className="absolute bottom-1 left-1 text-xs">
                              Principal
                            </Badge>
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveImage(index)}
                            disabled={isCreating}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </form>
            <DialogFooter className="border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false)
                  setSelectedImages([])
                  setCategory("eletrônicos")
                  setConservationState("usado")
                  setIsFeatured(false)
                }}
                disabled={isCreating || uploadingImagesFor !== null}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="create-product-form"
                disabled={isCreating || uploadingImagesFor !== null}
              >
                {uploadingImagesFor ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Fazendo upload...
                  </>
                ) : isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Criar produto
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar produto</DialogTitle>
            <DialogDescription>Atualize as informações do seu produto</DialogDescription>
          </DialogHeader>

          {editingProduct && (
            <form onSubmit={handleUpdateProduct} id="edit-product-form">
              <div className="space-y-6">
                {/* 🧾 Informações básicas */}
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Título</Label>
                    <Input
                      name="title"
                      defaultValue={editingProduct.title}
                      required
                      maxLength={200}
                      disabled={isCreating}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Descrição</Label>
                    <Textarea
                      name="description"
                      defaultValue={editingProduct.description || ""}
                      disabled={isCreating}
                      rows={4}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Preço (R$)</Label>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={editingProduct.price}
                      required
                      disabled={isCreating}
                    />
                  </div>
                </div>

                {/* 📂 Categoria e Estado */}
                <div className="space-y-4 border-t pt-4">
                  <div className="grid gap-2">
                    <Label>Categoria</Label>
                    <Select value={category} onValueChange={(v) => setCategory(v as ProductCategory)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Estado de Conservação</Label>
                    <Select
                      value={conservationState}
                      onValueChange={(v) => setConservationState(v as ProductCondition)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONSERVATION_STATES.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                    <div className="flex-1 space-y-0.5">
                      <Label htmlFor="featured" className="flex items-center gap-2 cursor-pointer">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Produto em Destaque
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Destacar produto na página inicial
                      </p>
                    </div>
                    <Switch
                      id="featured"
                      checked={isFeatured}
                      onCheckedChange={setIsFeatured}
                      disabled={isCreating}
                    />
                  </div>
                </div>

                {/* 🖼️ Imagens */}
                <div className="space-y-4 border-t pt-4">
                  <div>
                    <Label>Imagens (opcional)</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Adicione até 5 imagens (máx. 5MB cada)
                    </p>
                    <Input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      multiple
                      onChange={handleImageSelect}
                      disabled={isCreating}
                    />
                  </div>

                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          {index === 0 && (
                            <Badge className="absolute bottom-1 left-1 text-xs">Principal</Badge>
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveImage(index)}
                            disabled={isCreating}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="border-t pt-4">
                <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteProduct}
                disabled={isCreating}
              >
                Excluir produto
              </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    setSelectedImages([])
                  }}
                  disabled={isCreating}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isCreating || uploadingImagesFor !== null}>
                  {uploadingImagesFor ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Fazendo upload...
                    </>
                  ) : isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando alterações...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Salvar alterações
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>


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
            const conservationInfo = CONSERVATION_STATES.find(s => s.value === product.estado_de_conservacao)

            return (
              <Card key={product.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="truncate">{product.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 flex-wrap">
                        <span>{formatRelativeTime(product.created_at)}</span>
                        {conservationInfo && (
                          <Badge variant="outline" className={conservationInfo.color}>
                            {conservationInfo.label}
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                    {product.em_destaque && !sold && (
                      <Badge className="bg-yellow-500 shrink-0">
                        <Star className="h-3 w-3 mr-1" />
                        Destaque
                      </Badge>
                    )}
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
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
                    <Badge variant="outline" className="text-xs">
                      {CATEGORIES.find(c => c.value === product.category)?.label}
                    </Badge>
                  </div>

                  {sold ? (
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4 space-y-3">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle2 className="h-5 w-5" />
                        <p className="text-sm font-medium">
                          Produto vendido com sucesso!
                        </p>
                      </div>


                      {product.buyer && (
                        <div className="border-t border-green-200 pt-3 space-y-2">
                          <p className="text-xs text-green-700 font-medium">Comprador</p>
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
                              const message = getWhatsAppMessageToBuyer(product)
                              window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
                            }}
                          >
                            <MessageCircle className="h-3 w-3 mr-2" />
                            Contatar comprador
                          </Button>
                        </div>
                      )}
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
                        <>
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

                          {/* 👇 Aqui vem o botão de editar, fora do botão acima */}
                          <Button
                            variant="secondary"
                            className="w-full mt-2"
                            onClick={() => handleEditProduct(product)}
                          >
                            Editar produto
                          </Button>
                        </>
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