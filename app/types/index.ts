/**
 * Type definitions for the Marketplace API
 *
 * This file contains all TypeScript interfaces and types used throughout the application
 * for type-safe API communication.
 */

// ============================================================================
// User Types
// ============================================================================

/**
 * Represents a user in the system
 */
export interface User {
  /** Unique identifier (MongoDB ObjectId) */
  id: string
  /** User's email address (unique) */
  email: string
  /** User's display name */
  name: string
  /** User's cellphone number (with country code, e.g., +5511999999999) */
  cellphone: string
  /** Account creation timestamp (ISO 8601 format) */
  created_at: string
}

/**
 * Payload for user registration
 */
export interface RegisterRequest {
  /** Valid email address */
  email: string
  /** User's full name */
  name: string
  /** Password (will be hashed on server) */
  password: string
  /** User's cellphone number (with country code, e.g., +5511999999999) */
  cellphone: string
}

/**
 * Payload for user login
 */
export interface LoginRequest {
  /** Registered email address */
  email: string
  /** User's password */
  password: string
}

/**
 * Response from successful login
 */
export interface LoginResponse {
  /** JWT access token for authentication */
  access_token: string
}

/**
 * Response from successful registration
 */
export interface RegisterResponse {
  /** Success message */
  message: string
  /** Created user data */
  user: User
}

// ============================================================================
// Product Types
// ============================================================================

/**
 * Represents a product in the marketplace
 */
export interface Product {
  /** Unique identifier (MongoDB ObjectId) */
  id: string
  /** Product title (max 200 chars) */
  title: string
  /** Product description */
  description: string
  /** Product price (>= 0) */
  price: number
  /** Owner/seller user object */
  owner: User
  /** Buyer user object (null if not sold) */
  buyer: User | null
  /** List of image URLs from Cloudinary */
  images: string[]
  /** URL of the first image (used for thumbnail in listings) */
  thumbnail: string | null
  /** Product creation timestamp (ISO 8601 format) */
  created_at: string
}

/**
 * Payload for creating a new product
 */
export interface CreateProductRequest {
  /** Product title (max 200 chars) */
  title: string
  /** Product description (optional) */
  description?: string
  /** Product price (must be >= 0) */
  price: number
}

/**
 * Response from successful product creation
 */
export interface CreateProductResponse {
  /** Success message */
  message: string
  /** Created product data */
  product: Product
}

/**
 * Response from generating a confirmation code
 */
export interface GenerateCodeResponse {
  /** Success or info message */
  message: string
  /** 8-character confirmation code */
  confirmation_code: string
  /** Product data (only on first generation) */
  product?: Product
}

/**
 * Payload for confirming a purchase with code
 */
export interface ConfirmPurchaseRequest {
  /** 8-character confirmation code from seller */
  confirmation_code: string
}

/**
 * Response from successful purchase confirmation
 */
export interface ConfirmPurchaseResponse {
  /** Success message */
  message: string
  /** Updated product data with buyer set */
  product: Product
}

/**
 * Query parameters for searching products
 */
export interface ProductSearchParams {
  /** Search term for title/description (case-insensitive) */
  q?: string
}

/**
 * Payload for adding image to product
 */
export interface AddImageRequest {
  /** Base64 encoded image string or image URL */
  image: string
}

/**
 * Response from adding image to product
 */
export interface AddImageResponse {
  /** Success message */
  message: string
  /** URL of the uploaded image */
  image_url: string
  /** Updated product data with new image */
  product: Product
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Metadata included in successful API responses
 */
export interface ResponseMetadata {
  /** Response headers */
  headers: Record<string, string>
  /** HTTP status code */
  status: number
}

/**
 * Successful API response wrapper
 */
export interface ApiSuccessResponse<T> {
  /** Indicates success */
  success: true
  /** Response data */
  data: T
  /** Response metadata */
  metadata: ResponseMetadata
}

/**
 * Error API response wrapper
 */
export interface ApiErrorResponse {
  /** Indicates failure */
  success: false
  /** Error message/detail */
  detail: string
  /** HTTP status code (if available) */
  status?: number
}

/**
 * Union type for all API responses
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

// ============================================================================
// HTTP Client Options
// ============================================================================

/**
 * Extended request options for the HTTP client
 */
export interface RequestOptions extends RequestInit {
  /** Whether to include authentication token (default: true) */
  useAuth?: boolean
  /** Query parameters to append to URL */
  params?: Record<string, unknown>
}
