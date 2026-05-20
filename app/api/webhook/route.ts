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

      return NextResponse.json({
        ok: true,
      })

    }

    /*
    =====================================
    CONSULTA PAGAMENTO MP
    =====================================
    */

    const payment =
      await new Payment(client).get({
        id: paymentId,
      })

    if (
      !payment ||
      !payment.external_reference
    ) {

      return NextResponse.json(
        {
          error:
            "Pagamento inválido",
        },
        {
          status: 500,
        }
      )

    }

    const orderId =
      payment.external_reference

    /*
    =====================================
    METADATA
    =====================================
    */

    const metadata =
      payment.metadata || {}

    const customerName = `
      ${metadata.first_name || ""}
      ${metadata.last_name || ""}
    `
      .replace(/\s+/g, " ")
      .trim()

    const customerEmail =
      metadata.email ||
      payment.payer?.email ||
      ""

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
    HTML ITEMS
    =====================================
    */

    const itemsHtml =
      parsedItems
        .map(
          (item: any) => `
            <tr>
              <td style="padding:14px 0;border-bottom:1px solid #eee;color:#333;">
                ${item.title}
              </td>

              <td align="center" style="padding:14px 0;border-bottom:1px solid #eee;color:#333;">
                ${item.quantity}
              </td>

              <td align="right" style="padding:14px 0;border-bottom:1px solid #eee;color:#333;">
                R$ ${item.unit_price}
              </td>
            </tr>
          `
        )
        .join("")

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

    /*
    =====================================
    PEDIDO EXISTENTE
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
    CONTROLE DUPLICIDADE
    =====================================
    */

    const customerEmailAlreadySent =
      existingOrder?.buyer_email_sent

    const internalEmailAlreadySent =
      existingOrder?.email_sent

    /*
    =====================================
    ORDER DATA
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

    /*
    =====================================
    UPSERT
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

    /*
    =====================================
    SOMENTE APPROVED
    =====================================
    */

    if (
      payment.status === "approved"
    ) {

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
              <div style="background:#f7f3ee;padding:40px 20px;font-family:Arial,sans-serif;">

                <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">

                  <!-- HEADER -->

                  <div style="background:#f8f5f1;padding:40px 24px 24px 24px;text-align:center;border-bottom:1px solid #ece7df;">

                    <img
                      src="https://www.aluriapremium.com.br/logo-email.png"
                      alt="Alúria Premium"
                      style="
                        width:280px;
                        max-width:100%;
                        height:auto;
                        display:block;
                        margin:0 auto;
                        object-fit:contain;
                      "
                    />

                  </div>

                  <!-- BODY -->

                  <div style="padding:48px 40px;">

                    <p style="font-size:13px;letter-spacing:3px;color:#8d7355;text-transform:uppercase;margin-bottom:16px;">
                      Pedido confirmado
                    </p>

                    <h1 style="font-size:42px;line-height:1.2;color:#111111;margin:0 0 24px 0;">
                      Seu pedido foi confirmado ✨
                    </h1>

                    <p style="font-size:18px;line-height:1.8;color:#555555;margin-bottom:36px;">
                      Recebemos seu pagamento com sucesso e sua experiência com a Alúria Premium já começou.
                    </p>

                    <!-- RESUMO -->

                    <div style="background:#f8f5f1;border-radius:20px;padding:28px;margin-bottom:32px;">

                      <table width="100%">

                        <tr>
                          <td style="padding-bottom:18px;color:#777;">
                            Pedido
                          </td>

                          <td align="right" style="padding-bottom:18px;font-weight:bold;color:#111;">
                            ${orderData.order_number}
                          </td>
                        </tr>

                        <tr>
                          <td style="padding-bottom:18px;color:#777;">
                            Status
                          </td>

                          <td align="right" style="padding-bottom:18px;font-weight:bold;color:#2f7d32;">
                            Pagamento aprovado
                          </td>
                        </tr>

                        <tr>
                          <td style="color:#777;">
                            Valor total
                          </td>

                          <td align="right" style="font-size:24px;font-weight:bold;color:#111;">
                            R$ ${payment.transaction_amount}
                          </td>
                        </tr>

                      </table>

                    </div>

                    <!-- PRODUTOS -->

                    <div style="margin-bottom:40px;">

                      <h2 style="font-size:24px;color:#111;margin-bottom:24px;">
                        Itens do pedido
                      </h2>

                      <table width="100%" cellpadding="0" cellspacing="0">

                        <thead>

                          <tr>

                            <th align="left" style="padding-bottom:14px;color:#777;font-size:14px;">
                              Produto
                            </th>

                            <th align="center" style="padding-bottom:14px;color:#777;font-size:14px;">
                              Qtde
                            </th>

                            <th align="right" style="padding-bottom:14px;color:#777;font-size:14px;">
                              Valor
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          ${itemsHtml}

                        </tbody>

                      </table>

                    </div>

                    <!-- ENTREGA -->

                    <div style="margin-bottom:40px;">

                      <h2 style="font-size:24px;color:#111;margin-bottom:20px;">
                        Dados para entrega
                      </h2>

                      <div style="background:#f8f5f1;border-radius:18px;padding:24px;line-height:1.9;color:#555;">

                        <strong style="color:#111;">
                          ${customerName}
                        </strong>

                        <br />

                        ${metadata.street || ""}
                        ${metadata.number || ""}

                        <br />

                        ${metadata.neighborhood || ""}

                        <br />

                        ${metadata.city || ""} - ${metadata.state || ""}

                        <br />

                        CEP:
                        ${metadata.zip_code || ""}

                        <br /><br />

                        Telefone:
                        ${metadata.phone || ""}

                      </div>

                    </div>

                    <!-- RODAPÉ -->

                    <div style="padding-top:32px;border-top:1px solid #eeeeee;">

                      <p style="font-size:16px;line-height:1.8;color:#666666;">
                        Você receberá novas atualizações sobre o andamento e envio do seu pedido.
                      </p>

                      <p style="font-size:16px;line-height:1.8;color:#666666;">
                        Obrigado por escolher a Alúria Premium ✨
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
              <div style="font-family:Arial;padding:40px;background:#f5f5f5;">

                <div style="max-width:760px;margin:0 auto;background:#ffffff;border-radius:24px;padding:40px;">

                  <h1 style="margin-top:0;">
                    Novo pedido aprovado
                  </h1>

                  <div style="background:#f8f5f1;padding:24px;border-radius:18px;margin-bottom:32px;line-height:1.9;">

                    <strong>Pedido:</strong>
                    ${orderData.order_number}

                    <br />

                    <strong>Cliente:</strong>
                    ${customerName}

                    <br />

                    <strong>Email:</strong>
                    ${customerEmail}

                    <br />

                    <strong>Telefone:</strong>
                    ${metadata.phone || ""}

                    <br />

                    <strong>CPF:</strong>
                    ${metadata.cpf || ""}

                    <br />

                    <strong>Total:</strong>
                    R$ ${payment.transaction_amount}

                    <br />

                    <strong>Método:</strong>
                    ${payment.payment_method_id}

                  </div>

                  <h2>
                    Endereço
                  </h2>

                  <div style="background:#f8f5f1;padding:24px;border-radius:18px;margin-bottom:32px;line-height:1.9;">

                    ${metadata.street || ""}
                    ${metadata.number || ""}

                    <br />

                    ${metadata.neighborhood || ""}

                    <br />

                    ${metadata.city || ""} - ${metadata.state || ""}

                    <br />

                    CEP:
                    ${metadata.zip_code || ""}

                  </div>

                  <h2>
                    Produtos
                  </h2>

                  <table width="100%" cellpadding="0" cellspacing="0">

                    <thead>

                      <tr>

                        <th align="left" style="padding-bottom:14px;">
                          Produto
                        </th>

                        <th align="center" style="padding-bottom:14px;">
                          Qtde
                        </th>

                        <th align="right" style="padding-bottom:14px;">
                          Valor
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      ${itemsHtml}

                    </tbody>

                  </table>

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