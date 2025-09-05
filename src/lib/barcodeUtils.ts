import JsBarcode from 'jsbarcode'

/**
 * Generate a UPC-A barcode from a product SKU
 * UPC-A requires 12 digits, so we'll create one from the SKU
 */
export function generateUPCAFromSKU(sku: string): string {
  try {
    // Remove non-alphanumeric characters and convert to uppercase
    const cleanSku = sku.replace(/[^A-Z0-9]/gi, '').toUpperCase()

    // Create a simple hash of the SKU to generate consistent numeric values
    let hash = 0
    for (let i = 0; i < cleanSku.length; i++) {
      const char = cleanSku.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }

    // Convert to positive number and pad to get 11 digits (12th will be check digit)
    const hashStr = Math.abs(hash).toString().padStart(11, '0').slice(0, 11)

    // Calculate UPC-A check digit
    const checkDigit = calculateUPCACheckDigit(hashStr)

    return hashStr + checkDigit
  } catch (error) {
    console.error('Error generating UPC-A from SKU:', error)
    // Return a default valid UPC-A code instead of throwing
    return '123456789012'
  }
}

/**
 * Calculate UPC-A check digit using the standard algorithm
 */
function calculateUPCACheckDigit(elevenDigits: string): string {
  let oddSum = 0
  let evenSum = 0

  for (let i = 0; i < 11; i++) {
    const digit = parseInt(elevenDigits[i])
    if (i % 2 === 0) {
      oddSum += digit
    } else {
      evenSum += digit
    }
  }

  const total = oddSum * 3 + evenSum
  const checkDigit = (10 - (total % 10)) % 10

  return checkDigit.toString()
}

/**
 * Validate UPC-A barcode format
 */
export function validateUPCA(barcode: string): boolean {
  try {
    // Must be exactly 12 digits
    if (!/^\d{12}$/.test(barcode)) {
      return false
    }

    // Verify check digit
    const elevenDigits = barcode.slice(0, 11)
    const providedCheckDigit = barcode[11]
    const calculatedCheckDigit = calculateUPCACheckDigit(elevenDigits)

    return providedCheckDigit === calculatedCheckDigit
  } catch (error) {
    console.error('Error validating UPC-A:', error)
    return false
  }
}

/**
 * Generate barcode image as SVG string
 */
export function generateBarcodeImage(
  barcode: string,
  options?: {
    width?: number
    height?: number
    fontSize?: number
    textMargin?: number
  },
): string {
  const { width = 2, height = 100, fontSize = 20, textMargin = 2 } = options || {}

  try {
    // Create a canvas element to generate the barcode
    const canvas = document.createElement('canvas')

    JsBarcode(canvas, barcode, {
      format: 'UPC',
      width,
      height,
      fontSize,
      textMargin,
      textPosition: 'bottom',
      background: '#ffffff',
      lineColor: '#000000',
      margin: 10,
      displayValue: true,
    })

    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('Error generating barcode:', error)
    throw new Error('Failed to generate barcode image')
  }
}

/**
 * Generate barcode image as SVG string (server-side compatible)
 */
export async function generateBarcodeImageSVG(
  barcode: string,
  options?: {
    width?: number
    height?: number
    fontSize?: number
    textMargin?: number
  },
): Promise<string> {
  const { width = 2, height = 100, fontSize = 20, textMargin = 2 } = options || {}

  try {
    // Use dynamic import for server-side SVG generation
    const xmldom = await import('xmldom')
    const { DOMImplementation, XMLSerializer } = xmldom
    const dom = new DOMImplementation()
    const document = dom.createDocument('http://www.w3.org/1999/xhtml', 'html', null)

    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

    JsBarcode(svgElement, barcode, {
      format: 'UPC',
      width,
      height,
      fontSize,
      textMargin,
      textPosition: 'bottom',
      background: '#ffffff',
      lineColor: '#000000',
      margin: 10,
      displayValue: true,
      xmlDocument: document,
    })

    const serializer = new XMLSerializer()
    return serializer.serializeToString(svgElement)
  } catch (error) {
    console.error('Error generating barcode SVG:', error)
    throw new Error('Failed to generate barcode SVG')
  }
}

/**
 * Convert SVG string to data URL
 */
export function svgToDataURL(svgString: string): string {
  const encoded = encodeURIComponent(svgString)
  return `data:image/svg+xml;charset=utf-8,${encoded}`
}

/**
 * Generate a random UPC-A barcode for testing
 */
export function generateRandomUPCA(): string {
  // Generate 11 random digits
  let elevenDigits = ''
  for (let i = 0; i < 11; i++) {
    elevenDigits += Math.floor(Math.random() * 10).toString()
  }

  // Calculate and append check digit
  const checkDigit = calculateUPCACheckDigit(elevenDigits)
  return elevenDigits + checkDigit
}

/**
 * Format barcode for display (with spaces)
 */
export function formatBarcodeDisplay(barcode: string): string {
  if (barcode.length !== 12) return barcode

  // Format as: X XXXXX XXXXX X
  return `${barcode[0]} ${barcode.slice(1, 6)} ${barcode.slice(6, 11)} ${barcode[11]}`
}

/**
 * Parse barcode from various formats
 */
export function parseBarcode(input: string): string {
  // Remove all non-digit characters
  return input.replace(/\D/g, '')
}
