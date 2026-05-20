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

    /*
    =====================================
    GERAR ORDER NUMBER
    =====================================
    */

    const { count, error: countError } =
      await supabaseAdmin
        .from("orders")
        .select("*", {
          count: "exact",
          head: true,
        })

    if (countError) {

      console.log(
        "ERRO CONTAGEM PEDIDOS:",
        countError
      )

    }

    const orderNumber =
      `ALR-${1001 + (count || 0)}`

    console.log(
      "ORDER NUMBER:",
      orderNumber
    )

    /*
    =====================================
    DADOS PEDIDO
    =====================================
    */

    const orderData = {

      order_number: orderNumber,

      external_reference: orderId,

      payment_id: String(payment.id),

      status: payment.status,

      payment_status: payment.status,

      total:
        payment.transaction_amount || 0,

      subtotal:
        payment.transaction_amount || 0,

      transaction_amount:
        payment.transaction_amount || 0,

      shipping_cost: 0,

      payment_method:
        payment.payment_method_id || "",

      customer_name: customerName,

      customer_email: customerEmail,

      paid_at:
        payment.status === "approved"
          ? new Date().toISOString()
          : null,

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
                `Pedido ${orderNumber} confirmado ✨`,

              html: `
                <div style="font-family: Arial; padding: 24px; max-width: 600px; margin: 0 auto;">

                  <h1 style="color: #111;">
                    Pedido confirmado ✨
                  </h1>

                  <p style="font-size: 16px; color: #444;">
                    Seu pagamento foi aprovado com sucesso.
                  </p>

                  <div style="background: #f5f5f5; padding: 16px; border-radius: 12px; margin-top: 24px;">

                    <p>
                      <strong>Pedido:</strong>
                      ${orderNumber}
                    </p>

                    <p>
                      <strong>Total:</strong>
                      R$ ${payment.transaction_amount}
                    </p>

                    <p>
                      <strong>Status:</strong>
                      Pagamento aprovado
                    </p>

                  </div>

                  <p style="margin-top: 24px; color: #555;">
                    Você receberá novas atualizações sobre envio e andamento do pedido em breve.
                  </p>

                  <br />

                  <p style="color: #777;">
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
              `Novo pedido aprovado - ${orderNumber}`,

            html: `
              <div style="font-family: Arial; padding: 24px;">

                <h1>
                  Novo pedido aprovado
                </h1>

                <div style="background: #f5f5f5; padding: 16px; border-radius: 12px;">

                  <p>
                    <strong>Pedido:</strong>
                    ${orderNumber}
                  </p>

                  <p>
                    <strong>External Reference:</strong>
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

                  <p>
                    <strong>Método:</strong>
                    ${payment.payment_method_id}
                  </p>

                </div>

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