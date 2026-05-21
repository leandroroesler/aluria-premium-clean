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
        "Uma fragrância sofisticada e delicada que combina a leveza do chá branco com o toque frutado e elegante da romã.",
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
      <header className="w-full flex items-center justify-between px-10 py-8 absolute top-0 left-0 z-50">

        <div className="flex items-center">

          <Image
            src="/images/logo-aluria.png"
            alt="Alúria Velas Aromáticas"
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

        <nav className="hidden md:flex gap-8 text-sm uppercase tracking-[0.2em]">

          <a href="#" className="hover:opacity-70 transition">
            Home
          </a>

          <a
            href="#colecoes"
            className="hover:opacity-70 transition"
          >
            Coleções
          </a>

          <Link
            href="/sobre"
            className="hover:opacity-70 transition"
          >
            Sobre
          </Link>

          <Link
            href="/contato"
            className="hover:opacity-70 transition"
          >
            Contato
          </Link>

        </nav>

        {/* CARRINHO */}
        <a
          href="/carrinho"
          className="relative flex items-center hover:scale-105 transition"
        >

          <span className="text-2xl">
            🛒
          </span>

          <span className="absolute -top-2 -right-3 bg-[#2d2218] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {totalItems}
          </span>

        </a>

      </header>

      {/* HERO */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6">

        <p className="uppercase tracking-[0.3em] text-sm text-[#8a7768] mb-6">
          Velas Aromáticas Premium
        </p>

        <h1 className="text-6xl md:text-8xl font-bold mb-8">
          Aluria Premium
        </h1>

        <p className="text-xl md:text-2xl max-w-3xl text-[#6b5a4d] leading-relaxed">
          Transformando ambientes em experiências sofisticadas através de fragrâncias exclusivas e design elegante.
        </p>

        <a
          href="#colecoes"
          className="mt-12 inline-block bg-[#2d2218] text-white px-10 py-4 rounded-full text-sm uppercase tracking-[0.2em] hover:opacity-90 transition"
        >
          Explorar Coleção
        </a>

      </section>

      {/* PRODUTOS */}
      <section
        id="colecoes"
        className="px-10 py-24 bg-white"
      >

        <div className="text-center mb-20">

          <p className="uppercase tracking-[0.3em] text-sm text-[#8a7768] mb-4">
            Coleção Signature
          </p>

          <h2 className="text-4xl font-bold mb-6">
            Fragrâncias Exclusivas
          </h2>

          <p className="text-[#6b5a4d] text-xl">
            Desenvolvidas para criar atmosferas sofisticadas e memoráveis.
          </p>

        </div>

        <div className="grid md:grid-cols-4 gap-8">

          {Object.entries(products).map(([key, product]) => (

            <div
              key={key}
              className="bg-[#f5efe8] rounded-[30px] overflow-hidden"
            >

              <img
                src={product.image}
                className="h-[400px] w-full object-cover object-center"
              />

              <div className="p-8">

                <h3 className="text-3xl font-bold mb-4">
                  {product.title}
                </h3>

                <p className="text-[#6b5a4d] leading-6 mb-6 text-justify">
                  {product.description}
                </p>

                <button
                  onClick={() => setOpenProduct(key)}
                  className="border border-[#2d2218] px-6 py-3 rounded-full uppercase tracking-[0.2em] text-sm hover:bg-[#2d2218] hover:text-white transition"
                >
                  Ver Produto
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* EXPERIÊNCIA ALÚRIA */}
      <section className="bg-[#f5efe8] px-10 py-28">

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

            <h2 className="mb-8 text-5xl leading-tight font-bold text-[#2d2218]">

              Fragrâncias desenvolvidas para transformar ambientes em experiências sofisticadas.

            </h2>

            <p className="mb-8 text-lg leading-relaxed text-[#6b5a4d]">

              Cada vela da Alúria Premium é produzida para criar atmosferas acolhedoras,
              elegantes e memoráveis.

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
      <section className="bg-white px-10 py-28">

        <div className="mx-auto max-w-7xl">

          <div className="text-center mb-20">

            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#8a7768]">
              Diferenciais Alúria
            </p>

            <h2 className="text-5xl font-bold text-[#2d2218]">
              Sofisticação em cada detalhe
            </h2>

          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-[30px] bg-[#f5efe8] p-10 text-center">
              <div className="mb-6 text-5xl">✨</div>
              <h3 className="mb-4 text-2xl font-bold">
                Produção Artesanal
              </h3>
              <p className="leading-relaxed text-[#6b5a4d]">
                Velas produzidas com cuidado em cada detalhe.
              </p>
            </div>

            <div className="rounded-[30px] bg-[#f5efe8] p-10 text-center">
              <div className="mb-6 text-5xl">🌿</div>
              <h3 className="mb-4 text-2xl font-bold">
                Fragrâncias Exclusivas
              </h3>
              <p className="leading-relaxed text-[#6b5a4d]">
                Composições olfativas sofisticadas e memoráveis.
              </p>
            </div>

            <div className="rounded-[30px] bg-[#f5efe8] p-10 text-center">
              <div className="mb-6 text-5xl">📦</div>
              <h3 className="mb-4 text-2xl font-bold">
                Entrega Segura
              </h3>
              <p className="leading-relaxed text-[#6b5a4d]">
                Embalagens cuidadosas e envio protegido.
              </p>
            </div>

            <div className="rounded-[30px] bg-[#f5efe8] p-10 text-center">
              <div className="mb-6 text-5xl">🔒</div>
              <h3 className="mb-4 text-2xl font-bold">
                Pagamento Seguro
              </h3>
              <p className="leading-relaxed text-[#6b5a4d]">
                Ambiente protegido para uma compra tranquila.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* BANNER EMOCIONAL */}
      <section className="relative h-[700px] overflow-hidden">

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

          <h2 className="mb-8 max-w-4xl text-5xl leading-tight font-bold md:text-7xl">
            Transforme ambientes em experiências memoráveis.
          </h2>

          <p className="max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
            Fragrâncias sofisticadas desenvolvidas para criar atmosferas acolhedoras e elegantes.
          </p>

        </div>

      </section>

      {/* FOOTER PREMIUM */}
      <footer className="bg-[#2d2218] px-10 py-24 text-[#d8cfc5]">

        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-4">

          {/* BRAND */}
          <div>

            <h3 className="mb-6 text-3xl font-bold text-white">
              Aluria Premium
            </h3>

            <p className="leading-relaxed text-[#d8cfc5]">
              Velas aromáticas premium desenvolvidas para transformar ambientes em experiências sofisticadas.
            </p>

          </div>

          {/* NAVEGAÇÃO */}
          <div>

            <h4 className="mb-6 text-lg font-semibold text-white">
              Navegação
            </h4>

            <div className="flex flex-col gap-4">

              <a href="#">
                Home
              </a>

              <a href="#colecoes">
                Coleções
              </a>

              <Link href="/sobre">
                Sobre
              </Link>

              <Link href="/contato">
                Contato
              </Link>

            </div>

          </div>

          {/* ATENDIMENTO */}
          <div>

            <h4 className="mb-6 text-lg font-semibold text-white">
              Atendimento
            </h4>

            <div className="flex flex-col gap-4">

              <p>
                leandroroesler@gmail.com
              </p>

              <p>
                (48) 99956-7140
              </p>

              <p>
                Segunda à Sexta
              </p>

            </div>

          </div>

          {/* SOCIAL */}
          <div>

            <h4 className="mb-6 text-lg font-semibold text-white">
              Institucional
            </h4>

            <div className="flex flex-col gap-4">

              <a href="#">
                Instagram
              </a>

              <Link href="/sobre">
                Nossa História
              </Link>

              <Link href="/contato">
                Fale Conosco
              </Link>

            </div>

          </div>

        </div>

        <div className="mx-auto mt-20 max-w-7xl border-t border-white/10 pt-8 text-center text-sm text-[#b8aea4]">

          © 2026 Aluria Premium. Todos os direitos reservados.

        </div>

      </footer>

    </main>

  );

}