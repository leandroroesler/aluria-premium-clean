import { CheckoutProvider } from "../context/CheckoutContext"
import "./globals.css";
import { CartProvider } from "../context/CartContext"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>

      <CartProvider>

  <CheckoutProvider>
    {children}
  </CheckoutProvider>

</CartProvider>

</body>
    </html>
  )
}