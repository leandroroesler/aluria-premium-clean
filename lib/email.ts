import { Resend } from "resend"

export async function sendOrderEmails(order: any) {

  try {

    const resend = new Resend(
      process.env.RESEND_API_KEY
    )

    // =========================
    // ITENS PEDIDO
    // =========================

    const itemsHtml =
      order.items?.map((item: any) => `
        <tr>
          <td style="
            padding:10px;
            border-bottom:1px solid #eee;
          ">
            ${item.title}
          </td>

          <td style="
            padding:10px;
            border-bottom:1px solid #eee;
            text-align:center;
          ">
            ${item.quantity}
          </td>

          <td style="
            padding:10px;
            border-bottom:1px solid #eee;
            text-align:right;
          ">
            R$ ${Number(item.unit_price).toFixed(2)}
          </td>
        </tr>
      `).join("") || ""

    // =========================
    // EMAIL CLIENTE
    // =========================

    await resend.emails.send({

      from:
        "Aluria Premium <noreply@aluriapremium.com.br>",

      to:
        order.customer_email,

      subject:
        `Pedido confirmado • ${order.order_number}`,

      html: `
        <div style="
          font-family: Arial, sans-serif;
          background:#f7f4ef;
          padding:40px 20px;
        ">

          <div style="
            max-width:600px;
            margin:0 auto;
            background:white;
            border-radius:18px;
            overflow:hidden;
            box-shadow:0 4px 24px rgba(0,0,0,0.08);
          ">

            <div style="
              background:#f5efe8;
              padding:50px 30px 40px 30px;
              text-align:center;
              border-bottom:1px solid #eee;
            ">

              <img
                src="https://www.aluriapremium.com.br/images/Logo_E-mail.PNG"
                alt="Aluria Premium"
                style="
                  width:240px;
                  max-width:100%;
                  margin-bottom:28px;
                "
              />

              <h1 style="
                margin:0;
                font-size:28px;
                letter-spacing:4px;
                color:#2d2218;
                font-weight:700;
              ">
                ALURIA PREMIUM
              </h1>

              <p style="
                margin-top:16px;
                color:#8a7768;
                font-size:16px;
                line-height:1.7;
              ">
                Pedido confirmado com sucesso ✨
              </p>

            </div>

            <div style="padding:35px;">

              <p style="
                font-size:16px;
                color:#333;
              ">
                Olá <strong>${order.customer_name}</strong>,
              </p>

              <p style="
                color:#555;
                line-height:1.8;
                font-size:15px;
              ">
                Recebemos seu pedido e o pagamento PIX foi aprovado com sucesso.
              </p>

              <p style="
                color:#555;
                line-height:1.8;
                font-size:15px;
              ">
                Nossa equipe já iniciou a preparação do seu pedido e você receberá novas atualizações por email assim que ele for enviado.
              </p>

              <div style="
                background:#faf7f2;
                padding:24px;
                border-radius:14px;
                margin:30px 0;
              ">

                <p style="
                  margin:0 0 12px 0;
                  font-size:15px;
                ">
                  <strong>Número do pedido:</strong>
                  ${order.order_number}
                </p>

                <p style="
                  margin:0 0 12px 0;
                  font-size:15px;
                ">
                  <strong>Status:</strong>
                  Pagamento aprovado
                </p>

                <p style="
                  margin:0;
                  font-size:15px;
                ">
                  <strong>Total:</strong>
                  R$ ${Number(order.total).toFixed(2)}
                </p>

              </div>

              <h3 style="
                margin-top:35px;
                color:#222;
                font-size:20px;
              ">
                Itens do pedido
              </h3>

              <table style="
                width:100%;
                border-collapse:collapse;
                margin-top:15px;
                font-size:14px;
              ">

                <thead>

                  <tr style="background:#fafafa;">

                    <th style="
                      text-align:left;
                      padding:12px;
                    ">
                      Produto
                    </th>

                    <th style="
                      text-align:center;
                      padding:12px;
                    ">
                      Qtd
                    </th>

                    <th style="
                      text-align:right;
                      padding:12px;
                    ">
                      Valor
                    </th>

                  </tr>

                </thead>

                <tbody>
                  ${itemsHtml}
                </tbody>

              </table>

              <div style="
                margin-top:35px;
                padding:22px;
                background:#f7f4ef;
                border-radius:14px;
              ">

                <p style="
                  margin:0;
                  color:#555;
                  line-height:1.8;
                  font-size:14px;
                ">
                  Em caso de dúvidas, nossa equipe estará disponível para auxiliar você durante todo o processo.
                </p>

              </div>

              <p style="
                margin-top:45px;
                color:#888;
                font-size:14px;
                line-height:1.7;
              ">
                Obrigado por escolher a Aluria Premium ✨
              </p>

            </div>

          </div>

        </div>
      `,
    })

    // =========================
    // EMAIL INTERNO OPERACIONAL
    // =========================

    await resend.emails.send({

      from:
        "Aluria Premium <noreply@aluriapremium.com.br>",

      to:
        "leandroroesler@gmail.com",

      subject:
        `Novo pedido • ${order.order_number}`,

      html: `
        <div style="
          font-family: Arial, sans-serif;
          padding:30px;
          background:#f7f7f7;
        ">

          <div style="
            max-width:720px;
            margin:0 auto;
            background:white;
            padding:35px;
            border-radius:16px;
          ">

            <h1 style="
              margin-top:0;
              color:#111;
            ">
              Novo pedido aprovado
            </h1>

            <div style="
              background:#fafafa;
              padding:24px;
              border-radius:14px;
              margin-bottom:35px;
            ">

              <p>
                <strong>Pedido:</strong>
                ${order.order_number}
              </p>

              <p>
                <strong>Total:</strong>
                R$ ${Number(order.total).toFixed(2)}
              </p>

              <p>
                <strong>Status:</strong>
                ${order.status}
              </p>

            </div>

            <h2>Dados do comprador</h2>

            <p>
              <strong>Nome:</strong>
              ${order.customer.first_name || ""}
              ${order.customer.last_name || ""}
            </p>

            <p>
              <strong>Email:</strong>
              ${order.customer_email}
            </p>

            <p>
              <strong>Telefone:</strong>
              ${order.customer.phone || "-"}
            </p>

            <p>
              <strong>CPF:</strong>
              ${order.customer.cpf || "-"}
            </p>

            <h2 style="margin-top:35px;">
              Endereço de entrega
            </h2>

            <p>
              ${order.customer.address || ""}
              ${order.customer.number || ""}
            </p>

            <p>
              ${order.customer.complement || ""}
            </p>

            <p>
              ${order.customer.district || ""}
            </p>

            <p>
              ${order.customer.city || ""}
              -
              ${order.customer.state || ""}
            </p>

            <p>
              <strong>CEP:</strong>
              ${order.customer.cep || ""}
            </p>

            <h2 style="margin-top:35px;">
              Itens do pedido
            </h2>

            <table style="
              width:100%;
              border-collapse:collapse;
              margin-top:15px;
              font-size:14px;
            ">

              <thead>

                <tr style="background:#fafafa;">

                  <th style="
                    text-align:left;
                    padding:12px;
                  ">
                    Produto
                  </th>

                  <th style="
                    text-align:center;
                    padding:12px;
                  ">
                    Qtd
                  </th>

                  <th style="
                    text-align:right;
                    padding:12px;
                  ">
                    Valor
                  </th>

                </tr>

              </thead>

              <tbody>
                ${itemsHtml}
              </tbody>

            </table>

            <div style="
              margin-top:35px;
              background:#fafafa;
              padding:24px;
              border-radius:14px;
            ">

              <p>
                <strong>Observações:</strong>
              </p>

              <p>
                ${order.customer.instructions || "Nenhuma observação"}
              </p>

            </div>

          </div>

        </div>
      `,
    })

    console.log(
      "✅ Emails enviados com sucesso"
    )

  } catch (error) {

    console.error(
      "❌ Erro ao enviar emails:",
      error
    )

  }

}