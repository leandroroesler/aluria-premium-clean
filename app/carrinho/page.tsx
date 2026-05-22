"use client"

import {
  useEffect,
  useState,
} from "react"

import { useRouter } from "next/navigation"

import { useCart } from "../../context/CartContext"
import { useCheckout } from "../../context/CheckoutContext"

export default function Carrinho() {

  const router = useRouter()

  const {
    cart,
    subtotal,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart()

  const {
    clearCheckoutData,
  } = useCheckout()

  const [
    checkingPayment,
    setCheckingPayment,
  ] = useState(false)

  /*
  =====================================
  VALIDAÇÃO PAGAMENTO
  =====================================
  */

  useEffect(() => {

    const storedOrderId =
      localStorage.getItem(
        "aluria-order-id"
      )

    if (!storedOrderId) return

    /*
    =====================================
    QUERY PARAMS MP
    =====================================
    */

    const params =
      new URLSearchParams(
        window.location.search
      )

    const paymentId =
      params.get("payment_id")

    const collectionId =
      params.get("collection_id")

    const paymentStatus =
      params.get("status")

    /*
    =====================================
    SEM RETORNO REAL MP
    =====================================
    */

    if (
      !paymentId &&
      !collectionId
    ) {

      return

    }

    /*
    =====================================
    STATUS INVÁLIDO
    =====================================
    */

    if (
      paymentStatus !== "approved" &&
      paymentStatus !== "pending"
    ) {

      console.log(
        "Pagamento cancelado ou abandonado"
      )

      return

    }

    setCheckingPayment(true)

    let isRedirecting = false

    /*
    =====================================
    TIMEOUT SEGURANÇA
    =====================================
    */

    const timeout = setTimeout(() => {

      console.log(
        "Timeout validação pagamento"
      )

      setCheckingPayment(false)

    }, 15000)

    const interval = setInterval(
      async () => {

        try {

          const response =
            await fetch(
              `/api/order-status?order_id=${storedOrderId}`,
              {
                cache:
                  "no-store",
              }
            )

          /*
          =====================================
          PAGAMENTO NÃO APROVADO
          =====================================
          */

          if (!response.ok) {

            console.log(
              "Pagamento não aprovado"
            )

            clearInterval(interval)

            clearTimeout(timeout)

            setCheckingPayment(false)

            return

          }

          const data =
            await response.json()

          console.log(
            "STATUS PEDIDO CARRINHO:",
            data
          )

          /*
          =====================================
          PAGAMENTO APROVADO
          =====================================
          */

          if (
            data?.order?.status ===
              "approved" &&
            !isRedirecting
          ) {

            isRedirecting = true

            clearInterval(interval)

            clearTimeout(timeout)

            clearCart()

            clearCheckoutData()

            localStorage.removeItem(
              "aluria-order-id"
            )

            localStorage.removeItem(
              "aluria-cart"
            )

            localStorage.removeItem(
              "aluria-checkout"
            )

            setTimeout(() => {

              router.push(
                `/sucesso?external_reference=${storedOrderId}`
              )

            }, 300)

          }

        } catch (error) {

          console.log(
            "Erro polling carrinho:",
            error
          )

          clearInterval(interval)

          clearTimeout(timeout)

          setCheckingPayment(false)

        }

      },
      1000
    )

    return () => {

      clearInterval(interval)

      clearTimeout(timeout)

    }

  }, [
    clearCart,
    clearCheckoutData,
    router,
  ])

  /*
  =====================================
  TELA CONFIRMAÇÃO
  =====================================
  */

  if (checkingPayment) {

    return (

      <main className="min-h-screen bg-[#f5efe8] flex items-center justify-center px-6">

        <div className="bg-white rounded-[40px] p-14 max-w-xl w-full text-center shadow-sm">

          <div className="w-20 h-20 mx-auto mb-8 border-4 border-[#d6c8ba] border-t-[#2d2218] rounded-full animate-spin" />

          <h1 className="text-4xl font-bold mb-6 text-[#2d2218]">

            Confirmando seu pagamento

          </h1>

          <p className="text-[#6b5a4d] text-lg leading-relaxed">

            Seu pagamento está sendo validado com segurança.

          </p>

          <p className="text-[#8a7d70] text-sm mt-8 uppercase tracking-[0.2em]">

            Aguarde alguns segundos...

          </p>

        </div>

      </main>

    )

  }

  return (

    <main className="min-h-screen bg-[#f5efe8] text-[#2d2218] px-6 md:px-12 py-12">

      <div className="max-w-7xl mx-auto">

        {/* TOPO */}
        <div className="flex items-center justify-between mb-12">

          <h1 className="text-4xl md:text-5xl font-bold">
            Seu Carrinho
          </h1>

          <a
            href="/"
            className="uppercase tracking-[0.2em] text-sm hover:opacity-70 transition"
          >
            Continuar Comprando
          </a>

        </div>

        {
          cart.length === 0 ? (

            <div className="bg-white rounded-[30px] p-16 text-center">

              <h2 className="text-3xl font-bold mb-6">
                Seu carrinho está vazio
              </h2>

              <p className="text-[#6b5a4d] mb-10">
                Adicione produtos premium para continuar.
              </p>

              <a
                href="/"
                className="bg-[#2d2218] text-white px-8 py-4 rounded-full uppercase tracking-[0.2em]"
              >
                Explorar Coleção
              </a>

            </div>

          ) : (

            <div className="grid lg:grid-cols-[1fr_400px] gap-10">

              {/* PRODUTOS */}
              <div className="space-y-6">

                {
                  cart.map(item => (

                    <div
                      key={item.id}
                      className="bg-white rounded-[30px] p-6 flex flex-col md:flex-row gap-6"
                    >

                      <img
                        src={item.image}
                        className="w-full md:w-[220px] h-[220px] object-cover rounded-[20px]"
                      />

                      <div className="flex-1 flex flex-col justify-between">

                        <div>

                          <h2 className="text-3xl font-bold mb-4">
                            {item.title}
                          </h2>

                          <p className="text-[#6b5a4d] text-lg">
                            R$ {item.price.toFixed(2)}
                          </p>

                        </div>

                        <div className="flex items-center justify-between mt-8">

                          <div className="flex items-center gap-4">

                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              className="w-10 h-10 rounded-full border border-[#2d2218]"
                            >
                              -
                            </button>

                            <span className="text-xl font-bold">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => increaseQuantity(item.id)}
                              className="w-10 h-10 rounded-full border border-[#2d2218]"
                            >
                              +
                            </button>

                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 uppercase tracking-[0.2em] text-sm"
                          >
                            Remover
                          </button>

                        </div>

                      </div>

                    </div>

                  ))
                }

              </div>

              <div className="bg-white rounded-[30px] p-8 h-fit sticky top-10">

                <h2 className="text-3xl font-bold mb-10">
                  Resumo
                </h2>

                <div className="space-y-6 text-lg">

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      R$ {subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Frete</span>
                    <span>Grátis</span>
                  </div>

                  <div className="border-t pt-6 flex justify-between text-2xl font-bold">
                    <span>Total</span>
                    <span>
                      R$ {subtotal.toFixed(2)}
                    </span>
                  </div>

                </div>

                <button
                  onClick={() =>
                    window.location.href = "/checkout"
                  }
                  className="w-full mt-10 bg-[#2d2218] text-white py-5 rounded-full uppercase tracking-[0.2em] hover:opacity-90 transition"
                >

                  Continuar Checkout

                </button>

              </div>

            </div>

          )
        }

      </div>

    </main>

  )

}