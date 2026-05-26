export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    console.log("BODY RECEBIDO:", body)

    const { name, email, phone, subject, message } = body

    // VALIDAÇÃO
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Campos obrigatórios não preenchidos",
        },
        {
          status: 400,
        }
      )
    }

    // SALVA NO SUPABASE
    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        name,
        email,
        phone,
        subject,
        message,
      })
      .select()

    if (error) {
      console.error("ERRO SUPABASE:", error)

      return NextResponse.json(
        {
          success: false,
          error: "Erro ao salvar mensagem",
        },
        {
          status: 500,
        }
      )
    }

    console.log("MENSAGEM SALVA:", data)

    // ======================================================
    // EMAIL INTERNO
    // ======================================================

    const internalEmail = await resend.emails.send({
      // TEMPORÁRIO PARA TESTE:
      // se funcionar, o problema é DNS/domínio
      // depois volte para:
      // "Aluria Premium <noreply@aluriapremium.com.br>"

      from: "Aluria Premium <noreply@aluriapremium.com.br>",

      to: [
  "contato@aluriapremium.com.br",
  
],

      replyTo: email,

      subject: `Novo contato - ${subject}`,

      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Novo contato recebido pelo site</h2>

          <p><strong>Nome:</strong> ${name}</p>

          <p><strong>Email:</strong> ${email}</p>

          <p><strong>Telefone:</strong> ${
            phone || "Não informado"
          }</p>

          <p><strong>Assunto:</strong> ${subject}</p>

          <hr />

          <p><strong>Mensagem:</strong></p>

          <p style="white-space: pre-line;">
            ${message}
          </p>
        </div>
      `,
    })

    console.log("RESPOSTA EMAIL INTERNO:", internalEmail)

    // VALIDA RETORNO RESEND
    if (internalEmail.error) {
      console.error(
        "ERRO ENVIO EMAIL INTERNO:",
        internalEmail.error
      )

      return NextResponse.json(
        {
          success: false,
          error: "Erro ao enviar email interno",
        },
        {
          status: 500,
        }
      )
    }

    // ======================================================
    // EMAIL AUTOMÁTICO CLIENTE
    // ======================================================

    const customerEmail = await resend.emails.send({
      from: "Aluria Premium <noreply@aluriapremium.com.br>",

      to: [email],

      subject: "Recebemos sua mensagem | Aluria Premium",

      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Olá, ${name}!</h2>

          <p>
            Recebemos sua mensagem com sucesso e retornaremos
            o mais breve possível.
          </p>

          <p>
            Obrigado por entrar em contato com a
            Aluria Premium.
          </p>

          <hr />

          <p><strong>Resumo da mensagem:</strong></p>

          <p><strong>Assunto:</strong> ${subject}</p>

          <p style="white-space: pre-line;">
            ${message}
          </p>

          <br />

          <p>
            Atenciosamente,<br />
            Equipe Aluria Premium
          </p>
        </div>
      `,
    })

    console.log("RESPOSTA EMAIL CLIENTE:", customerEmail)

    if (customerEmail.error) {
      console.error(
        "ERRO EMAIL CLIENTE:",
        customerEmail.error
      )
    }

    // ======================================================
    // SUCESSO
    // ======================================================

    return NextResponse.json({
      success: true,
      message: "Mensagem enviada com sucesso",
    })
  } catch (error: any) {
    console.error("ERRO API CONTACT:", error)

    return NextResponse.json(
      {
        success: false,
        error:
          error.message || "Erro interno do servidor",
      },
      {
        status: 500,
      }
    )
  }
}