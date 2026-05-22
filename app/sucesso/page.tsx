"use client"

import Link from "next/link"

import {
  Suspense,
  useEffect,
  useState,
} from "react"

import {
  useRouter,
  useSearchParams,
} from "next/navigation"

import {
  useCart,
} from "@/context/CartContext"

import {
  useCheckout,
} from "@/context/CheckoutContext"

function SuccessContent() {

  const router =
    useRouter()

  const searchParams =
    useSearchParams()

  const orderId =
    searchParams.get(
      "external_reference"
    )

  const {
    clearCart,
  } = useCart()

  const {
    clearCheckoutData,
  } = useCheckout()

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    authorized,
    setAuthorized,
  ] = useState(false)

  useEffect(() => {

    async function validateOrder() {

      try {

        /*
        =====================================
        SEM ORDER ID
        =====================================
        */

        if (!orderId) {

          router.push("/carrinho")

          return

        }

        /*
        =====================================
        VALIDAR PEDIDO
        =====================================
        */

        const response =
          await fetch(
            `/api/order-status?order_id=${orderId}`
          )

        /*
        =====================================
        PAGAMENTO NÃO APROVADO
        =====================================
        */

        if (!response.ok) {

          router.push("/carrinho")

          return

        }

        const data =
          await response.json()

        /*
        =====================================
        VALIDAÇÃO FINAL
        =====================================
        */

        if (
          data?.order
            ?.payment_status !==
          "approved"
        ) {

          router.push("/carrinho")

          return

        }

        /*
        =====================================
        LIMPEZA SEGURA
        =====================================
        */

        clearCart()

        clearCheckoutData()

        localStorage.removeItem(
          "aluria-cart"
        )

        localStorage.removeItem(
          "aluria-checkout"
        )

        setAuthorized(true)

      } catch (error) {

        console.log(
          "ERRO VALIDAR PEDIDO:",
          error
        )

        router.push("/carrinho")

      } finally {

        setLoading(false)

      }

    }

    validateOrder()

  }, [
    orderId,
    router,
    clearCart,
    clearCheckoutData,
  ])

  /*
  =====================================
  LOADING
  =====================================
  */

  if (loading) {

    return (

      <main className="min-h-screen bg-[#f5efe8] flex items-center justify-center">

        <p className="text-[#2d2218] text-lg">

          Validando pagamento...

        </p>

      </main>

    )

  }

  /*
  =====================================
  BLOQUEIO SEGURANÇA
  =====================================
  */

  if (!authorized) {

    return null

  }

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

export default function Sucesso() {

  return (

    <Suspense
      fallback={

        <main className="min-h-screen bg-[#f5efe8] flex items-center justify-center">

          <p className="text-[#2d2218] text-lg">

            Carregando...

          </p>

        </main>

      }
    >

      <SuccessContent />

    </Suspense>

  )

}