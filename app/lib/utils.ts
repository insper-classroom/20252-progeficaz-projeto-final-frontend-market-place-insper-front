import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ApiResponse } from '../types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================================
// API Response Utilities
// ============================================================================

/** Type guard to check if API response was successful */
export function isSuccessResponse<T>(
  response: ApiResponse<T>,
): response is ApiResponse<T> & { success: true } {
  return response.success
}

/** Type guard to check if API response was an error */
export function isErrorResponse<T>(
  response: ApiResponse<T>,
): response is ApiResponse<T> & { success: false } {
  return !response.success
}

/** Get error message from API response */
export function getErrorMessage(response: ApiResponse<unknown>): string {
  if (!response.success) {
    return response.detail
  }
  return 'Erro desconhecido'
}

// ============================================================================
// Formatting Utilities
// ============================================================================

/** Format price in BRL currency */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

/** Format date to Brazilian format */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

/** Format date to relative time (e.g., "2 dias atrás") */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInSeconds = Math.floor(diffInMs / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInDays > 0) return `${diffInDays} dia${diffInDays > 1 ? 's' : ''} atrás`
  if (diffInHours > 0) return `${diffInHours} hora${diffInHours > 1 ? 's' : ''} atrás`
  if (diffInMinutes > 0) return `${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''} atrás`
  return 'agora mesmo'
}

// ============================================================================
// Validation Utilities
// ============================================================================

/** Validate email format */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/** Validate price (must be >= 0) */
export function isValidPrice(price: number): boolean {
  return price >= 0 && !isNaN(price)
}

// ============================================================================
// Product Utilities
// ============================================================================

/** Check if product is sold */
export function isProductSold(product: { buyer_id: string | null }): boolean {
  return product.buyer_id !== null
}

// ============================================================================
// Clipboard Utilities
// ============================================================================

/** Copy text to clipboard */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}
