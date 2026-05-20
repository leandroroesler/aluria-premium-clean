"use client"

import {
  useEffect,
  useState,
} from "react"

import { useRouter } from "next/navigation"

import { useCheckout } from "../../context/CheckoutContext"
import { useCart } from "../../context/CartContext"

export default function Checkout() {

  const {
    checkoutData,
    updateCheckoutData,
    clearCheckoutData,
  } = useCheckout()

  const {
    cart,
    subtotal,
    clearCart,
  } = useCart()

  const router = useRouter()

  const [isCheckingPayment, setIsCheckingPayment] =
    useState(false)

  useEffect(() => {

    const storedOrderId =
      localStorage.getItem("aluria-order-id")

    if (!storedOrderId) return

    setIsCheckingPayment(true)

    let isRedirecting = false

    const interval = setInterval(async () => {

      try {

        const response = await fetch(
          `/api/order-status?order_id=${storedOrderId}`,
          {
            cache: "no-store",
          }
        )

        if (!response.ok) return

        const data = await response.json()

        console.log(
          "STATUS PEDIDO:",
          data
        )

        if (
          data?.order?.status === "approved" &&
          !isRedirecting
        ) {

          isRedirecting = true

          console.log(
            "PAGAMENTO APROVADO"
          )

          clearInterval(interval)

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

            router.push("/sucesso")

          }, 800)

        }

      } catch (error) {

        console.log(
          "Erro polling:",
          error
        )

      }

    }, 3000)

    return () => clearInterval(interval)

  }, [
    clearCart,
    clearCheckoutData,
    router,
  ])

  async function finalizarPagamento() {

    const requiredFields = [

      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.email,
      checkoutData.phone,
      checkoutData.cpf,
      checkoutData.cep,
      checkoutData.address,
      checkoutData.number,
      checkoutData.district,
      checkoutData.city,
      checkoutData.state,

    ]

    const hasEmptyField =
      requiredFields.some(
        field => !field?.trim()
      )

    if (hasEmptyField) {

      alert(
        "Preencha todos os campos obrigatórios para continuar."
      )

      return

    }

    try {

      const items = cart.map(item => ({

        title: item.title,

        quantity: item.quantity,

        currency_id: "BRL",

        unit_price: item.price,

      }))

      const response = await fetch(
        "/api/create-preference",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({

            items,

            customer: checkoutData,

          }),
        }
      )

      const data =
        await response.json()

      console.log(
        "CREATE PREFERENCE:",
        data
      )

      if (
        data.init_point &&
        data.order_id
      ) {

        localStorage.setItem(
          "aluria-order-id",
          data.order_id
        )

        window.location.href =
          data.init_point

      } else {

        alert(
          "Erro ao gerar pagamento"
        )

      }

    } catch (error) {

      console.log(error)

      alert(
        "Erro ao finalizar pagamento"
      )

    }

  }

  return (

    <main className="min-h-screen bg-[#f5efe8] text-[#2d2218] px-6 py-12">

      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_380px] gap-10">

        {/* FORMULÁRIO */}
        <div className="bg-white rounded-[30px] p-10">

          <h1 className="text-5xl font-bold mb-12">
            Checkout
          </h1>

          {isCheckingPayment && (

            <div className="mb-8 bg-[#f5efe8] border border-[#d6c8ba] rounded-2xl p-5">

              <p className="font-medium">
                Aguardando confirmação do pagamento PIX...
              </p>

            </div>

          )}

          {/* IDENTIFICAÇÃO */}
          <div className="mb-12">

            <h2 className="text-2xl font-bold mb-6">
              Identificação
            </h2>

            <div className="space-y-5">

              <div className="grid md:grid-cols-2 gap-5">

                <input
                  type="text"
                  placeholder="Nome"
                  value={checkoutData.firstName}
                  onChange={(e) =>
                    updateCheckoutData({
                      firstName: e.target.value,
                    })
                  }
                  className="w-full border border-[#d6c8ba] rounded-2xl px-5 py-4 outline-none"
                />

                <input
                  type="text"
                  placeholder="Sobrenome"
                  value={checkoutData.lastName}
                  onChange={(e) =>
                    updateCheckoutData({
                      lastName: e.target.value,
                    })
                  }
                  className="w-full border border-[#d6c8ba] rounded-2xl px-5 py-4 outline-none"
                />

              </div>

              <input
                type="email"
                placeholder="Email"
                value={checkoutData.email}
                onChange={(e) =>
                  updateCheckoutData({
                    email: e.target.value,
                  })
                }
                className="w-full border border-[#d6c8ba] rounded-2xl px-5 py-4 outline-none"
              />

              <input
                type="text"
                placeholder="WhatsApp"
                value={checkoutData.phone}
                onChange={(e) =>
                  updateCheckoutData({
                    phone: e.target.value,
                  })
                }
                className="w-full border border-[#d6c8ba] rounded-2xl px-5 py-4 outline-none"
              />

              <input
                type="text"
                placeholder="CPF"
                value={checkoutData.cpf}
                onChange={(e) =>
                  updateCheckoutData({
                    cpf: e.target.value,
                  })
                }
                className="w-full border border-[#d6c8ba] rounded-2xl px-5 py-4 outline-none"
              />

            </div>

          </div>

          {/* ENTREGA */}
          <div className="mb-12">

            <h2 className="text-2xl font-bold mb-6">
              Endereço de entrega
            </h2>

            <div className="space-y-5">

              <input
                type="text"
                placeholder="CEP"
                value={checkoutData.cep}
                onChange={(e) =>
                  updateCheckoutData({
                    cep: e.target.value,
                  })
                }
                className="w-full border border-[#d6c8ba] rounded-2xl px-5 py-4 outline-none"
              />

              <input
                type="text"
                placeholder="Rua"
                value={checkoutData.address}
                onChange={(e) =>
                  updateCheckoutData({
                    address: e.target.value,
                  })
                }
                className="w-full border border-[#d6c8ba] rounded-2xl px-5 py-4 outline-none"
              />

              <input
                type="text"
                placeholder="Número"
                value={checkoutData.number}
                onChange={(e) =>
                  updateCheckoutData({
                    number: e.target.value,
                  })
                }
                className="w-full border border-[#d6c8ba] rounded-2xl px-5 py-4 outline-none"
              />

              <input
                type="text"
                placeholder="Complemento"
                value={checkoutData.complement}
                onChange={(e) =>
                  updateCheckoutData({
                    complement: e.target.value,
                  })
                }
                className="w-full border border-[#d6c8ba] rounded-2xl px-5 py-4 outline-none"
              />

              <input
                type="text"
                placeholder="Bairro"
                value={checkoutData.district}
                onChange={(e) =>
                  updateCheckoutData({
                    district: e.target.value,
                  })
                }
                className="w-full border border-[#d6c8ba] rounded-2xl px-5 py-4 outline-none"
              />

              <div className="grid md:grid-cols-2 gap-5">

                <input
                  type="text"
                  placeholder="Cidade"
                  value={checkoutData.city}
                  onChange={(e) =>
                    updateCheckoutData({
                      city: e.target.value,
                    })
                  }
                  className="w-full border border-[#d6c8ba] rounded-2xl px-5 py-4 outline-none"
                />

                <input
                  type="text"
                  placeholder="Estado"
                  value={checkoutData.state}
                  onChange={(e) =>
                    updateCheckoutData({
                      state: e.target.value,
                    })
                  }
                  className="w-full border border-[#d6c8ba] rounded-2xl px-5 py-4 outline-none"
                />

              </div>

              <textarea
                placeholder="Observações (opcional)"
                value={checkoutData.instructions}
                onChange={(e) =>
                  updateCheckoutData({
                    instructions: e.target.value,
                  })
                }
                className="w-full border border-[#d6c8ba] rounded-2xl px-5 py-4 outline-none min-h-[120px]"
              />

            </div>

          </div>

        </div>

        {/* RESUMO */}
        <div className="bg-white rounded-[30px] p-10 h-fit sticky top-10">

          <h2 className="text-3xl font-bold mb-8">
            Resumo
          </h2>

          <div className="space-y-5 mb-10">

            {cart.map(item => (

              <div
                key={item.id}
                className="flex justify-between gap-4"
              >

                <div>

                  <p className="font-semibold">
                    {item.title}
                  </p>

                  <p className="text-sm text-[#7b6f63]">
                    Quantidade: {item.quantity}
                  </p>

                </div>

                <p className="font-semibold">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </p>

              </div>

            ))}

          </div>

          <div className="border-t border-[#e8ddd2] pt-6 mb-8">

            <div className="flex justify-between text-2xl font-bold">

              <span>Total</span>

              <span>
                R$ {subtotal.toFixed(2)}
              </span>

            </div>

          </div>

          <button
            onClick={finalizarPagamento}
            className="w-full bg-[#2d2218] text-white py-5 rounded-full uppercase tracking-[0.2em] hover:opacity-90 transition"
          >

            Finalizar pagamento

          </button>

        </div>

      </div>

    </main>

  )

}