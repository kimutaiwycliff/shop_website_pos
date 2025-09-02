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
} from "@react-email/components"

interface OrderConfirmationEmailProps {
  customerName: string
  orderNumber: string
  orderTotal: string
  orderItems: Array<{
    name: string
    quantity: number
    price: string
    image?: string
  }>
  trackingUrl?: string
}

export const OrderConfirmationEmail = ({
  customerName = "Valued Customer",
  orderNumber = "#12345",
  orderTotal = "KSh 5,000",
  orderItems = [],
  trackingUrl,
}: OrderConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your order {orderNumber} has been confirmed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img src="https://your-domain.com/logo.png" width="150" height="50" alt="Luxe Collections" style={logo} />
          </Section>

          <Section style={content}>
            <Heading style={h1}>Order Confirmation</Heading>
            <Text style={text}>Hi {customerName},</Text>
            <Text style={text}>
              Thank you for your order! We&apos;re excited to confirm that your order {orderNumber} has been received and is
              being processed.
            </Text>

            <Section style={orderSummary}>
              <Heading style={h2}>Order Summary</Heading>
              {orderItems.map((item, index) => (
                <Row key={index} style={itemRow}>
                  <Column style={itemImage}>
                    {item.image && <Img src={item.image} width="60" height="60" alt={item.name} />}
                  </Column>
                  <Column style={itemDetails}>
                    <Text style={itemName}>{item.name}</Text>
                    <Text style={itemQuantity}>Qty: {item.quantity}</Text>
                  </Column>
                  <Column style={itemPrice}>
                    <Text style={price}>{item.price}</Text>
                  </Column>
                </Row>
              ))}

              <Row style={totalRow}>
                <Column>
                  <Text style={totalText}>Total: {orderTotal}</Text>
                </Column>
              </Row>
            </Section>

            {trackingUrl && (
              <Section style={buttonContainer}>
                <Button style={button} href={trackingUrl}>
                  Track Your Order
                </Button>
              </Section>
            )}

            <Text style={text}>
              We&apos;ll send you another email when your order ships. If you have any questions, please contact us at
              support@luxecollections.com
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
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
}

const header = {
  padding: "20px 30px",
  borderBottom: "1px solid #e6ebf1",
}

const logo = {
  margin: "0 auto",
}

const content = {
  padding: "30px",
}

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.25",
  margin: "0 0 20px",
}

const h2 = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "600",
  margin: "20px 0 10px",
}

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 0 16px",
}

const orderSummary = {
  backgroundColor: "#f8fafc",
  padding: "20px",
  borderRadius: "8px",
  margin: "20px 0",
}

const itemRow = {
  borderBottom: "1px solid #e2e8f0",
  paddingBottom: "15px",
  marginBottom: "15px",
}

const itemImage = {
  width: "80px",
  verticalAlign: "top",
}

const itemDetails = {
  paddingLeft: "15px",
  verticalAlign: "top",
}

const itemName = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#1a1a1a",
  margin: "0 0 5px",
}

const itemQuantity = {
  fontSize: "14px",
  color: "#64748b",
  margin: "0",
}

const itemPrice = {
  textAlign: "right" as const,
  verticalAlign: "top",
}

const price = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#1a1a1a",
  margin: "0",
}

const totalRow = {
  borderTop: "2px solid #06b6d4",
  paddingTop: "15px",
  marginTop: "15px",
}

const totalText = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#1a1a1a",
  textAlign: "right" as const,
  margin: "0",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
}

const button = {
  backgroundColor: "#06b6d4",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
}

const footer = {
  borderTop: "1px solid #e6ebf1",
  padding: "20px 30px",
  textAlign: "center" as const,
}

const footerText = {
  color: "#8898aa",
  fontSize: "12px",
  margin: "0",
}

export default OrderConfirmationEmail
