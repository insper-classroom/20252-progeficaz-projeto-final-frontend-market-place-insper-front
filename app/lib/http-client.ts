/**
 * HTTP Client for Marketplace API
 *
 * Provides a typed, centralized HTTP client for making API requests with:
 * - Automatic JWT authentication
 * - Type-safe request/response handling
 * - Consistent error handling
 * - Query parameter serialization
 *
 * @example
 * ```ts
 * // GET request with authentication
 * const response = await httpClient.get<User>('/auth/me')
 *
 * // POST request without authentication
 * const loginRes = await httpClient.post<LoginResponse>(
 *   '/auth/login',
 *   { email: 'user@example.com', password: 'pass123' },
 *   { useAuth: false }
 * )
 * ```
 */

import type { ApiResponse, ApiSuccessResponse, RequestOptions } from '../types'

// ============================================================================
// Constants
// ============================================================================

/** LocalStorage key for JWT token */
export const AUTH_TOKEN_KEY = 'auth_token'

/** Base URL for API requests (from environment variable) */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// ============================================================================
// Core Request Function
// ============================================================================

/**
 * Makes an HTTP request to the API with type-safe handling
 *
 * @template T - Expected response data type
 * @param endpoint - API endpoint (e.g., '/auth/login')
 * @param options - Request options including method, body, auth, etc.
 * @returns Promise resolving to typed API response
 *
 * @example
 * ```ts
 * const response = await request<User>('/auth/me', { method: 'GET' })
 * if (response.success) {
 *   console.log(response.data.email)
 * } else {
 *   console.error(response.detail)
 * }
 * ```
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  try {
    const { useAuth = true, params, ...customOptions } = options

    // Build URL with query parameters
    let url = endpoint
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      const query = searchParams.toString()
      if (query) url += `?${query}`
    }

    // Setup headers
    const headers = new Headers(customOptions.headers || {})
    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    // Add authentication token if required
    if (useAuth) {
      const token = localStorage.getItem(AUTH_TOKEN_KEY)
      if (token) {
        headers.append('Authorization', `Bearer ${token}`)
      }
    }

    // Make the request
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...customOptions,
      headers,
    })

    // Parse response body
    const data = await response.json()

    // Handle error responses
    if (!response.ok) {
      if (response.status === 422) {
        return {
          success: false,
          detail: 'Dados inválidos. Por favor, verifique as informações enviadas.',
          status: response.status,
        }
      }
      return {
        success: false,
        detail: data.detail || data.message || data.error || `Erro inesperado (${response.status})`,
        status: response.status,
      }
    }

    // Build response metadata
    const responseHeaders: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      responseHeaders[key.toLowerCase()] = value
    })

    return {
      success: true,
      data,
      metadata: {
        headers: responseHeaders,
        status: response.status,
      },
    } as ApiSuccessResponse<T>
  } catch (error) {
    console.error('API request error:', error)
    return {
      success: false,
      detail: error instanceof Error ? error.message : 'Erro de conexão com o servidor',
    }
  }
}

// ============================================================================
// HTTP Client Methods
// ============================================================================

/**
 * HTTP client with convenience methods for common HTTP verbs
 *
 * All methods return a discriminated union type that can be checked
 * with the `success` property to determine if the request succeeded.
 */
export const httpClient = {
  /**
   * Makes a GET request
   *
   * @template T - Expected response data type
   * @param endpoint - API endpoint
   * @param options - Request options (useAuth, params, etc.)
   * @returns Promise with typed response
   *
   * @example
   * ```ts
   * const response = await httpClient.get<Product[]>('/products', {
   *   params: { q: 'iPhone' }
   * })
   * ```
   */
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'GET', ...options }),

  /**
   * Makes a POST request
   *
   * @template T - Expected response data type
   * @param endpoint - API endpoint
   * @param data - Request body data (will be JSON stringified)
   * @param options - Request options
   * @returns Promise with typed response
   *
   * @example
   * ```ts
   * const response = await httpClient.post<CreateProductResponse>(
   *   '/products',
   *   { title: 'iPhone 13', price: 3500 }
   * )
   * ```
   */
  post: <T>(endpoint: string, data?: Record<string, unknown> | unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  /**
   * Makes a PUT request
   *
   * @template T - Expected response data type
   * @param endpoint - API endpoint
   * @param data - Request body data (will be JSON stringified)
   * @param options - Request options
   * @returns Promise with typed response
   */
  put: <T>(endpoint: string, data?: Record<string, unknown> | unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  /**
   * Makes a PATCH request
   *
   * @template T - Expected response data type
   * @param endpoint - API endpoint
   * @param data - Request body data (will be JSON stringified)
   * @param options - Request options
   * @returns Promise with typed response
   */
  patch: <T>(endpoint: string, data?: Record<string, unknown> | unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  /**
   * Makes a DELETE request
   *
   * @template T - Expected response data type
   * @param endpoint - API endpoint
   * @param options - Request options
   * @returns Promise with typed response
   *
   * @example
   * ```ts
   * const response = await httpClient.delete('/products/123')
   * ```
   */
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'DELETE', ...options }),
}

export default httpClient
