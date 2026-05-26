import PremiumHeader from "@/components/layout/PremiumHeader"

export default function SobrePage() {
  return (
    <>
      <PremiumHeader />

      <main className="min-h-screen bg-[#f8f5f1] px-6 py-20">
        <div className="mx-auto max-w-5xl pt-10">

          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-neutral-500">
            Aluria Premium
          </p>

          <h1 className="mb-16 max-w-4xl text-5xl font-light leading-tight text-neutral-900">
            Criamos experiências sensoriais sofisticadas.
          </h1>

          <div className="max-w-4xl text-[1.35rem] leading-[2.5rem] text-neutral-700">

            <p style={{ textAlign: "justify" }}>
              Na Aluria Premium, acreditamos que ambientes sofisticados são construídos
              através dos detalhes, das sensações e da atmosfera que cada espaço é capaz
              de transmitir. Criamos velas aromáticas artesanais desenvolvidas para unir
              elegância, identidade e experiência sensorial em composições exclusivas que
              transformam momentos cotidianos em experiências acolhedoras e memoráveis.

              <br /><br />

              Cada peça é produzida manualmente com atenção cuidadosa a cada etapa do
              processo, utilizando matérias-primas selecionadas, fragrâncias refinadas e
              acabamentos minimalistas que refletem nossa essência: sofisticação discreta,
              qualidade premium e autenticidade artesanal. Mais do que fragrâncias,
              buscamos desenvolver atmosferas que despertam conforto, bem-estar e conexão
              emocional através dos aromas.

              <br /><br />

              Nossa inspiração nasce da combinação entre design elegante, perfumaria
              sofisticada e a beleza presente nos pequenos rituais do cotidiano. Cada vela
              é pensada para transformar ambientes em espaços mais acolhedores, sofisticados
              e sensoriais, proporcionando uma experiência que vai além da decoração e se
              torna parte da identidade de cada ambiente.

              <br /><br />

              Acreditamos no luxo silencioso, na beleza dos detalhes e na capacidade que
              os aromas possuem de despertar memórias, sensações e experiências únicas.
              Na Aluria Premium, cada criação carrega o propósito de tornar os ambientes
              mais sofisticados, elegantes e memoráveis.
            </p>

          </div>

          <div className="my-24 h-px w-full bg-black/10" />

          <div className="grid gap-10 md:grid-cols-2">

            <div className="rounded-3xl bg-white p-10 shadow-sm">
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

            <div className="rounded-3xl bg-black p-10 text-white shadow-sm">
              <h2 className="mb-6 text-2xl font-light">
                Nossa visão
              </h2>

              <p
                className="leading-loose text-white/80"
                style={{ textAlign: "justify" }}
              >
                Acreditamos no luxo discreto, na sofisticação dos detalhes
                e na beleza presente nos momentos cotidianos.
              </p>

              <p
                className="mt-6 leading-loose text-white/80"
                style={{ textAlign: "justify" }}
              >
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