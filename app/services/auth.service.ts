/**
 * Authentication Service
 *
 * Handles all authentication-related API calls including:
 * - User registration
 * - User login
 * - Getting current user profile
 * - Token management
 *
 * @example
 * ```ts
 * import { authService } from '@/services/auth.service'
 *
 * // Register a new user
 * const registerResult = await authService.register({
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   password: 'secure123'
 * })
 *
 * if (registerResult.success) {
 *   console.log('User created:', registerResult.data.user)
 * }
 *
 * // Login
 * const loginResult = await authService.login({
 *   email: 'user@example.com',
 *   password: 'secure123'
 * })
 *
 * if (loginResult.success) {
 *   console.log('Logged in! Token:', loginResult.data.access_token)
 * }
 *
 * // Get current user
 * const meResult = await authService.getCurrentUser()
 * if (meResult.success) {
 *   console.log('Current user:', meResult.data)
 * }
 * ```
 */

import { httpClient, AUTH_TOKEN_KEY } from '../lib/http-client'
import type {
  ApiResponse,
  User,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  SalesResponse,
  PurchasesResponse,
  FavoritesResponse,
} from '../types'

// ============================================================================
// Authentication Service
// ============================================================================

export const authService = {
  /**
   * Register a new user
   *
   * Creates a new user account in the system.
   *
   * @param data - Registration data (email, name, password)
   * @returns Promise with registration response or error
   *
   * @example
   * ```ts
   * const result = await authService.register({
   *   email: 'user@example.com',
   *   name: 'John Doe',
   *   password: 'secure123'
   * })
   *
   * if (result.success) {
   *   console.log('User created:', result.data.user)
   * } else {
   *   console.error('Error:', result.detail)
   *   // Possible errors:
   *   // - 400: Email or password missing, or email invalid
   *   // - 409: Email already registered
   * }
   * ```
   */
  register: async (data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
    return httpClient.post<RegisterResponse>('/auth/register', data, { useAuth: false })
  },

  /**
   * Login with email and password
   *
   * Authenticates the user and returns a JWT access token.
   * The token is automatically stored in localStorage for subsequent requests.
   *
   * @param data - Login credentials (email, password)
   * @returns Promise with login response containing access token or error
   *
   * @example
   * ```ts
   * const result = await authService.login({
   *   email: 'user@example.com',
   *   password: 'secure123'
   * })
   *
   * if (result.success) {
   *   console.log('Access token:', result.data.access_token)
   *   // Token is automatically stored in localStorage
   * } else {
   *   console.error('Login failed:', result.detail)
   *   // Possible errors:
   *   // - 400: Email or password missing
   *   // - 401: Invalid credentials
   * }
   * ```
   */
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await httpClient.post<LoginResponse>('/auth/login', data, { useAuth: false })

    // Store token in localStorage on successful login
    if (response.success) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.access_token)
    }

    return response
  },

  /**
   * Get current authenticated user profile
   *
   * Retrieves the profile information for the currently logged-in user.
   * Requires a valid JWT token in localStorage.
   *
   * @returns Promise with user data or error
   *
   * @example
   * ```ts
   * const result = await authService.getCurrentUser()
   *
   * if (result.success) {
   *   console.log('Current user:', result.data)
   *   console.log('Email:', result.data.email)
   *   console.log('Name:', result.data.name)
   * } else {
   *   console.error('Error:', result.detail)
   *   // Possible errors:
   *   // - 401: Token missing or invalid
   *   // - 422: Invalid token format
   * }
   * ```
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return httpClient.get<User>('/auth/me')
  },

  /**
   * Get user sales
   *
   * Retrieves all products sold by the current user
   */
  getMySales: async (): Promise<ApiResponse<SalesResponse>> => {
    return httpClient.get<SalesResponse>('/auth/me/sales')
  },

  /**
   * Get user purchases
   *
   * Retrieves all products purchased by the current user
   */
  getMyPurchases: async (): Promise<ApiResponse<PurchasesResponse>> => {
    return httpClient.get<PurchasesResponse>('/auth/me/purchases')
  },

  /**
   * Get user favorites
   *
   * Retrieves all products favorited by the current user
   */
  getMyFavorites: async (): Promise<ApiResponse<FavoritesResponse>> => {
    return httpClient.get<FavoritesResponse>('/auth/me/favorites')
  },

  /**
   * Logout the current user
   *
   * Removes the authentication token from localStorage.
   * Note: This is a client-side only operation (no API call).
   *
   * @example
   * ```ts
   * authService.logout()
   * console.log('User logged out')
   * ```
   */
  logout: (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  },

  /**
   * Check if user is authenticated
   *
   * Checks if a valid token exists in localStorage.
   * Note: This only checks for token presence, not validity.
   *
   * @returns true if token exists, false otherwise
   *
   * @example
   * ```ts
   * if (authService.isAuthenticated()) {
   *   console.log('User is logged in')
   * } else {
   *   console.log('User is not logged in')
   * }
   * ```
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY)
  },

  /**
   * Get the current authentication token
   *
   * Retrieves the JWT token from localStorage.
   *
   * @returns JWT token string or null if not authenticated
   *
   * @example
   * ```ts
   * const token = authService.getToken()
   * if (token) {
   *   console.log('Token:', token)
   * }
   * ```
   */
  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  },
}

export default authService
