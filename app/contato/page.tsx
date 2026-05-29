"use client"

import { useState } from "react"
import PremiumHeader from "@/components/layout/PremiumHeader"

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      console.log("RESPOSTA API:", data)

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar mensagem")
      }

      setSuccess(true)

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (err: any) {
      console.error(err)

      setError(err.message || "Erro ao enviar mensagem")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PremiumHeader />

      <main className="min-h-screen bg-[#f8f5f1] px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 pt-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-500">
              Aluria Premium
            </p>

            <h1 className="mb-6 text-4xl font-light text-neutral-900">
              Entre em contato
            </h1>

            <p className="mb-6 text-lg leading-relaxed text-neutral-600">
              Na Aluria Premium, cada detalhe é pensado para transformar ambientes e momentos em experiências memoráveis.
              Nossa equipe está disponível para esclarecer dúvidas, auxiliar em compras, indicar fragrâncias e desenvolver soluções personalizadas para ocasiões especiais. 
              Também atendemos pedidos corporativos, eventos, lembranças exclusivas e encomendas em maiores quantidades. Consulte condições comerciais, prazos de produção e entrega para projetos sob medida.

            </p>

            <div className="space-y-4 text-neutral-700">
              <p>
                Atendimento personalizado para dúvidas, suporte e informações
                sobre pedidos.
              </p>

              <div className="flex flex-wrap gap-3">
          <a
              href="https://wa.me/5548999567140"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-black px-6 py-3 text-sm text-white transition hover:opacity-90"
              >
              Conversar no WhatsApp
          </a>

          <a
            href="mailto:contato@aluriapremium.com.br"
            className="inline-flex rounded-full bg-black px-6 py-3 text-sm text-white transition hover:opacity-90"
            >
            Enviar E-mail
          </a>
            </div>

          <div className="mt-8 overflow-hidden rounded-[28px]">
            <img
              src="/images/vela-contato.png"
              alt="Vela aromática Alúria Premium"
              className="h-[390px] w-full object-cover object-top"
            />
          </div>

            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-neutral-700">
                  Nome
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-700">
                  WhatsApp
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-700">
                  Assunto
                </label>

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-700">
                  Mensagem
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              {success && (
                <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                  Sua mensagem foi enviada com sucesso.
                </div>
              )}

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-black px-6 py-4 text-sm text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Enviar mensagem"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}