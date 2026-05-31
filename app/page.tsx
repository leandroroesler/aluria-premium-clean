"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  const { addToCart, totalItems } = useCart();

  const [openProduct, setOpenProduct] = useState("");

  const [cartSuccessOpen, setCartSuccessOpen] =
    useState(false);

  const products = {

    vertiver: {
      title: "Vertiver & Lírio",
      price: 39.90,
      description:
        "Profundo, elegante e acolhedor. A união das notas terrosas do vetiver com a delicadeza do lírio cria uma atmosfera sofisticada, suave e envolvente.",
      notes:
        "Saída: cítricos suaves e folhas verdes. Corpo: lírio branco e nuances florais delicadas. Fundo: vetiver, musk e madeiras nobres.",
      duration: "20 a 25 horas de queima",
      weight: "100g",
      environment:
        "Salas de estar, quartos, halls e ambientes sofisticados com atmosfera aconchegante e elegante.",
      image: "/images/vela3vertiver.jpeg",
    },

    bamboo: {
      title: "Broto de Bamboo",
      price: 39.90,
      description:
        "Fresco, leve e sofisticado. Uma fragrância verde e serena que traduz a elegância do minimalismo e a sensação de bem-estar de um refúgio contemporâneo.",
      notes:
        "Saída: folhas verdes, bamboo fresco e bergamota. Corpo: chá branco e notas aquáticas suaves. Fundo: musk branco e madeiras leves.",
      duration: "20 a 25 horas de queima",
      weight: "100g",
      environment:
        "Lavabos, salas, escritórios, quartos e ambientes minimalistas que buscam frescor e sofisticação.",
      image: "/images/vela1broto.jpeg",
    },

    alecrim: {
      title: "Alecrim & Baunilha",
      price: 39.90,
      description:
        "Equilíbrio entre frescor e conforto. O toque aromático do alecrim encontra a cremosidade da baunilha em uma composição acolhedora, refinada e atemporal.",
      notes:
        "Saída: alecrim fresco e notas verdes aromáticas. Corpo: lavanda suave e ervas delicadas. Fundo: baunilha cremosa, musk e âmbar leve.",
      duration: "20 a 25 horas de queima",
      weight: "100g",
      environment:
        "Quartos, salas de leitura, espaços de relaxamento e ambientes que pedem aconchego e tranquilidade.",
      image: "/images/vela2alecrim.jpeg",
    },

    chaBrancoRoma: {
      title: "Chá Branco & Romã",
      price: 39.90,
      description:
        "Uma fragrância sofisticada e delicada que combina a leveza do chá branco com o toque frutado e elegante da romã. Ideal para criar ambientes aconchegantes, relaxantes e refinados.",
      notes:
        "Saída: romã fresca e acordes cítricos suaves. Corpo: chá branco e flores delicadas. Fundo: almíscar branco e madeiras suaves.",
      duration: "20 a 25 horas de queima",
      weight: "100g",
      environment:
        "Quartos, salas, lavabos, escritórios e ambientes sofisticados.",
      image: "/images/Cha_Branco_Roma.PNG",
    },

  };

  const product =
    products[
      openProduct as keyof typeof products
    ] || null;

  return (

    <main className="min-h-screen bg-[#f5efe8] text-[#2d2218]">

      {/* HEADER */}
      <header className="absolute left-0 top-0 z-50 flex w-full items-center justify-between px-10 py-8">

        <div className="flex items-center">

          <Image
            src="/images/logo-aluria.png"
            alt="Alúria Premium"
            width={420}
            height={140}
            priority
            className="object-contain"
            style={{
              width: "300px",
              height: "auto",
            }}
          />

        </div>

        <nav className="hidden gap-8 text-sm uppercase tracking-[0.2em] md:flex">

          <a href="#" className="transition hover:opacity-70">
            Home
          </a>

          <a
            href="#colecoes"
            className="transition hover:opacity-70"
          >
            Coleções
          </a>

          <Link
            href="/sobre"
            className="transition hover:opacity-70"
          >
            Sobre
          </Link>

          <Link
            href="/contato"
            className="transition hover:opacity-70"
          >
            Contato
          </Link>

        </nav>

        {/* CARRINHO */}
        <a
          href="/carrinho"
          className="relative flex items-center transition hover:scale-105"
        >

          <span className="text-2xl">
            🛒
          </span>

          <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#2d2218] text-xs text-white">
            {totalItems}
          </span>

        </a>

      </header>

      {/* HERO */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-36 text-center">

        <p className="max-w-3xl text-xl leading-relaxed text-[#6b5a4d] md:text-2xl">
          Transformando ambientes em experiências sofisticadas através de fragrâncias exclusivas e design elegante.
        </p>

        <a
          href="#colecoes"
          className="mt-12 inline-block rounded-full bg-[#2d2218] px-10 py-4 text-sm uppercase tracking-[0.2em] text-white transition hover:opacity-90"
        >
          Explorar Coleção
        </a>

      </section>

      {/* PRODUTOS */}
      <section
        id="colecoes"
        className="bg-white px-10 pt-14 pb-16"
      >

        <div className="mb-20 text-center">

          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#8a7768]">
            Coleção Signature
          </p>

          <h2 className="mb-6 text-4xl font-bold">
            Fragrâncias Exclusivas
          </h2>

          <p className="text-xl text-[#6b5a4d]">
            Desenvolvidas para criar atmosferas sofisticadas e memoráveis.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-4">

          {Object.entries(products).map(([key, product]) => (

            <div
              key={key}
              className="overflow-hidden rounded-[30px] bg-[#f5efe8]"
            >

              <img
                src={product.image}
                className="h-[400px] w-full object-cover object-center"
              />

              <div className="p-8">

                <h3 className="mb-4 text-3xl font-bold">
                  {product.title}
                </h3>

                <p className="mb-6 leading-6 text-[#6b5a4d] text-justify">
                  {product.description}
                </p>

                <button
                  onClick={() => setOpenProduct(key)}
                  className="rounded-full border border-[#2d2218] px-6 py-3 text-sm uppercase tracking-[0.2em] transition hover:bg-[#2d2218] hover:text-white"
                >
                  Ver Produto
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* EXPERIÊNCIA ALÚRIA */}
      <section className="bg-[#f5efe8] px-10 py-24">

        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">

          <div className="relative overflow-hidden rounded-[40px]">

            <img
              src="/images/vela3vertiver.jpeg"
              alt="Experiência Alúria Premium"
              className="h-[650px] w-full object-cover"
            />

          </div>

          <div>

            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#8a7768]">
              Experiência Alúria
            </p>

            <h2 className="mb-8 text-5xl font-bold leading-tight text-[#2d2218]">

              Fragrâncias desenvolvidas para transformar ambientes em experiências sofisticadas.

            </h2>

            <p className="mb-6 text-[17px] leading-8 text-[#6b5a4d]">

              Cada vela da Alúria Premium é produzida para criar atmosferas acolhedoras,
              elegantes e memoráveis. Uma combinação entre design minimalista,
              fragrâncias exclusivas e momentos de bem-estar.

            </p>

            <p className="mb-10 text-lg leading-relaxed text-[#6b5a4d]">

              Desenvolvemos composições olfativas sofisticadas que elevam a experiência
              dos ambientes e traduzem conforto, elegância e personalidade.

            </p>

            <Link
              href="/sobre"
              className="inline-flex rounded-full bg-[#2d2218] px-8 py-4 text-sm uppercase tracking-[0.2em] text-white transition hover:opacity-90"
            >

              Conheça nossa história

            </Link>

          </div>

        </div>

      </section>

      {/* DIFERENCIAIS */}
      <section className="bg-white px-10 py-24">

        <div className="mx-auto max-w-7xl">

          <div className="mb-20 text-center">

            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#8a7768]">
              Diferenciais Alúria
            </p>

            <h2 className="text-5xl font-bold text-[#2d2218]">
              Sofisticação em cada detalhe
            </h2>

          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-[30px] bg-[#f5efe8] p-10 text-center">

              <div className="mb-6 text-5xl">
                ✨
              </div>

              <h3 className="mb-4 text-2xl font-bold text-[#2d2218]">
                Produção Artesanal
              </h3>

              <p className="leading-relaxed text-[#6b5a4d]">
                Velas produzidas com cuidado em cada detalhe para proporcionar experiências sofisticadas e memoráveis.
              </p>

            </div>

            <div className="rounded-[30px] bg-[#f5efe8] p-10 text-center">

              <div className="mb-6 text-5xl">
                🌿
              </div>

              <h3 className="mb-4 text-2xl font-bold text-[#2d2218]">
                Fragrâncias Exclusivas
              </h3>

              <p className="leading-relaxed text-[#6b5a4d]">
                Combinações olfativas desenvolvidas para criar ambientes acolhedores, elegantes e sofisticados.
              </p>

            </div>

            <div className="rounded-[30px] bg-[#f5efe8] p-10 text-center">

              <div className="mb-6 text-5xl">
                📦
              </div>

              <h3 className="mb-4 text-2xl font-bold text-[#2d2218]">
                Entrega Segura
              </h3>

              <p className="leading-relaxed text-[#6b5a4d]">
                Embalagens cuidadosas e processo de envio pensado para garantir proteção e excelência.
              </p>

            </div>

            <div className="rounded-[30px] bg-[#f5efe8] p-10 text-center">

              <div className="mb-6 text-5xl">
                🔒
              </div>

              <h3 className="mb-4 text-2xl font-bold text-[#2d2218]">
                Pagamento Seguro
              </h3>

              <p className="leading-relaxed text-[#6b5a4d]">
                Ambiente protegido e pagamentos processados com segurança para uma experiência tranquila.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* BANNER EMOCIONAL */}
      <section className="relative h-[520px] overflow-hidden">

        <img
          src="/images/vela2alecrim.jpeg"
          alt="Alúria Premium"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">

          <p className="mb-6 text-sm uppercase tracking-[0.4em] text-white/80">
            Alúria Premium
          </p>

          <h2 className="mb-8 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">

            Transforme ambientes em experiências memoráveis.

          </h2>

          <p className="max-w-2xl text-lg leading-relaxed text-white/80">

            Fragrâncias sofisticadas desenvolvidas para criar atmosferas acolhedoras,
            elegantes e emocionalmente marcantes.

          </p>

          <a
            href="#colecoes"
            className="mt-10 inline-flex rounded-full border border-white px-8 py-4 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[#2d2218]"
          >

            Explorar Coleção

          </a>

        </div>

      </section>

      {/* FOOTER PREMIUM */}
      <footer className="bg-[#2d2218] px-8 py-16 text-[#d8cfc5]">

        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">

          <h3 className="mb-5 text-4xl font-semibold text-white">
            Aluria Premium
          </h3>

          <div className="mb-8 h-[1px] w-20 bg-[#b89574]" />

          <p className="max-w-3xl text-[17px] leading-[1.9] text-[#d8cfc5]">

            Velas aromáticas premium desenvolvidas para transformar ambientes
            em experiências sofisticadas. Unimos fragrâncias exclusivas,
            produção artesanal e design minimalista para criar momentos
            de bem-estar, conforto e elegância.

          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-10 text-[18px]">

            <Link
              href="/sobre"
              className="transition hover:text-white"
            >
              Nossa História
            </Link>

            <Link
              href="/contato"
              className="transition hover:text-white"
            >
              Fale Conosco
            </Link>

            <a
              href="https://wa.me/5548999567140"
              target="_blank"
              className="transition hover:text-white"
            >
              WhatsApp
            </a>

            <a
              href="mailto:contato@aluriapremium.com.br"
              className="transition hover:text-white"
            >
              E-mail
            </a>

          </div>

          <div className="mt-14 w-full border-t border-[#ffffff15] pt-8 text-sm text-[#b8aea4]">

            © 2026 Aluria Premium. Todos os direitos reservados.

          </div>

        </div>

      </footer>

      {/* MODAL PRODUTO */}
      {product && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            overflow-y-auto
           bg-black/50
            backdrop-blur-sm
            p-4
          "
         >

          <div className="relative w-full max-w-[380px] max-h-[90vh] overflow-y-auto rounded-[28px] bg-white shadow-2xl">

            <button
              onClick={() => setOpenProduct("")}
              className="
              absolute
              right-5
              top-5
              z-50
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
            bg-white
              shadow-md
              text-2xl
            text-[#2d2218]
        "
            >
              ×
            </button>

            <div className="flex flex-col">

              <div className="bg-white">

              <img
                src={product.image}
                className="w-full h-auto object-contain"
              />

          </div>

              <div className="p-5">

                <h2 className="mb-3 text-2xl font-bold text-[#2d2218]">
                  {product.title}
                </h2>

                <p className="mb-6 leading-relaxed text-[#6b5a4d]">
                  {product.description}
                </p>

                <div className="mb-4 space-y-3 border-y border-[#e7ddd3] py-4">

                  <div>
                    <h4 className="mb-2 text-sm uppercase tracking-[0.2em] text-[#8a7768]">
                      Notas Olfativas
                    </h4>

                    <p className="leading-relaxed text-[#6b5a4d]">
                      {product.notes}
                    </p>
                  </div>

                  <div>

                    <div>

                      <h4 className="mb-2 text-sm uppercase tracking-[0.2em] text-[#8a7768]">
                        Especificações
                      </h4>

                      <p className="text-[#6b5a4d]">
                        {product.weight} • {product.duration}
                      </p>

                    </div>

                  </div>

                </div>

                <div className="mb-8 flex items-center justify-between">

                  <span className="text-2xl font-bold text-[#2d2218]">
                    R$ {product.price.toFixed(2)}
                  </span>

                </div>

                <button
                  onClick={() => {

                      addToCart({
                        id: openProduct,
                        title: product.title,
                        price: product.price,
                        image: product.image,
                        quantity: 1,
                });

                setCartSuccessOpen(true);

                setTimeout(() => {
                  setCartSuccessOpen(false);
                }, 2500);
        }}
        className="w-full rounded-full bg-[#2d2218] py-4 text-sm uppercase tracking-[0.2em] text-white transition hover:opacity-90"
    >
        Adicionar ao Carrinho
    </button>

                <a
                  href="/checkout"
                  className="mt-3 block w-full rounded-full border border-[#2d2218] py-4 text-center text-sm uppercase tracking-[0.2em] text-[#2d2218] transition hover:bg-[#2d2218] hover:text-white"
                >

                  Finalizar Compra

                </a>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ALERTA CARRINHO */}
      {cartSuccessOpen && (

        <div className="fixed bottom-8 right-8 z-[999] rounded-full bg-[#2d2218] px-6 py-4 text-white shadow-2xl">

          Produto adicionado ao carrinho

        </div>

      )}

    </main>

  );

}