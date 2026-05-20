import PremiumHeader from "@/components/layout/PremiumHeader"

export default function SobrePage() {
  return (
    <>
      <PremiumHeader />

      <main className="min-h-screen bg-[#f8f5f1] px-6 py-20">
        <div className="mx-auto max-w-4xl pt-10">

          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-neutral-500">
            Aluria Premium
          </p>

          <h1 className="mb-12 text-5xl font-light leading-tight text-neutral-900">
            Criamos experiências sensoriais sofisticadas.
          </h1>

          <div className="space-y-10 text-lg leading-loose text-neutral-700">

            <p className="text-justify">
              Na Aluria Premium, acreditamos que ambientes sofisticados
              são construídos através dos detalhes.
            </p>

            <p className="text-justify">
              Criamos velas aromáticas artesanais que unem elegância,
              identidade e experiência sensorial em cada composição.
            </p>

            <p className="text-justify">
              Cada peça é produzida manualmente, utilizando matérias-primas
              selecionadas, aromas refinados e acabamento cuidadoso para
              transformar espaços em experiências acolhedoras e sofisticadas.
            </p>

            <p className="text-justify">
              Mais do que fragrâncias, desenvolvemos atmosferas que despertam
              sensações, memórias e bem-estar.
            </p>

          </div>

          <div className="my-20 h-px w-full bg-black/10" />

          <div className="grid gap-10 md:grid-cols-2">

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-2xl font-light text-neutral-900">
                Nossa essência
              </h2>

              <ul className="space-y-4 text-neutral-700 leading-relaxed">
                <li>• Produção artesanal cuidadosa</li>
                <li>• Ingredientes e materiais nobres</li>
                <li>• Aromas sofisticados e exclusivos</li>
                <li>• Design minimalista e elegante</li>
                <li>• Experiência premium em cada detalhe</li>
              </ul>
            </div>

            <div className="rounded-3xl bg-black p-8 text-white shadow-sm">
              <h2 className="mb-6 text-2xl font-light">
                Nossa visão
              </h2>

              <p className="leading-loose text-white/80 text-justify">
                Acreditamos no luxo discreto, na sofisticação dos detalhes
                e na beleza presente nos momentos cotidianos.
              </p>

              <p className="mt-6 leading-loose text-white/80 text-justify">
                Cada vela é criada para transformar ambientes em espaços
                acolhedores, elegantes e memoráveis.
              </p>
            </div>

          </div>

        </div>
      </main>
    </>
  )
}