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

    const paymentId =
      body?.data?.id

    if (!paymentId) {

      console.log(
        "PAYMENT ID NÃO ENCONTRADO"
      )

      return NextResponse.json({
        ok: true,
      })

    }

    /*
    =====================================
    CONSULTAR PAGAMENTO MP
    =====================================
    */

    let payment

    try {

      payment =
        await new Payment(client).get({
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
          error:
            "Erro consulta pagamento",
        },
        {
          status: 500,
        }
      )

    }

    if (!payment) {

      return NextResponse.json(
        {
          error:
            "Pagamento inexistente",
        },
        {
          status: 500,
        }
      )

    }

    /*
    =====================================
    VALIDAR EXTERNAL REFERENCE
    =====================================
    */

    if (!payment.external_reference) {

      return NextResponse.json(
        {
          error:
            "external_reference ausente",
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

    /*
    =====================================
    METADATA COMPLETA
    =====================================
    */

    const metadata =
      payment.metadata || {}

    const customerName = `
      ${metadata.first_name || ""}
      ${metadata.last_name || ""}
    `
      .trim()

    const customerEmail =
      metadata.email ||
      payment.payer?.email ||
      ""

    /*
    =====================================
    GERAR ORDER NUMBER
    =====================================
    */

    const { count } =
      await supabaseAdmin
        .from("orders")
        .select("*", {
          count: "exact",
          head: true,
        })

    const orderNumber =
      `ALR-${1001 + (count || 0)}`

    console.log(
      "ORDER NUMBER:",
      orderNumber
    )

    /*
    =====================================
    BUSCAR PEDIDO EXISTENTE
    =====================================
    */

    const {
      data: existingOrder,
    } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq(
        "external_reference",
        orderId
      )
      .maybeSingle()

    /*
    =====================================
    EVITAR DUPLICIDADE
    =====================================
    */

    const customerEmailAlreadySent =
      existingOrder?.buyer_email_sent

    const internalEmailAlreadySent =
      existingOrder?.email_sent

    /*
    =====================================
    ITEMS
    =====================================
    */

    let parsedItems = []

    try {

      parsedItems =
        metadata.items
          ? JSON.parse(
              metadata.items
            )
          : []

    } catch {

      parsedItems = []

    }

    /*
    =====================================
    DADOS PEDIDO
    =====================================
    */

    const orderData = {

      order_number:
        existingOrder?.order_number ||
        orderNumber,

      external_reference:
        orderId,

      payment_id:
        String(payment.id),

      status:
        payment.status,

      payment_status:
        payment.status,

      total:
        payment.transaction_amount || 0,

      subtotal:
        Number(
          metadata.subtotal || 0
        ),

      transaction_amount:
        payment.transaction_amount || 0,

      shipping_cost: 0,

      payment_method:
        payment.payment_method_id || "",

      customer_name:
        customerName,

      customer_email:
        customerEmail,

      phone:
        metadata.phone || "",

      cpf:
        metadata.cpf || "",

      zip_code:
        metadata.zip_code || "",

      street:
        metadata.street || "",

      number:
        metadata.number || "",

      neighborhood:
        metadata.neighborhood || "",

      city:
        metadata.city || "",

      state:
        metadata.state || "",

      items:
        parsedItems,

      paid_at:
        payment.status === "approved"
          ? new Date().toISOString()
          : null,

    }

    console.log(
      "SALVANDO PEDIDO:",
      JSON.stringify(orderData, null, 2)
    )

    /*
    =====================================
    UPSERT SUPABASE
    =====================================
    */

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
          error:
            "Erro Supabase",
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
    EMAILS SOMENTE APPROVED
    =====================================
    */

    if (payment.status === "approved") {

      /*
      =====================================
      EMAIL CLIENTE
      =====================================
      */

      if (
        customerEmail &&
        !customerEmailAlreadySent
      ) {

        try {

          await resend.emails.send({

            from:
              "Alúria Premium <noreply@aluriapremium.com.br>",

            to:
              customerEmail,

            subject:
              `Pedido ${orderData.order_number} confirmado ✨`,

            html: `
              <div style="background-color:#f8f5f1;padding:40px 20px;font-family:Arial,sans-serif;">

                <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">

                  <div style="background:#111111;padding:40px 20px;text-align:center;">

                    <img
                      src="https://www.aluriapremium.com.br/logo-email.png"
                      alt="Alúria Premium"
                      style="max-width:260px;height:auto;"
                    />

                  </div>

                  <div style="padding:48px 40px;">

                    <p style="font-size:14px;color:#8b7355;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">
                      Pedido confirmado
                    </p>

                    <h1 style="font-size:36px;line-height:1.2;color:#111111;margin:0 0 24px 0;">
                      Seu pedido foi confirmado ✨
                    </h1>

                    <p style="font-size:17px;line-height:1.8;color:#555555;margin-bottom:32px;">
                      Recebemos seu pagamento com sucesso e sua experiência com a Alúria Premium já começou.
                    </p>

                    <div style="background:#f8f5f1;border-radius:18px;padding:28px;margin-bottom:32px;">

                      <table width="100%">

                        <tr>
                          <td style="padding-bottom:16px;color:#777777;font-size:14px;">
                            Número do pedido
                          </td>

                          <td align="right" style="padding-bottom:16px;font-size:16px;font-weight:bold;color:#111111;">
                            ${orderData.order_number}
                          </td>
                        </tr>

                        <tr>
                          <td style="padding-bottom:16px;color:#777777;font-size:14px;">
                            Status
                          </td>

                          <td align="right" style="padding-bottom:16px;font-size:16px;font-weight:bold;color:#2f7d32;">
                            Pagamento aprovado
                          </td>
                        </tr>

                        <tr>
                          <td style="color:#777777;font-size:14px;">
                            Valor total
                          </td>

                          <td align="right" style="font-size:20px;font-weight:bold;color:#111111;">
                            R$ ${payment.transaction_amount}
                          </td>
                        </tr>

                      </table>

                    </div>

                    <div style="margin-bottom:32px;">

                      <h2 style="font-size:22px;color:#111111;margin-bottom:18px;">
                        Próximos passos
                      </h2>

                      <p style="font-size:16px;line-height:1.8;color:#555555;margin-bottom:12px;">
                        • Seu pedido será preparado com todo cuidado.
                      </p>

                      <p style="font-size:16px;line-height:1.8;color:#555555;margin-bottom:12px;">
                        • Você receberá atualizações sobre envio.
                      </p>

                    </div>

                    <div style="padding-top:32px;border-top:1px solid #eeeeee;">

                      <p style="font-size:15px;line-height:1.8;color:#666666;">
                        Obrigado por escolher a Alúria Premium.
                      </p>

                    </div>

                  </div>

                </div>

              </div>
            `,
          })

          /*
          =====================================
          MARCAR EMAIL CLIENTE
          =====================================
          */

          await supabaseAdmin
            .from("orders")
            .update({
              buyer_email_sent:
                true,
            })
            .eq(
              "external_reference",
              orderId
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

      if (
        !internalEmailAlreadySent
      ) {

        try {

          await resend.emails.send({

            from:
              "Alúria Premium <noreply@aluriapremium.com.br>",

            to:
              "leandroroesler@gmail.com",

            subject:
              `Novo pedido aprovado - ${orderData.order_number}`,

            html: `
              <div style="font-family:Arial;padding:32px;">

                <h1>
                  Novo pedido aprovado
                </h1>

                <div style="background:#f5f5f5;padding:24px;border-radius:16px;">

                  <p>
                    <strong>Pedido:</strong>
                    ${orderData.order_number}
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

                  <p>
                    <strong>Cidade:</strong>
                    ${metadata.city}
                  </p>

                  <p>
                    <strong>Estado:</strong>
                    ${metadata.state}
                  </p>

                </div>

              </div>
            `,
          })

          /*
          =====================================
          MARCAR EMAIL INTERNO
          =====================================
          */

          await supabaseAdmin
            .from("orders")
            .update({
              email_sent: true,
            })
            .eq(
              "external_reference",
              orderId
            )

        } catch (internalError) {

          console.log(
            "ERRO EMAIL INTERNO:",
            internalError
          )

        }

      }

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
        error:
          "Erro webhook",
      },
      {
        status: 500,
      }
    )

  }

}