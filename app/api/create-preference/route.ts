import { NextResponse } from "next/server"

import {
  MercadoPagoConfig,
  Preference,
} from "mercadopago"

export const dynamic =
  "force-dynamic"

/*
=====================================
DEBUG TOKEN
=====================================
*/

console.log(
  "TOKEN EXISTS:",
  !!process.env
    .MERCADOPAGO_ACCESS_TOKEN
)

console.log(
  "TOKEN PREFIX:",
  process.env
    .MERCADOPAGO_ACCESS_TOKEN
    ?.slice(0, 20)
)

/*
=====================================
MERCADO PAGO CLIENT
=====================================
*/

const client = new MercadoPagoConfig({
  accessToken:
    process.env
      .MERCADOPAGO_ACCESS_TOKEN!,
})

export async function POST(
  req: Request
) {

  try {

    console.log(
      "CREATE PREFERENCE REAL"
    )

    const body = await req.json()

    console.log(
      "BODY RECEBIDO:",
      JSON.stringify(
        body,
        null,
        2
      )
    )

    const {

      items,

      customer,

      external_reference,

    } = body

    if (
      !items ||
      items.length === 0
    ) {

      return NextResponse.json(
        {
          error:
            "Carrinho vazio",
        },
        {
          status: 400,
        }
      )

    }

    /*
    =====================================
    CALCULAR SUBTOTAL
    =====================================
    */

    const subtotal =
      items.reduce(
        (
          total: number,
          item: any
        ) => {

          return (
            total +
            Number(
              item.unit_price
            ) *
            Number(
              item.quantity
            )
          )

        },
        0
      )

    /*
    =====================================
    PREFERENCE DATA
    =====================================
    */

    const preferenceData = {

      items: items.map(
        (item: any) => ({

          id: item.id,

          title: item.title,

          quantity:
            Number(item.quantity),

          /*
          =====================================
          CORREÇÃO DEFINITIVA
          =====================================
          */

          unit_price:
            Number(
              item.unit_price
            ),

          currency_id:
            "BRL",

        })
      ),

      payer: {

        name:
          customer?.firstName,

        surname:
          customer?.lastName,

        email:
          customer?.email,

      },

      /*
      =====================================
      METADATA COMPLETA
      =====================================
      */

      metadata: {

        /*
        =====================================
        CLIENTE
        =====================================
        */

        first_name:
          customer?.firstName || "",

        last_name:
          customer?.lastName || "",

        email:
          customer?.email || "",

        phone:
          customer?.phone || "",

        cpf:
          customer?.cpf || "",

        /*
        =====================================
        ENDEREÇO
        =====================================
        */

        zip_code:
          customer?.zipCode || "",

        street:
          customer?.street || "",

        number:
          customer?.number || "",

        neighborhood:
          customer?.neighborhood || "",

        city:
          customer?.city || "",

        state:
          customer?.state || "",

        /*
        =====================================
        PEDIDO
        =====================================
        */

        items:
          JSON.stringify(items),

        subtotal,

      },

      external_reference,

      payment_methods: {

        excluded_payment_types:
          [],

        installments: 1,

      },

      notification_url:
        "https://www.aluriapremium.com.br/api/webhook",

      back_urls: {

        success:
          "https://www.aluriapremium.com.br/sucesso",

        failure:
          "https://www.aluriapremium.com.br/carrinho",

        pending:
          "https://www.aluriapremium.com.br/carrinho",

      },

      auto_return:
        "approved",

    }

    console.log(
      "PREFERENCE DATA:",
      JSON.stringify(
        preferenceData,
        null,
        2
      )
    )

    /*
    =====================================
    CREATE PREFERENCE
    =====================================
    */

    const preference =
      await new Preference(
        client
      ).create({
        body: preferenceData,
      })

    console.log(
      "PREFERENCE CRIADA:",
      JSON.stringify(
        preference,
        null,
        2
      )
    )

    return NextResponse.json({

      id: preference.id,

      init_point:
        preference.init_point,

      sandbox_init_point:
        preference.sandbox_init_point,

      external_reference,

    })

  } catch (error: any) {

    console.log(
      "ERRO CREATE PREFERENCE COMPLETO:"
    )

    console.log(error)

    console.log(
      "ERROR MESSAGE:",
      error?.message
    )

    console.log(
      "ERROR CAUSE:",
      error?.cause
    )

    console.log(
      "ERROR STATUS:",
      error?.status
    )

    console.log(
      "ERROR RESPONSE:",
      error?.response?.data
    )

    return NextResponse.json(
      {
        error:
          "Erro ao gerar pagamento",
      },
      {
        status: 500,
      }
    )

  }

}