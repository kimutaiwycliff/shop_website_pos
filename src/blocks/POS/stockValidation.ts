// Type definitions for POS items
interface POSProduct {
  id: string;
  title: string;
  price: number;
  sku: string;
  inStock: number;
  // ... other product properties
}

interface POSItem {
  id: string;
  product: POSProduct;
  quantity: number;
  unitPrice: number;
  discount: number;
  lineTotal: number;
}

interface StockValidationResult {
  isValid: boolean;
  message: string | null;
}

/**
 * Validates if a product can be added to the cart based on stock availability
 * @param cart - Current items in the cart
 * @param product - Product to be added
 * @param quantityToAdd - Quantity to add (default: 1)
 * @returns Validation result with isValid flag and message
 */
export const validateStockAvailability = (
  cart: POSItem[],
  product: POSProduct,
  quantityToAdd: number = 1
): StockValidationResult => {
  // Check if product is out of stock
  if (product.inStock <= 0) {
    return {
      isValid: false,
      message: 'This product is out of stock and cannot be added to the cart.'
    };
  }

  // Check if product already exists in cart
  const existingItem = cart.find(item => item.product.id === product.id);
  
  if (existingItem) {
    // Calculate total quantity that would be in cart after adding
    const totalQuantity = existingItem.quantity + quantityToAdd;
    
    // Check if this exceeds available stock
    if (totalQuantity > product.inStock) {
      const availableStock = product.inStock - existingItem.quantity;
      return {
        isValid: false,
        message: `Cannot add more of this product. Only ${availableStock} items in stock.`
      };
    }
  } else {
    // Product not in cart yet, check if quantity to add exceeds stock
    if (quantityToAdd > product.inStock) {
      return {
        isValid: false,
        message: `Cannot add more of this product. Only ${product.inStock} items in stock.`
      };
    }
  }

  // All validations passed
  return {
    isValid: true,
    message: null
  };
};

/**
 * Validates if a quantity update is allowed for an existing cart item
 * @param cart - Current items in the cart
 * @param itemId - ID of the item to update
 * @param newQuantity - New quantity to set
 * @returns Validation result with isValid flag and message
 */
export const validateQuantityUpdate = (
  cart: POSItem[],
  itemId: string,
  newQuantity: number
): StockValidationResult => {
  // Find the item in cart
  const item = cart.find(item => item.id === itemId);
  
  // If item not found, validation fails
  if (!item) {
    return {
      isValid: false,
      message: 'Item not found in cart.'
    };
  }
  
  // Check if new quantity is valid (positive number)
  if (newQuantity <= 0) {
    return {
      isValid: true,
      message: null
    };
  }
  
  // Check if new quantity exceeds available stock
  if (newQuantity > item.product.inStock) {
    return {
      isValid: false,
      message: `Cannot add more of this product. Only ${item.product.inStock} items in stock.`
    };
  }
  
  // All validations passed
  return {
    isValid: true,
    message: null
  };
};