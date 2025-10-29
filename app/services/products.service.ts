/**
 * Products Service
 *
 * Handles all product-related API calls.
 */

import { httpClient } from '../lib/http-client'
import type {
  ApiResponse,
  Product,
  CreateProductRequest,
  CreateProductResponse,
  GenerateCodeResponse,
  ConfirmPurchaseRequest,
  ConfirmPurchaseResponse,
  ProductSearchParams,
  AddImageRequest,
  AddImageResponse,
} from '../types'

export const productsService = {
  /**
   * List all available products (not sold yet)
   * Optional search by query param
   */
  listProducts: async (params?: ProductSearchParams): Promise<ApiResponse<Product[]>> => {
    return httpClient.get<Product[]>('/products', {
      params: params as Record<string, unknown>,
      useAuth: false
    })
  },

  /**
   * Get a specific product by ID
   */
  getProduct: async (productId: string): Promise<ApiResponse<Product>> => {
    return httpClient.get<Product>(`/products/${productId}`, { useAuth: false })
  },

  /**
   * Create a new product (requires authentication)
   */
  createProduct: async (
    data: CreateProductRequest,
  ): Promise<ApiResponse<CreateProductResponse>> => {
    return httpClient.post<CreateProductResponse>('/products', data)
  },

  /**
   * Generate confirmation code for a product
   * Only the owner can generate the code
   */
  generateCode: async (productId: string): Promise<ApiResponse<GenerateCodeResponse>> => {
    return httpClient.post<GenerateCodeResponse>(`/products/${productId}/generate-code`, {})
  },

  /**
   * Confirm purchase with confirmation code
   * The buyer uses the code provided by the seller
   */
  confirmPurchase: async (
    data: ConfirmPurchaseRequest,
  ): Promise<ApiResponse<ConfirmPurchaseResponse>> => {
    return httpClient.post<ConfirmPurchaseResponse>('/products/confirm-with-code', data)
  },

  /**
   * Get all products owned by current user
   * Note: API doesn't have this endpoint, so we filter client-side
   * This only returns unsold products
   */
  getMyProducts: async (userId: string): Promise<ApiResponse<Product[]>> => {
    const response = await httpClient.get<Product[]>('/products', { useAuth: false })

    if (response.success) {
      const myProducts = response.data.filter((product) => product.owner.id === userId)
      return {
        ...response,
        data: myProducts,
      }
    }

    return response
  },

  /**
   * Upload image to product (converts file to base64 and sends to API)
   * Only the owner can upload images
   */
  uploadImage: async (
    productId: string,
    imageFile: File,
  ): Promise<ApiResponse<AddImageResponse>> => {
    return new Promise((resolve) => {
      const reader = new FileReader()

      reader.onloadend = async () => {
        const base64String = reader.result as string

        const response = await httpClient.post<AddImageResponse>(
          `/products/${productId}/images`,
          { image: base64String } as AddImageRequest
        )

        resolve(response)
      }

      reader.onerror = () => {
        resolve({
          success: false,
          detail: 'Erro ao ler o arquivo de imagem',
        })
      }

      reader.readAsDataURL(imageFile)
    })
  },
}

export default productsService
