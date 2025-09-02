# Luxe - Advanced E-commerce & Mapping Platform

A comprehensive e-commerce and geospatial platform built with Payload CMS, Next.js, and modern web technologies. This platform combines enterprise-grade e-commerce functionality with advanced mapping capabilities, perfect for businesses that need both online retail and location-based services.

This platform is right for you if you are working on:

- **E-commerce businesses** with physical locations or delivery services
- **Retail stores** needing both online and POS (Point of Sale) functionality
- **Location-based services** requiring geospatial data analysis
- **Multi-channel businesses** with online, in-store, and mobile sales
- **Data-driven retail** with advanced analytics and inventory management

## 🚀 Core Features

### E-commerce & POS
- [Comprehensive Product Management](#e-commerce-collections)
- [Multi-channel Sales (Online & POS)](#pos-functionality)
- [Advanced Inventory Management](#inventory-system)
- [Customer Management & Analytics](#customer-management)
- [Order Processing & Fulfillment](#order-management)
- [Shopping Cart & Checkout](#shopping-experience)
- [Payment Processing Integration](#payments)
- [Sales Analytics Dashboard](#analytics)

### Geospatial & Mapping
- [Interactive Maps with MapLibre GL](#mapping-capabilities)
- [Advanced Geospatial Analysis](#geospatial-analysis)
- [Shapefile & GeoJSON Support](#file-formats)
- [Feature Labeling & Clustering](#map-features)
- [Location-based Services](#location-services)

### Content Management
- [Page Builder with E-commerce Blocks](#layout-builder)
- [SEO Optimization](#seo)
- [Multi-language Support](#internationalization)
- [Draft Preview & Live Preview](#preview-system)
- [Asset Management](#media-management)

## Quick Start

To spin up this example locally, follow these steps:

### Clone

If you have not done so already, you need to have standalone copy of this repo on your machine. If you've already cloned this repo, skip to [Development](#development).

#### Method 1 (recommended)

Clone this repository directly:

```bash
git clone https://github.com/yourusername/luxe-ecommerce.git
cd luxe-ecommerce
```

#### Method 2

Use the `create-payload-app` CLI and customize:

```bash
pnpx create-payload-app my-project -t website
# Then add the e-commerce and mapping functionality
```

### Development

1. First [clone the repo](#clone) if you have not done so already
1. `cd luxe-ecommerce && cp .env.example .env` to copy the example environment variables
1. Configure your environment variables (database, payments, etc.)
1. `pnpm install && pnpm dev` to install dependencies and start the dev server
1. Open `http://localhost:3000` to open the app in your browser
1. Create your first admin user and explore the e-commerce features

That's it! Changes made in `./src` will be reflected in your app. The platform includes sample data for products, categories, and map components. Follow the on-screen instructions to set up your store and configure payment methods.

## 🏗️ Platform Architecture

The platform is built with a modern, scalable architecture designed for e-commerce and geospatial applications:

### Tech Stack
- **Frontend**: Next.js 15.4.4 with React 19.1.0 and App Router
- **Backend**: Payload CMS 3.54.0 with TypeScript 5.7.3
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: TailwindCSS with shadcn/ui components
- **Mapping**: MapLibre GL JS with Turf.js for geospatial analysis
- **File Processing**: Support for shapefiles (.shp.zip) and GeoJSON

### E-commerce Collections

The platform includes comprehensive collections for full e-commerce functionality:

#### Core Collections
- **Products**: Complete product management with variants, pricing, inventory tracking
- **Categories**: Hierarchical product categorization with SEO optimization
- **Brands**: Brand management with logos, descriptions, and associated products
- **Orders**: Full order lifecycle management with status tracking
- **Customers**: Customer profiles with purchase history and preferences
- **Cart**: Persistent shopping cart functionality across sessions
- **Inventory**: Real-time stock management with low-stock alerts
- **Transactions**: Payment processing and financial record keeping

#### Enhanced Features
- **Product Variants**: Size, color, and custom attribute variations
- **Pricing Rules**: Bulk discounts, promotional pricing, customer-specific rates
- **Stock Management**: Multi-location inventory with automatic reorder points
- **Order Fulfillment**: Shipping integration and tracking capabilities

### Mapping & Geospatial Collections

#### Map Block Component
- **MapLibre GL Integration**: High-performance vector map rendering
- **File Upload Support**: Native shapefile (.shp.zip) and GeoJSON parsing
- **Geospatial Analysis**: Powered by Turf.js for advanced calculations
  - Area and length measurements
  - Point clustering and density analysis
  - Buffer creation and spatial relationships
  - Feature labeling based on properties
- **Interactive Controls**: Zoom, layer toggles, style switching
- **Responsive Design**: Mobile-optimized with dark mode support

### Content Collections

#### Users (Authentication & Authorization)
- **Multi-role Support**: Admin, Manager, Staff, and Customer roles
- **Access Control**: Role-based permissions for different platform areas
- **Customer Accounts**: Self-service account management and order history

#### Pages & Content
- **Dynamic Pages**: Layout builder with e-commerce and mapping blocks
- **Blog/News**: Content marketing with SEO optimization
- **Product Pages**: Rich product detail pages with media galleries
- **Landing Pages**: Marketing pages with conversion tracking

#### Media Management
- **Asset Organization**: Hierarchical folder structure for media
- **Image Optimization**: Automatic resizing and format conversion
- **Product Media**: Support for multiple product images, videos, and 3D models
- **Document Storage**: PDFs, specifications, and downloadable content

### Global Configuration

See the [Globals](https://payloadcms.com/docs/configuration/globals) docs for details on how to extend this functionality.

- **Header**: Navigation configuration with mega-menu support for product categories
- **Footer**: Site footer with store information, policies, and social links
- **Store Settings**: Global e-commerce configuration (currency, tax rates, shipping)
- **Payment Settings**: Payment gateway configuration and processing rules
- **SEO Settings**: Default meta tags, structured data, and analytics integration

## 🛠️ E-commerce Features

### POS Functionality
- **In-store Sales**: Complete point-of-sale interface for physical locations
- **Barcode Scanning**: Product lookup and inventory management
- **Payment Processing**: Multiple payment methods (cash, card, digital wallets)
- **Receipt Generation**: Digital and printable receipts
- **Staff Management**: Employee access control and sales tracking

### Shopping Experience
- **Product Catalog**: Advanced filtering, search, and categorization
- **Shopping Cart**: Persistent cart with saved items and quick checkout
- **Checkout Process**: Streamlined multi-step checkout with guest options
- **Customer Accounts**: Order history, wishlists, and account management
- **Mobile Optimization**: Progressive Web App (PWA) capabilities

### Inventory System
- **Real-time Tracking**: Live inventory updates across all channels
- **Multi-location Support**: Manage stock across multiple warehouses/stores
- **Automatic Reordering**: Smart restocking based on sales velocity
- **Low Stock Alerts**: Automated notifications for inventory management
- **Supplier Management**: Vendor information and purchase order tracking

### Analytics & Reporting
- **Sales Dashboards**: Real-time sales metrics and KPI tracking
- **Customer Analytics**: Behavior analysis and segmentation
- **Inventory Reports**: Stock levels, turnover rates, and demand forecasting
- **Financial Reporting**: Revenue tracking, profit margins, and tax reporting
- **Performance Metrics**: Conversion rates, average order value, customer lifetime value

## 🗺️ Mapping & Geospatial Features

### Mapping Capabilities
- **Interactive Maps**: Powered by MapLibre GL JS for smooth, responsive mapping
- **Multiple Map Styles**: Support for various base map styles and custom themes
- **Layer Management**: Toggle between different data layers and visualizations
- **Real-time Updates**: Dynamic data loading and map updates

### Geospatial Analysis
- **Turf.js Integration**: Advanced spatial analysis and geometric calculations
- **Area Calculations**: Precise area measurements for polygons and regions
- **Distance Measurements**: Point-to-point and route distance calculations
- **Buffer Analysis**: Create buffers around points, lines, and polygons
- **Clustering**: Automatic point clustering for better data visualization
- **Spatial Relationships**: Intersection, containment, and proximity analysis

### File Format Support
- **Shapefile Support**: Upload and parse .shp.zip files with all components
- **GeoJSON**: Native support for GeoJSON format with validation
- **Client-side Processing**: Fast, secure file processing without server uploads
- **Data Validation**: Automatic geometry and attribute validation

### Map Features
- **Feature Labeling**: Dynamic labeling based on feature properties
- **Custom Styling**: Style features based on attributes and data values
- **Interactive Popups**: Rich popups with feature information and actions
- **Drawing Tools**: Create and edit geographic features directly on the map
- **Export Capabilities**: Export maps and data in various formats

## 🏪 Layout Builder & Page Components

Create unique page layouts using our comprehensive block system:

### E-commerce Blocks
- **Product Grid**: Responsive product listings with filtering and sorting
- **Product Card**: Individual product showcase with quick actions
- **Shopping Cart**: Full-featured cart with quantity updates and totals
- **Checkout**: Secure, multi-step checkout process
- **Category Showcase**: Featured category displays with navigation
- **Brand Spotlight**: Brand-focused content blocks
- **Customer Reviews**: Product review and rating system
- **Related Products**: Intelligent product recommendations

### Content Blocks
- **Hero Sections**: Eye-catching headers with call-to-action buttons
- **Content Blocks**: Rich text with embedded media and products
- **Media Galleries**: Image and video galleries with lightbox functionality
- **Call to Action**: Conversion-focused sections with tracking
- **Testimonials**: Customer testimonial carousels and grids
- **FAQ Sections**: Expandable question and answer blocks

### Mapping Blocks
- **Map Block**: Full-featured interactive maps with data visualization
- **Location Finder**: Store locator with distance calculation
- **Service Areas**: Geographic service boundary visualization
- **Delivery Zones**: Shipping area maps with pricing information

## 🔍 Advanced Features

### Access Control & Security
- **Role-based Access**: Granular permissions for different user types
- **Customer Authentication**: Secure customer accounts with password reset
- **Admin Security**: Multi-factor authentication for admin users
- **Data Protection**: GDPR compliance and privacy controls
- **Payment Security**: PCI-compliant payment processing

### Content Management
- **Rich Text Editor**: Lexical editor with e-commerce and mapping integrations
- **SEO Optimization**: Built-in SEO tools with structured data
- **Multi-language**: Internationalization support for global markets
- **Draft System**: Preview changes before publishing
- **Version Control**: Content versioning and rollback capabilities

### Performance & Scalability
- **Edge Caching**: CDN integration for fast global delivery
- **Image Optimization**: Automatic image compression and WebP conversion
- **Database Optimization**: Efficient queries and indexing
- **API Rate Limiting**: Protection against abuse and overload
- **Background Jobs**: Asynchronous processing for heavy operations

## 📊 Preview & Publishing System

### Draft Preview
All products, pages, and content support draft previews:
- **Version Control**: Save drafts without affecting live content
- **Preview URLs**: Secure preview links for stakeholder review
- **Mobile Preview**: Test content across different device sizes
- **A/B Testing**: Compare different versions before publishing

### Live Preview
- **Real-time Editing**: See changes instantly as you edit
- **WYSIWYG Experience**: True what-you-see-is-what-you-get editing
- **Device Simulation**: Preview on mobile, tablet, and desktop
- **Interactive Testing**: Test functionality in preview mode

### Content Scheduling
- **Scheduled Publishing**: Set future publish dates for content and products
- **Seasonal Campaigns**: Automate holiday and promotional content
- **Product Launches**: Coordinate multi-channel product releases
- **Content Workflows**: Approval processes for content publishing

## 🚀 Platform Capabilities

### Automatic Revalidation
Smart content delivery with automatic cache invalidation:
- **Product Updates**: Instant cache clearing when products change
- **Inventory Sync**: Real-time stock level updates across all channels
- **Price Changes**: Immediate price updates across the platform
- **Content Changes**: Automatic page regeneration for content updates

### SEO & Marketing
- **Advanced SEO**: Meta tags, structured data, and XML sitemaps
- **Social Media**: Open Graph and Twitter Card integration
- **Analytics**: Google Analytics, Facebook Pixel, and custom tracking
- **Email Marketing**: Newsletter integration and automated campaigns
- **Affiliate Tracking**: Built-in affiliate and referral systems

### Search & Navigation
- **Intelligent Search**: Full-text search with filters and faceting
- **Autocomplete**: Smart search suggestions and typo tolerance
- **Category Navigation**: Hierarchical browsing with breadcrumbs
- **Voice Search**: Voice-activated product search capabilities
- **Visual Search**: Image-based product discovery

### Integrations
- **Payment Gateways**: Stripe, PayPal, Square, and more
- **Shipping Providers**: FedEx, UPS, DHL integration
- **Accounting Software**: QuickBooks, Xero synchronization
- **Marketing Tools**: Mailchimp, Klaviyo, HubSpot connectivity
- **Social Commerce**: Instagram, Facebook Shop integration

## 🌐 Frontend Application

A modern, high-performance e-commerce frontend built with cutting-edge technologies:

### Technology Stack
- **Framework**: Next.js 15.4.4 with App Router
- **UI Library**: React 19.1.0 with TypeScript 5.7.3
- **Styling**: TailwindCSS with shadcn/ui components
- **Mapping**: MapLibre GL JS with Turf.js for geospatial analysis
- **Forms**: React Hook Form with validation
- **State Management**: Zustand for client-side state
- **Authentication**: NextAuth.js integration

### Frontend Features
- **E-commerce Interface**: Complete shopping experience from browse to checkout
- **POS Interface**: Touch-optimized point-of-sale for in-store operations
- **Admin Dashboard**: Comprehensive business management interface
- **Analytics Dashboards**: Real-time sales and performance metrics
- **Mapping Interface**: Interactive maps with geospatial analysis tools
- **Mobile Optimization**: Progressive Web App (PWA) capabilities
- **Dark Mode**: System-aware dark/light theme switching
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Core Web Vitals optimization

### Customer Experience
- **Responsive Design**: Optimized for all device sizes
- **Fast Loading**: Optimized images and lazy loading
- **Offline Support**: Service worker for offline browsing
- **Search**: Intelligent product search with filters
- **Wishlist**: Save favorite products across sessions
- **Recently Viewed**: Track and display browsing history
- **Social Login**: Sign in with Google, Facebook, Apple

### Admin Experience
- **Intuitive Interface**: Clean, modern admin panel
- **Bulk Operations**: Efficient batch editing and updates
- **Import/Export**: CSV and Excel file processing
- **Reporting**: Detailed sales and inventory reports
- **User Management**: Customer and staff account administration

### Performance Optimization

#### Caching Strategy
Optimized for high-traffic e-commerce environments:
- **CDN Integration**: Global content delivery for fast page loads
- **Database Caching**: Redis integration for frequently accessed data
- **Image Optimization**: Next.js Image component with WebP conversion
- **API Caching**: Intelligent caching of product and inventory data
- **Static Generation**: Pre-built pages for better SEO and performance

#### Production Considerations
- **Security**: HTTPS, CSP headers, and input validation
- **Monitoring**: Application performance monitoring and error tracking
- **Scalability**: Horizontal scaling support for high traffic
- **Backup**: Automated database backups and disaster recovery
- **Compliance**: GDPR, PCI DSS, and accessibility standards

## 🚀 Getting Started

To spin up this e-commerce platform locally, follow the [Quick Start](#quick-start) guide above. Then configure your store settings and add your first products.

### Environment Configuration

Create your `.env` file with the following required variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/luxe_ecommerce"

# Authentication
PAYLOAD_SECRET="your-secret-key-here"
NEXTAUTH_SECRET="your-nextauth-secret"

# Payment Processing
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
PAYPAL_CLIENT_ID="your-paypal-client-id"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# Cloud Storage (Optional)
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
S3_BUCKET="your-s3-bucket"

# Analytics (Optional)
GOOGLE_ANALYTICS_ID="GA-XXXXX"
FACEBOOK_PIXEL_ID="your-pixel-id"
```

### Initial Setup

1. **Database Setup**: Run migrations and seed initial data
   ```bash
   pnpm payload migrate
   pnpm payload seed
   ```

2. **Create Admin User**: Set up your first admin account
   ```bash
   pnpm payload create-first-user
   ```

3. **Configure Store**: Access admin panel and configure:
   - Store information and branding
   - Payment gateway settings
   - Shipping zones and rates
   - Tax configuration
   - Email templates

### Database Management

#### Working with PostgreSQL
The platform uses PostgreSQL for reliable, scalable data management:

- **Schema Management**: Automatic migrations for database changes
- **Data Integrity**: Foreign key constraints and validation
- **Performance**: Optimized indexes for fast queries
- **Backup**: Automated daily backups with point-in-time recovery

#### Development vs Production
- **Development**: Use `push: true` for rapid schema iteration
- **Production**: Use migrations for controlled, safe deployments

#### Migration Commands
```bash
# Create a new migration
pnpm payload migrate:create

# Run pending migrations
pnpm payload migrate

# Reset database (development only)
pnpm payload migrate:reset

# Check migration status
pnpm payload migrate:status
```

### Sample Data

The platform includes comprehensive sample data:

```bash
# Seed the database with sample data
pnpm payload seed
```

This creates:
- **Sample Products**: Electronics, clothing, and accessories
- **Product Categories**: Hierarchical category structure
- **Sample Customers**: Test customer accounts
- **Order History**: Example orders and transactions
- **Geographic Data**: Sample store locations and service areas
- **Demo Users**:
  - Admin: `admin@luxe.com` / `password`
  - Manager: `manager@luxe.com` / `password`
  - Customer: `customer@luxe.com` / `password`

> ⚠️ **Warning**: Seeding is destructive and will replace existing data. Only use on development environments or fresh installations.

### Docker Development

Quick setup using Docker for consistent development environments:

```bash
# Clone and setup
git clone https://github.com/yourusername/luxe-ecommerce.git
cd luxe-ecommerce

# Copy environment variables
cp .env.example .env

# Start with Docker
docker-compose up -d

# Initialize database
docker-compose exec app pnpm payload migrate
docker-compose exec app pnpm payload seed
```

This provides:
- **PostgreSQL Database**: Production-like database environment
- **Redis Cache**: For session storage and caching
- **File Storage**: Local volume for media uploads
- **Hot Reload**: Automatic restart on code changes

## 🚀 Production Deployment

### Build Process

```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm payload migrate

# Build the application
pnpm build

# Start production server
pnpm start
```

### Production Checklist

#### Security
- [ ] Configure HTTPS with SSL certificates
- [ ] Set up Content Security Policy (CSP) headers
- [ ] Enable rate limiting and DDoS protection
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Enable audit logging

#### Performance
- [ ] Configure CDN for static assets
- [ ] Set up database connection pooling
- [ ] Enable Redis caching
- [ ] Configure image optimization
- [ ] Set up monitoring and alerting

#### E-commerce Specific
- [ ] Configure payment gateways (production keys)
- [ ] Set up SSL for payment processing
- [ ] Configure shipping providers
- [ ] Set up inventory alerts
- [ ] Configure email templates
- [ ] Test order fulfillment workflow

### Deployment Options

#### Payload Cloud (Recommended)
One-click deployment with managed infrastructure:
- Automatic scaling and load balancing
- Built-in CDN and database backups
- SSL certificates and security monitoring
- Global edge deployment

#### Vercel Deployment
Perfect for Next.js applications:

```bash
# Install Vercel adapter
pnpm add @payloadcms/db-vercel-postgres @payloadcms/storage-vercel-blob
```

```typescript
// payload.config.ts
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

export default buildConfig({
  db: vercelPostgresAdapter({
    pool: { connectionString: process.env.POSTGRES_URL },
  }),
  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
```

#### Self-hosting Options
- **DigitalOcean App Platform**: Managed container deployment
- **AWS EC2 + RDS**: Full control with managed database
- **Google Cloud Run**: Serverless container deployment
- **Traditional VPS**: Ubuntu/CentOS with PM2 process management

#### Infrastructure Requirements
- **CPU**: 2+ cores for production workloads
- **RAM**: 4GB minimum, 8GB+ recommended
- **Storage**: SSD with 50GB+ available space
- **Database**: PostgreSQL 12+ with connection pooling
- **Cache**: Redis for session storage and caching

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
