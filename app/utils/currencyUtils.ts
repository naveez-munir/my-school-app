/**
 * Currency utility functions for consistent formatting across the application
 */

/**
 * Formats a number as currency without currency symbol
 * Uses Indian number formatting (lakhs/crores system with commas)
 * 
 * @param amount - The amount to format
 * @returns Formatted string with commas (e.g., "17,000")
 * 
 * @example
 * formatCurrency(17000) // "17,000"
 * formatCurrency(1500000) // "15,00,000"
 * formatCurrency(0) // "0"
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  });
}

/**
 * Formats a number as currency with "Rs" prefix
 * 
 * @param amount - The amount to format
 * @returns Formatted string with Rs prefix (e.g., "Rs 17,000")
 * 
 * @example
 * formatCurrencyWithSymbol(17000) // "Rs 17,000"
 */
export function formatCurrencyWithSymbol(amount: number): string {
  return `Rs ${formatCurrency(amount)}`;
}

/**
 * Formats a number as currency with "Rs." prefix
 * 
 * @param amount - The amount to format
 * @returns Formatted string with Rs. prefix (e.g., "Rs. 17,000")
 * 
 * @example
 * formatCurrencyWithDot(17000) // "Rs. 17,000"
 */
export function formatCurrencyWithDot(amount: number): string {
  return `Rs. ${formatCurrency(amount)}`;
}

