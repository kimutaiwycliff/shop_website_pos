import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components'

interface AbandonedCartEmailProps {
  customerName: string
  cartItems: Array<{
    name: string
    price: string
    image?: string
  }>
  cartUrl: string
  discountCode?: string
  discountAmount?: string
}

export const AbandonedCartEmail = ({
  customerName = 'Valued Customer',
  cartItems = [],
  cartUrl = '#',
  discountCode,
  discountAmount = '10%',
}: AbandonedCartEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Don&apos;t forget your items - Complete your purchase now!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src="https://your-domain.com/logo.png"
              width="150"
              height="50"
              alt="Luxe Collections"
              style={logo}
            />
          </Section>

          <Section style={content}>
            <Heading style={h1}>Don&apos;t Miss Out!</Heading>
            <Text style={text}>Hi {customerName},</Text>
            <Text style={text}>
              You left some amazing items in your cart. Don&apos;t let them slip away!
            </Text>

            <Section style={cartItemsStyle}>
              <Heading style={h2}>Your Cart Items</Heading>
              {cartItems.map((item, index) => (
                <Row key={index} style={itemRow}>
                  <Column style={itemImage}>
                    {item.image && <Img src={item.image} width="80" height="80" alt={item.name} />}
                  </Column>
                  <Column style={itemDetails}>
                    <Text style={itemName}>{item.name}</Text>
                    <Text style={itemPrice}>{item.price}</Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {discountCode && (
              <Section style={discountSection}>
                <Text style={discountText}>
                  🎉 Special offer just for you! Use code <strong>{discountCode}</strong> to get{' '}
                  {discountAmount} off your order.
                </Text>
              </Section>
            )}

            <Section style={buttonContainer}>
              <Button style={button} href={cartUrl}>
                Complete Your Purchase
              </Button>
            </Section>

            <Text style={text}>
              This offer won&apos;t last forever. Complete your purchase now and enjoy our premium
              products!
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>© 2024 Luxe Collections. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const header = {
  padding: '20px 30px',
  borderBottom: '1px solid #e6ebf1',
}

const logo = {
  margin: '0 auto',
}

const content = {
  padding: '30px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  margin: '0 0 20px',
}

const h2 = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '600',
  margin: '20px 0 15px',
}

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0 0 16px',
}

const cartItemsStyle = {
  backgroundColor: '#f8fafc',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
}

const itemRow = {
  borderBottom: '1px solid #e2e8f0',
  paddingBottom: '15px',
  marginBottom: '15px',
}

const itemImage = {
  width: '100px',
  verticalAlign: 'top',
}

const itemDetails = {
  paddingLeft: '15px',
  verticalAlign: 'top',
}

const itemName = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1a1a1a',
  margin: '0 0 8px',
}

const itemPrice = {
  fontSize: '14px',
  color: '#f97316',
  fontWeight: '600',
  margin: '0',
}

const discountSection = {
  backgroundColor: '#fef3c7',
  padding: '20px',
  borderRadius: '8px',
  border: '2px solid #f59e0b',
  margin: '20px 0',
  textAlign: 'center' as const,
}

const discountText = {
  fontSize: '16px',
  color: '#92400e',
  margin: '0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
}

const button = {
  backgroundColor: '#f97316',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
}

const footer = {
  borderTop: '1px solid #e6ebf1',
  padding: '20px 30px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  margin: '0',
}

export default AbandonedCartEmail
