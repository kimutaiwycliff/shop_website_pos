import 'server-only'
import JsBarcode from 'jsbarcode'
import { generateUPCAFromSKU, validateUPCA } from './barcodeUtils'

// Dynamic import for canvas to avoid client-side bundling
async function getCanvas() {
  try {
    const { createCanvas } = await import('canvas')
    return createCanvas
  } catch (error) {
    console.warn('Canvas package not available:', error)
    return null
  }
}

/**
 * Generate barcode image on server using node-canvas
 * This function can only be used on the server side
 */
export async function generateBarcodeImageServer(
  barcode: string,
  options?: {
    width?: number
    height?: number
    fontSize?: number
    textMargin?: number
  },
): Promise<Buffer | null> {
  const { width = 2, height = 100, fontSize = 20, textMargin = 2 } = options || {}

  try {
    // Dynamic import of canvas for server-only usage
    const createCanvas = await getCanvas()

    // If canvas is not available, return null instead of throwing
    if (!createCanvas) {
      console.warn('Canvas package not available, skipping barcode generation')
      return null
    }

    const canvas = createCanvas(400, 200)

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

    return canvas.toBuffer('image/png')
  } catch (error) {
    console.error('Error generating barcode on server:', error)
    console.warn('Barcode generation failed, continuing without barcode image')
    return null
  }
}

/**
 * Create media document for barcode image
 * This function can only be used on the server side
 */
export async function createBarcodeMedia(
  payload: any,
  sku: string,
  productTitle: string,
): Promise<string | null> {
  try {
    // Generate UPC-A barcode from SKU
    const barcode = generateUPCAFromSKU(sku)

    // Validate the generated barcode
    if (!validateUPCA(barcode)) {
      console.error('Generated barcode is invalid:', barcode)
      return null
    }

    // Generate barcode image
    const imageBuffer = await generateBarcodeImageServer(barcode)

    // If barcode generation failed (canvas not available), continue without barcode image
    if (!imageBuffer) {
      console.warn('Skipping barcode image creation due to missing canvas dependency')
      return null
    }

    // Create a filename
    const filename = `barcode-${sku.replace(/[^a-zA-Z0-9]/g, '-')}-${barcode}.png`

    // Create media document
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: `Barcode for ${productTitle} (${barcode})`,
        filename,
      },
      file: {
        buffer: imageBuffer,
        name: filename,
        size: imageBuffer.length,
        type: 'image/png',
      },
    })

    return media.id
  } catch (error) {
    console.error('Error creating barcode media:', error)
    console.warn('Continuing without barcode media creation')
    return null
  }
}

export { generateUPCAFromSKU, validateUPCA }
