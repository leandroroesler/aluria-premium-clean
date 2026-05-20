import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { Resend } from "resend"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    console.log(
      "WEBHOOK MP RECEBIDO:",
      JSON.stringify(body, null, 2)
    )

    const paymentId = body?.data?.id

    if (!paymentId) {

      console.log(
        "PAYMENT ID NÃO ENCONTRADO"
      )

      return NextResponse.json({
        ok: true,
      })

    }

    let payment

    try {

      payment = await new Payment(client).get({
        id: paymentId,
      })

      console.log(
        "PAGAMENTO MP:",
        JSON.stringify(payment, null, 2)
      )

    } catch (mpError) {

      console.log(
        "ERRO CONSULTA MP:",
        mpError
      )

      return NextResponse.json(
        {
          error: "Erro consulta pagamento",
        },
        {
          status: 500,
        }
      )

    }

    if (!payment) {

      console.log(
        "PAGAMENTO NÃO ENCONTRADO"
      )

      return NextResponse.json(
        {
          error: "Pagamento inexistente",
        },
        {
          status: 500,
        }
      )

    }

    console.log(
      "STATUS MP:",
      payment.status
    )

    if (!payment.external_reference) {

      console.log(
        "EXTERNAL_REFERENCE AUSENTE"
      )

      return NextResponse.json(
        {
          error: "external_reference ausente",
        },
        {
          status: 500,
        }
      )

    }

    const orderId =
      payment.external_reference

    console.log(
      "ORDER ID:",
      orderId
    )

    const customerName = [

      payment.additional_info?.payer?.first_name,

      payment.additional_info?.payer?.last_name,

    ]
      .filter(Boolean)
      .join(" ")

    const customerEmail =
      payment.metadata?.email ||
      payment.payer?.email ||
      ""

    const orderData = {

      external_reference: orderId,

      payment_id: String(payment.id),

      status: payment.status,

      total:
        payment.transaction_amount || 0,

      customer_name: customerName,

      customer_email: customerEmail,

    }

    console.log(
      "SALVANDO PEDIDO:",
      JSON.stringify(orderData, null, 2)
    )

    const { error } =
      await supabaseAdmin
        .from("orders")
        .upsert(orderData, {
          onConflict:
            "external_reference",
        })

    if (error) {

      console.log(
        "ERRO SUPABASE:",
        error
      )

      return NextResponse.json(
        {
          error: "Erro Supabase",
        },
        {
          status: 500,
        }
      )

    }

    console.log(
      "PEDIDO SALVO COM SUCESSO"
    )

    /*
    =====================================
    EMAILS APENAS SE APPROVED
    =====================================
    */

    if (payment.status === "approved") {

      console.log(
        "PAGAMENTO APROVADO - ENVIANDO EMAILS"
      )

      /*
      =====================================
      EMAIL CLIENTE
      =====================================
      */

      if (customerEmail) {

        try {

          const customerEmailResult =
            await resend.emails.send({

              from:
                "Alúria Premium <noreply@aluriapremium.com.br>",

              to: customerEmail,

              subject:
                "Pedido confirmado - Alúria Premium",

              html: `
                <div style="font-family: Arial; padding: 24px;">

                  <h1>
                    Pedido confirmado ✨
                  </h1>

                  <p>
                    Seu pagamento foi aprovado com sucesso.
                  </p>

                  <p>
                    <strong>Pedido:</strong>
                    ${orderId}
                  </p>

                  <p>
                    Você receberá novas atualizações em breve.
                  </p>

                  <br />

                  <p>
                    Alúria Premium
                  </p>

                </div>
              `,
            })

          console.log(
            "EMAIL CLIENTE ENVIADO:",
            customerEmailResult
          )

        } catch (emailError) {

          console.log(
            "ERRO EMAIL CLIENTE:",
            emailError
          )

        }

      }

      /*
      =====================================
      EMAIL INTERNO
      =====================================
      */

      try {

        const internalEmailResult =
          await resend.emails.send({

            from:
              "Alúria Premium <noreply@aluriapremium.com.br>",

            to:
              "leandroroesler@gmail.com",

            subject:
              "Novo pedido aprovado",

            html: `
              <div style="font-family: Arial; padding: 24px;">

                <h1>
                  Novo pedido aprovado
                </h1>

                <p>
                  <strong>Pedido:</strong>
                  ${orderId}
                </p>

                <p>
                  <strong>Cliente:</strong>
                  ${customerName}
                </p>

                <p>
                  <strong>Email:</strong>
                  ${customerEmail}
                </p>

                <p>
                  <strong>Total:</strong>
                  R$ ${payment.transaction_amount}
                </p>

              </div>
            `,
          })

        console.log(
          "EMAIL INTERNO ENVIADO:",
          internalEmailResult
        )

      } catch (internalError) {

        console.log(
          "ERRO EMAIL INTERNO:",
          internalError
        )

      }

    } else {

      console.log(
        "STATUS AINDA NÃO APPROVED:",
        payment.status
      )

    }

    return NextResponse.json({
      success: true,
    })

  } catch (error) {

    console.log(
      "ERRO WEBHOOK:",
      error
    )

    return NextResponse.json(
      {
        error: "Erro webhook",
      },
      {
        status: 500,
      }
    )

  }
}