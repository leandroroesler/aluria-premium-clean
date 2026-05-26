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
    order,
    setOrder,
  ] = useState<any>(null)

  const [
    paymentStatus,
    setPaymentStatus,
  ] = useState<string | null>(
    null
  )

  useEffect(() => {

    async function validateOrder() {

      try {

        if (!orderId) {

          router.push("/carrinho")

          return

        }

        const response =
          await fetch(
            `/api/order-status?order_id=${orderId}`
          )

        if (!response.ok) {

          router.push("/carrinho")

          return

        }

        const data =
          await response.json()

        setOrder(data.order)

        setPaymentStatus(
          data?.order
            ?.payment_status || null
        )

        /*
        =====================================
        LIMPEZA APENAS APROVADO
        =====================================
        */

        if (
          data?.order
            ?.payment_status ===
          "approved"
        ) {

          clearCart()

          clearCheckoutData()

        }

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

    /*
    =====================================
    PRIMEIRA VALIDAÇÃO
    =====================================
    */

    validateOrder()

    /*
    =====================================
    POLLING PIX / PENDING
    =====================================
    */

    let interval: NodeJS.Timeout

    if (
      paymentStatus ===
      "pending"
    ) {

      interval = setInterval(() => {

        validateOrder()

      }, 5000)

    }

    /*
    =====================================
    CLEANUP
    =====================================
    */

    return () => {

      if (interval) {

        clearInterval(interval)

      }

    }

  }, [
    orderId,
    router,
    clearCart,
    clearCheckoutData,
    paymentStatus,
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
  PEDIDO INVÁLIDO
  =====================================
  */

  if (!order) {

    return null

  }

  /*
  =====================================
  FORMATAÇÕES
  =====================================
  */

  const formattedTotal =
    Number(
      order.transaction_amount || 0
    ).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    )

  const formattedDate =
    new Date(
      order.created_at
    ).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    )

  /*
  =====================================
  STATUS APROVADO
  =====================================
  */

  if (paymentStatus === "approved") {

    return (

      <main className="min-h-screen bg-[#f5efe8] text-[#2d2218] px-4 md:px-8 py-12">

        <div className="max-w-5xl mx-auto">

          {/* HEADER */}

          <div className="bg-white rounded-[36px] p-10 md:p-14 shadow-sm mb-8">

            <div className="flex flex-col items-center text-center">

              <div className="w-24 h-24 rounded-full bg-[#2d2218] text-white flex items-center justify-center text-5xl mb-8">

                ✓

              </div>

              <p className="uppercase tracking-[0.3em] text-sm text-[#8b7d6f] mb-4">

                Pedido aprovado

              </p>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">

                Obrigado pela sua compra
              </h1>

              <p className="text-lg md:text-xl text-[#5c5147] leading-relaxed max-w-2xl">

                Seu pagamento foi confirmado com sucesso.
                Estamos preparando sua experiência Alúria Premium.

              </p>

            </div>

          </div>

          {/* GRID */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT */}

            <div className="lg:col-span-2 space-y-8">

              {/* RESUMO */}

              <div className="bg-white rounded-[32px] p-8 shadow-sm">

                <h2 className="text-2xl font-bold mb-8">

                  Resumo do pedido

                </h2>

                <div className="space-y-6">

                  <div className="flex justify-between border-b border-[#efe7de] pb-4">

                    <span className="text-[#7b6d60]">
                      Pedido
                    </span>

                    <span className="font-semibold">
                      #{order.order_number}
                    </span>

                  </div>

                  <div className="flex justify-between border-b border-[#efe7de] pb-4">

                    <span className="text-[#7b6d60]">
                      Cliente
                    </span>

                    <span className="font-semibold">
                      {order.customer_name}
                    </span>

                  </div>

                  <div className="flex justify-between border-b border-[#efe7de] pb-4">

                    <span className="text-[#7b6d60]">
                      Data
                    </span>

                    <span className="font-semibold">
                      {formattedDate}
                    </span>

                  </div>

                  <div className="flex justify-between border-b border-[#efe7de] pb-4">

                    <span className="text-[#7b6d60]">
                      Pagamento
                    </span>

                    <span className="font-semibold uppercase">
                      {order.payment_method}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-[#7b6d60]">
                      Total
                    </span>

                    <span className="text-2xl font-bold">
                      {formattedTotal}
                    </span>

                  </div>

                </div>

              </div>

              {/* ITENS */}

              <div className="bg-white rounded-[32px] p-8 shadow-sm">

                <h2 className="text-2xl font-bold mb-8">

                  Itens do pedido

                </h2>

                <div className="space-y-6">

                  {order.items?.map(
                    (
                      item: any,
                      index: number
                    ) => (

                      <div
                        key={index}
                        className="flex items-center justify-between border-b border-[#efe7de] pb-6"
                      >

                        <div>

                          <h3 className="text-lg font-semibold mb-2">

                            {item.title}

                          </h3>

                          <p className="text-[#7b6d60]">

                            Quantidade: {item.quantity}

                          </p>

                        </div>

                        <div className="text-right">

                          <p className="font-bold text-lg">

                            {Number(
                              item.unit_price
                            ).toLocaleString(
                              "pt-BR",
                              {
                                style: "currency",
                                currency: "BRL",
                              }
                            )}

                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div className="space-y-8">

              {/* STATUS */}

              <div className="bg-[#2d2218] text-white rounded-[32px] p-8">

                <p className="uppercase tracking-[0.3em] text-sm opacity-70 mb-4">

                  Status atual

                </p>

                <h3 className="text-3xl font-bold mb-4">

                  Pagamento aprovado

                </h3>

                <p className="leading-relaxed opacity-80">

                  Seu pedido já está em preparação
                  e você receberá atualizações
                  por email e WhatsApp.

                </p>

              </div>

              {/* ETAPAS */}

              <div className="bg-white rounded-[32px] p-8 shadow-sm">

                <h3 className="text-2xl font-bold mb-8">

                  Próximas etapas

                </h3>

                <ul className="space-y-6">

                  <li className="flex gap-4">

                    <span>
                      ✓
                    </span>

                    <span>
                      Pagamento confirmado
                    </span>

                  </li>

                  <li className="flex gap-4">

                    <span>
                      •
                    </span>

                    <span>
                      Separação do pedido
                    </span>

                  </li>

                  <li className="flex gap-4">

                    <span>
                      •
                    </span>

                    <span>
                      Preparação do envio
                    </span>

                  </li>

                  <li className="flex gap-4">

                    <span>
                      •
                    </span>

                    <span>
                      Atualizações de rastreio
                    </span>

                  </li>

                </ul>

              </div>

              {/* CTA */}

              <Link
                href="/"
                className="block w-full bg-[#2d2218] text-white text-center py-5 rounded-full uppercase tracking-[0.2em] hover:opacity-90 transition"
              >

                Voltar à loja

              </Link>

            </div>

          </div>

        </div>

      </main>

    )

  }

  /*
  =====================================
  STATUS PENDING
  =====================================
  */

  if (paymentStatus === "pending") {

    return (

      <main className="min-h-screen bg-[#f5efe8] text-[#2d2218] px-6 py-12 flex items-center justify-center">

        <div className="bg-white rounded-[32px] max-w-2xl w-full p-12 text-center shadow-sm">

          <div className="w-24 h-24 rounded-full bg-[#d6b36a] text-white flex items-center justify-center text-5xl mx-auto mb-10">

            !

          </div>

          <h1 className="text-5xl font-bold mb-6">

            Aguardando pagamento

          </h1>

          <p className="text-xl leading-relaxed text-[#5c5147] mb-10">

            Seu pagamento PIX ainda está em processamento.

            <br />
            <br />

            Esta página será atualizada automaticamente
            assim que o pagamento for confirmado.

          </p>

          <div className="bg-[#f9f6f2] rounded-[24px] p-8 mb-10 text-left">

            <div className="flex justify-between mb-4">

              <span>
                Pedido
              </span>

              <strong>
                #{order.order_number}
              </strong>

            </div>

            <div className="flex justify-between mb-4">

              <span>
                Total
              </span>

              <strong>
                {formattedTotal}
              </strong>

            </div>

            <div className="flex justify-between">

              <span>
                Pagamento
              </span>

              <strong className="uppercase">
                {order.payment_method}
              </strong>

            </div>

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

  /*
  =====================================
  STATUS REJEITADO
  =====================================
  */

  return (

    <main className="min-h-screen bg-[#f5efe8] text-[#2d2218] px-6 py-12 flex items-center justify-center">

      <div className="bg-white rounded-[32px] max-w-2xl w-full p-12 text-center shadow-sm">

        <div className="w-24 h-24 rounded-full bg-red-500 text-white flex items-center justify-center text-5xl mx-auto mb-10">

          ×

        </div>

        <h1 className="text-5xl font-bold mb-6">

          Pagamento não aprovado

        </h1>

        <p className="text-xl leading-relaxed text-[#5c5147] mb-10">

          Não foi possível confirmar seu pagamento.

          <br />
          <br />

          Você pode tentar novamente utilizando outro método de pagamento.

        </p>

        <Link
          href="/checkout"
          className="inline-block bg-[#2d2218] text-white px-10 py-5 rounded-full uppercase tracking-[0.2em] hover:opacity-90 transition"
        >

          Tentar novamente

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