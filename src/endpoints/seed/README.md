# Luxe Boutique Seed Data

This directory contains comprehensive seed data for the Luxe boutique, creating a realistic demo environment for a high-end fashion store.

## Created Seed Files

### 1. **brands-seed.ts**
Contains 6 boutique fashion brands:
- **Aria Elegance** - Contemporary fashion for modern women
- **Midnight Rose** - Romantic feminine clothing line
- **Urban Luxe** - Street-inspired luxury fashion
- **Celestial Couture** - Avant-garde fashion house
- **Serenity Silk** - Luxury silk specialists
- **Noir Atelier** - Minimalist luxury brand

### 2. **categories-seed.ts**
Fashion-appropriate categories:
- Dresses, Outerwear, Tops, Bottoms, Knitwear
- Basics, Accessories, Designer, Avant-garde, Sustainable

### 3. **products-seed.ts**
6 luxury fashion products with complete details:
- **Ethereal Silk Blazer** (Serenity Silk) - KES 28,500
- **Midnight Rose Maxi Dress** (Midnight Rose) - KES 18,900
- **Urban Luxe Leather Jacket** (Urban Luxe) - KES 45,000
- **Celestial Sculptural Top** (Celestial Couture) - KES 32,000
- **Aria Cashmere Cardigan** (Aria Elegance) - KES 24,000
- **Noir Minimalist Trousers** (Noir Atelier) - KES 19,500

Each product includes:
- Multiple color variants with hex codes
- Size options with stock levels
- Detailed descriptions with rich text
- Pricing, shipping info, and SEO metadata

### 4. **customers-seed.ts**
6 realistic customers with:
- Complete personal information
- Multiple addresses (home, work)
- Purchase history and loyalty data
- Shopping preferences and notes

### 5. **orders-seed.ts**
6 realistic orders showing:
- Different order statuses (delivered, shipped, processing, etc.)
- Various payment methods (card, M-Pesa, bank transfer)
- Complete shipping information
- Order totals with tax calculations

### 6. **inventory-seed.ts**
Inventory tracking for all products:
- Current stock levels
- Minimum/maximum stock thresholds
- Warehouse locations
- Stock status indicators

### 7. **transactions-seed.ts**
Financial transaction records:
- Sales transactions with payment details
- Different payment providers (Stripe, Paystack, Safaricom)
- Transaction fees and net amounts
- Sample refund transaction

### 8. **cart-seed.ts**
Active shopping carts showing:
- Customer and guest carts
- Items with selected variants
- Applied coupons and discounts
- Shipping estimates

## Usage

The updated `index.ts` file will seed all collections with this realistic boutique data. All images use the same source image for consistency as requested.

## Key Features

- **Realistic Data**: All data reflects an actual high-end boutique operation
- **Kenyan Market**: Pricing in KES, local phone numbers, Nairobi addresses
- **Complete Relationships**: All collections properly linked with foreign keys
- **Boutique Focus**: Luxury fashion items with appropriate brands and categories
- **Real Commerce Flow**: Orders, payments, inventory, and customer data all interconnected

The seed data creates a comprehensive demo environment perfect for showcasing the e-commerce platform's capabilities in a luxury retail context.