"use client"

import {
  useEffect,
  useState,
} from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { useCheckout } from "../../context/CheckoutContext"
import { useCart } from "../../context/CartContext"

import { shippingByState } from "../../lib/shipping"

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
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} = useCart()

  const router = useRouter()

  const [isCheckingPayment, setIsCheckingPayment] =
    useState(false)

  useEffect(() => {

  const state =
    checkoutData.state
      .trim()
      .toUpperCase()

  const city =
    checkoutData.city
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()

  const freeShippingCities = [

    "FLORIANOPOLIS",

    "SAO JOSE",

    "PALHOCA",

    "BIGUACU",

    "SANTO AMARO DA IMPERATRIZ",

]

  if (!state) {

    if (
      checkoutData.shipping !== 0 ||
      checkoutData.shippingState !== ""
    ) {

      updateCheckoutData({
        shipping: 0,
        shippingState: "",
      })

    }

    return

  }

  const shipping =

  state === "SC" &&
  freeShippingCities.includes(city)

    ? 0

    : shippingByState[state] || 0

  console.log(
  "FRETE CALCULADO:",
  state,
  shipping
)

  if (
    shipping !== checkoutData.shipping ||
    state !== checkoutData.shippingState
  ) {

    updateCheckoutData({
      shipping,
      shippingState: state,
    })

  }

}, [
  checkoutData.state,
  checkoutData.shipping,
  checkoutData.shippingState,
  updateCheckoutData,
])


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

        id: item.id,

        title: item.title,

        quantity: item.quantity,

        currency_id: "BRL",

        unit_price: item.price,

      }))

      const externalReference =
        crypto.randomUUID()

      console.log(
        "EXTERNAL REFERENCE:",
        externalReference
      )

      const response = await fetch(
        "/api/create-preference",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            items,

            customer: checkoutData,

            external_reference:
              externalReference,

          }),
        }
      )

      const data =
        await response.json()

      console.log(
        "CREATE PREFERENCE:",
        data
      )

      if (data.init_point) {

        localStorage.setItem(
          "aluria-order-id",
          externalReference
        )

        console.log(
          "REDIRECT CHECKOUT:",
          data.init_point
        )

        window.location.href =
          data.init_point

      } else {

        console.log(
          "ERRO CREATE PREFERENCE:",
          data
        )

        alert(
          "Erro ao gerar pagamento"
        )

      }

    } catch (error) {

      console.log(
        "ERRO FINALIZAR PAGAMENTO:",
        error
      )

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

                <select
                  value={checkoutData.state}
                  onChange={(e) =>
                  updateCheckoutData({
                    state: e.target.value,
                })
             }
            className="w-full border border-[#d6c8ba] rounded-2xl px-5 py-4 outline-none bg-white"
        >

            <option value="">
              Selecione o estado
            </option>

            <option value="AC">Acre</option>
            <option value="AL">Alagoas</option>
            <option value="AP">Amapá</option>
            <option value="AM">Amazonas</option>
            <option value="BA">Bahia</option>
            <option value="CE">Ceará</option>
            <option value="DF">Distrito Federal</option>
            <option value="ES">Espírito Santo</option>
            <option value="GO">Goiás</option>
            <option value="MA">Maranhão</option>
            <option value="MT">Mato Grosso</option>
            <option value="MS">Mato Grosso do Sul</option>
            <option value="MG">Minas Gerais</option>
            <option value="PA">Pará</option>
            <option value="PB">Paraíba</option>
            <option value="PR">Paraná</option>
            <option value="PE">Pernambuco</option>
            <option value="PI">Piauí</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="RN">Rio Grande do Norte</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="RO">Rondônia</option>
            <option value="RR">Roraima</option>
            <option value="SC">Santa Catarina</option>
            <option value="SP">São Paulo</option>
            <option value="SE">Sergipe</option>
            <option value="TO">Tocantins</option>

        </select>

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
<div className="bg-white rounded-[30px] p-8 h-fit sticky top-10 shadow-sm">

  <h2 className="text-3xl font-bold mb-8">
    Resumo do pedido
  </h2>

  <div className="space-y-6">

    {cart.map(item => (

      <div
        key={item.id}
        className="flex gap-4 border-b border-[#efe7dd] pb-6"
      >

        <img
          src={item.image}
          alt={item.title}
          className="h-24 w-24 rounded-[18px] object-cover"
        />

        <div className="flex-1">

          <div className="flex items-start justify-between gap-4">

            <div>

              <p className="text-lg font-semibold text-[#2d2218]">
                {item.title}
              </p>

              <p className="text-sm text-[#8a7666] mt-1">
                Vela Aromática 100g
              </p>

            </div>

            <p className="font-semibold text-[#2d2218]">
              R$ {(item.price * item.quantity).toFixed(2)}
            </p>

          </div>

          <div className="mt-4 flex items-center justify-between">

            <div className="flex items-center overflow-hidden rounded-full border border-[#d8c8ba]">

              <button
                onClick={() => decreaseQuantity(item.id)}
                className="px-4 py-2 text-lg text-[#5c4634] hover:bg-[#f7f2ed]"
              >
                −
              </button>

              <span className="px-4 text-sm">
                {item.quantity}
              </span>

              <button
                onClick={() => increaseQuantity(item.id)}
                className="px-4 py-2 text-lg text-[#5c4634] hover:bg-[#f7f2ed]"
              >
                +
              </button>

            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="text-sm text-[#8a7666] hover:text-[#2d2218] transition"
            >
              Remover
            </button>

          </div>

        </div>

      </div>

    ))}

  </div>

  <div className="mt-6 space-y-4 border-b border-[#efe7dd] pb-6">

    <div className="flex justify-between text-[#5c4634]">
      <span>Subtotal</span>
      <span>R$ {subtotal.toFixed(2)}</span>
    </div>

    <div className="flex justify-between text-[#5c4634]">
  <span>Frete</span>

  <span>
    R$ {checkoutData.shipping.toFixed(2)}
  </span>
</div>

  </div>

  <div className="mt-6 flex items-center justify-between">

    <span className="text-3xl font-bold text-[#2d2218]">
      Total
    </span>

    <span className="text-3xl font-bold text-[#2d2218]">
      R$ {(subtotal + checkoutData.shipping).toFixed(2)}
    </span>

  </div>

  <Link
    href="/"
    className="mt-6 flex w-full items-center justify-center rounded-full border border-[#d8c8ba] px-6 py-4 text-sm tracking-[0.25em] text-[#5c4634] transition hover:bg-[#f7f2ed]"
  >
    ← CONTINUAR COMPRANDO
  </Link>

  <button
    onClick={finalizarPagamento}
    className="mt-4 w-full rounded-full bg-[#2d2218] py-5 text-sm uppercase tracking-[0.3em] text-white transition hover:opacity-90"
  >
    Finalizar pagamento
  </button>

</div>

      </div>

    </main>

  )

}