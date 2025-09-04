import type { Order } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type TransactionArgs = {
  orders: Order[]
}

export const luxeTransactions: (args: TransactionArgs) => any[] = ({ orders }) => {
  // Add validation to ensure all required references exist
  if (!orders) {
    throw new Error('Missing required dependencies for transactions seed')
  }
  
  // Helper function to safely get order ID
  const getOrderId = (orderNumber: string) => {
    const order = orders.find((o) => o.orderNumber === orderNumber)
    if (!order) {
      console.warn(`Order not found for transaction: ${orderNumber}`)
      return null
    }
    return order.id
  }
  
  const transactions = [
    {
      transactionId: 'txn_luxury_001_2024',
      orderId: getOrderId('LUX-2024-001'),
      type: 'sale',
      amount: 61875,
      currency: 'KES',
      paymentMethod: 'credit_card',
      paymentProvider: 'Stripe',
      status: 'completed',
      gatewayResponse: {
        transactionId: 'pi_3NvQrX2eZvKYlo2C1KKKq4bz',
        status: 'succeeded',
        chargeId: 'ch_3NvQrX2eZvKYlo2C1KKKq4bz',
        receiptUrl: 'https://pay.stripe.com/receipts/payment/...',
      },
      customerEmail: 'amara.kimani@email.com',
      description: 'Purchase of Ethereal Silk Blazer, Aria Cashmere Cardigan',
      fees: {
        processingFee: 1856,
        platformFee: 0,
        totalFees: 1856,
      },
      netAmount: 60019,
      processedAt: '2024-08-28T14:30:15Z',
      settledAt: '2024-08-29T02:00:00Z',
      refunds: [],
      metadata: {
        customerNote: 'Gift wrapping requested',
        sourceChannel: 'website',
        campaignId: 'summer_2024',
      },
    },
    {
      transactionId: 'MPESA_LUX_002_2024',
      orderId: getOrderId('LUX-2024-002'),
      type: 'sale',
      amount: 59335,
      currency: 'KES',
      paymentMethod: 'mpesa',
      paymentProvider: 'Safaricom',
      status: 'completed',
      gatewayResponse: {
        MerchantRequestID: 'MPESA_REQ_2024_002',
        CheckoutRequestID: 'ws_CO_28082024101512345',
        ResponseCode: '0',
        ResponseDescription: 'Success',
        CustomerMessage: 'The service request is processed successfully',
      },
      customerEmail: 'zara.ochieng@gmail.com',
      description: 'Purchase of Midnight Rose Maxi Dress, Celestial Sculptural Top',
      fees: {
        processingFee: 890,
        platformFee: 0,
        totalFees: 890,
      },
      netAmount: 58445,
      processedAt: '2024-09-01T10:15:30Z',
      settledAt: '2024-09-01T10:16:00Z',
      refunds: [],
      metadata: {
        customerNote: 'For photoshoot',
        sourceChannel: 'mobile_app',
        influencerCode: 'ZARA2024',
      },
    },
    {
      transactionId: 'visa_lux_003_2024',
      orderId: getOrderId('LUX-2024-003'),
      type: 'sale',
      amount: 53750,
      currency: 'KES',
      paymentMethod: 'credit_card',
      paymentProvider: 'Paystack',
      status: 'completed',
      gatewayResponse: {
        reference: 'T_12345678901234567890123456',
        status: 'success',
        transaction: '2157749892',
        message: 'Approved',
        gateway_response: 'Successful',
      },
      customerEmail: 'fatima.hassan@yahoo.com',
      description: 'Purchase of Urban Luxe Leather Jacket',
      fees: {
        processingFee: 1343,
        platformFee: 0,
        totalFees: 1343,
      },
      netAmount: 52407,
      processedAt: '2024-08-15T16:45:22Z',
      settledAt: '2024-08-16T08:00:00Z',
      refunds: [],
      metadata: {
        customerNote: 'High-value purchase',
        sourceChannel: 'website',
        vipCustomer: 'true',
      },
    },
    {
      transactionId: 'BT_LUX_004_2024',
      orderId: getOrderId('LUX-2024-004'),
      type: 'sale',
      amount: 73250,
      currency: 'KES',
      paymentMethod: 'bank_transfer',
      paymentProvider: 'Equity Bank',
      status: 'completed',
      gatewayResponse: {
        referenceNumber: 'EQB2024LUX004TR',
        bankCode: 'EQBLKE',
        accountNumber: '****1234',
        status: 'Credit Confirmed',
      },
      customerEmail: 'grace.wanjiku@corporate.co.ke',
      description: 'Purchase of Noir Minimalist Trousers (x2), Aria Cashmere Cardigan',
      fees: {
        processingFee: 200,
        platformFee: 0,
        totalFees: 200,
      },
      netAmount: 73050,
      processedAt: '2024-08-30T09:20:45Z',
      settledAt: '2024-08-30T15:30:00Z',
      refunds: [],
      metadata: {
        customerNote: 'Professional wardrobe building',
        sourceChannel: 'website',
        corporateDiscount: '5%',
      },
    },
    {
      transactionId: 'amex_lux_005_2024',
      orderId: getOrderId('LUX-2024-005'),
      type: 'sale',
      amount: 56010,
      currency: 'KES',
      paymentMethod: 'credit_card',
      paymentProvider: 'Stripe',
      status: 'completed',
      gatewayResponse: {
        transactionId: 'pi_3NvRsY2eZvKYlo2C1LLLr5ca',
        status: 'succeeded',
        chargeId: 'ch_3NvRsY2eZvKYlo2C1LLLr5ca',
        receiptUrl: 'https://pay.stripe.com/receipts/payment/...',
      },
      customerEmail: 'priya.patel@business.com',
      description: 'Purchase of Ethereal Silk Blazer, Midnight Rose Maxi Dress',
      fees: {
        processingFee: 1681,
        platformFee: 0,
        totalFees: 1681,
      },
      netAmount: 54329,
      processedAt: '2024-09-02T13:10:18Z',
      settledAt: '2024-09-03T02:00:00Z',
      refunds: [],
      metadata: {
        customerNote: 'VIP customer - complimentary gift included',
        sourceChannel: 'website',
        loyaltyPointsEarned: '2800',
      },
    },
    {
      transactionId: 'mc_lux_006_2024',
      orderId: getOrderId('LUX-2024-006'),
      type: 'sale',
      amount: 90550,
      currency: 'KES',
      paymentMethod: 'credit_card',
      paymentProvider: 'Paystack',
      status: 'completed',
      gatewayResponse: {
        reference: 'T_98765432109876543210987654',
        status: 'success',
        transaction: '2157849893',
        message: 'Approved',
        gateway_response: 'Successful',
      },
      customerEmail: 'aisha.mwangi@creative.co.ke',
      description: 'Purchase of Celestial Sculptural Top, Urban Luxe Leather Jacket',
      fees: {
        processingFee: 2266,
        platformFee: 0,
        totalFees: 2266,
      },
      netAmount: 88284,
      processedAt: '2024-08-25T11:30:35Z',
      settledAt: '2024-08-26T08:00:00Z',
      refunds: [],
      metadata: {
        customerNote: 'Sustainable packaging requested',
        sourceChannel: 'website',
        artCustomer: 'true',
      },
    },
    // Refund transaction example
    {
      transactionId: 'ref_lux_001_2024',
      orderId: getOrderId('LUX-2024-001'),
      type: 'refund',
      amount: -5000,
      currency: 'KES',
      paymentMethod: 'credit_card',
      paymentProvider: 'Stripe',
      status: 'completed',
      originalTransactionId: 'txn_luxury_001_2024',
      gatewayResponse: {
        refundId: 're_3NvQrX2eZvKYlo2C1MMMs6dz',
        status: 'succeeded',
        reason: 'requested_by_customer',
      },
      customerEmail: 'amara.kimani@email.com',
      description: 'Partial refund for damaged packaging',
      fees: {
        processingFee: 0,
        platformFee: 0,
        totalFees: 0,
      },
      netAmount: -5000,
      processedAt: '2024-08-31T10:15:00Z',
      settledAt: '2024-08-31T10:15:30Z',
      refunds: [],
      metadata: {
        refundReason: 'Damaged packaging upon delivery',
        customerService: 'Goodwill gesture',
        approvedBy: 'manager@luxeboutique.co.ke',
      },
    },
  ]
  
  // Filter out transactions with null order references
  return transactions.filter(transaction => {
    if (transaction.orderId === null) {
      console.warn(`Transaction ${transaction.transactionId} has invalid order reference`)
      return false
    }
    return true
  })
}
