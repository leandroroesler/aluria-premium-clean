"use client"

import Link from "next/link"

import {
  useEffect,
} from "react"

import {
  useCart,
} from "@/context/CartContext"

import {
  useCheckout,
} from "@/context/CheckoutContext"

export default function Sucesso() {

  const {
    clearCart,
  } = useCart()

  const {
    clearCheckoutData,
  } = useCheckout()

  useEffect(() => {

    console.log(
      "Limpando carrinho..."
    )

    clearCart()

    console.log(
      "Limpando checkout..."
    )

    clearCheckoutData()

    localStorage.removeItem(
      "aluria-cart"
    )

    localStorage.removeItem(
      "aluria-checkout"
    )

  }, [])

  return (

    <main className="min-h-screen bg-[#f5efe8] text-[#2d2218] px-6 py-12 flex items-center justify-center">

      <div className="bg-white rounded-[32px] max-w-2xl w-full p-12 text-center shadow-sm">

        <div className="w-24 h-24 rounded-full bg-[#2d2218] text-white flex items-center justify-center text-5xl mx-auto mb-10">

          ✓

        </div>

        <h1 className="text-5xl font-bold mb-6">

          Pedido Confirmado

        </h1>

        <p className="text-xl leading-relaxed text-[#5c5147] mb-10">

          Seu pagamento foi aprovado com sucesso.

          <br />
          <br />

          Recebemos seu pedido e em breve iniciaremos a preparação da sua experiência Alúria Premium.

        </p>

        <div className="bg-[#f9f6f2] rounded-[24px] p-8 mb-10 text-left">

          <h2 className="text-2xl font-bold mb-5">

            Próximos passos

          </h2>

          <ul className="space-y-4 text-lg text-[#5c5147]">

            <li>
              • Pedido em separação
            </li>

            <li>
              • Conferência do pagamento
            </li>

            <li>
              • Preparação do envio
            </li>

            <li>
              • Atualização por email e WhatsApp
            </li>

          </ul>

        </div>

        <Link
          href="/"
          className="inline-block bg-[#2d2218] text-white px-10 py-5 rounded-full uppercase tracking-[0.2em] hover:opacity-90 transition"
        >

          Voltar à loja

        </Link>

      </div>

    </main>

  )

}