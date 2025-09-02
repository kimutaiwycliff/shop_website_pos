import { Block } from 'payload'

export const ShoppingCartBlock: Block = {
  slug: 'shoppingCart',
  labels: {
    singular: 'Shopping Cart',
    plural: 'Shopping Carts',
  },
  interfaceName: 'ShoppingCartBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Cart Title',
      defaultValue: 'Shopping Cart',
      admin: {
        description: 'Title displayed at the top of the cart',
      },
    },
    {
      name: 'showRecommendations',
      type: 'checkbox',
      label: 'Show Recommended Products',
      defaultValue: true,
      admin: {
        description: 'Display recommended products below the cart',
      },
    },
    {
      name: 'enablePromoCode',
      type: 'checkbox',
      label: 'Enable Promo Code',
      defaultValue: true,
      admin: {
        description: 'Allow customers to enter discount codes',
      },
    },
    {
      name: 'enableSaveForLater',
      type: 'checkbox',
      label: 'Enable Save for Later',
      defaultValue: true,
      admin: {
        description: 'Allow customers to move items to wishlist',
      },
    },
    {
      name: 'continueShoppingUrl',
      type: 'text',
      label: 'Continue Shopping URL',
      defaultValue: '/shop',
      admin: {
        description: 'URL for the \"Continue Shopping\" button',
      },
    },
    {
      name: 'checkoutUrl',
      type: 'text',
      label: 'Checkout URL',
      defaultValue: '/checkout',
      admin: {
        description: 'URL for the checkout page',
      },
    },
  ],
}
