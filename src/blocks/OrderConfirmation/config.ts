import { Block } from "payload";

export const OrderConfirmationBlock: Block = {
  slug: 'orderConfirmation',
  labels: {
    singular: 'Order Confirmation',
    plural: 'Order Confirmations',
  },
  interfaceName: 'OrderConfirmationBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Order Confirmation',
    },
  ],
}
