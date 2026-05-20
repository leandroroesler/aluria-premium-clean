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
        "Uma fragrância sofisticada e delicada que combina a leveza do chá branco com o toque frutado e elegante da romã. Ideal para criar ambientes aconchegantes, relaxantes e refinados, trazendo sensação de conforto, frescor e bem-estar.",
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

          {/* PRODUTO 1 */}
          <div className="bg-[#f5efe8] rounded-[30px] overflow-hidden">

            <img
              src="/images/vela3vertiver.jpeg"
              className="h-[400px] w-full object-cover object-center"
            />

            <div className="p-8">

              <h3 className="text-3xl font-bold mb-4">
                Vertiver & Lírio
              </h3>

              <p className="text-[#6b5a4d] leading-6 mb-6 text-justify">
                Profundo, elegante e acolhedor. A união das notas terrosas do vetiver com a delicadeza do lírio cria uma atmosfera sofisticada, suave e envolvente.
              </p>

              <button
                onClick={() => setOpenProduct("vertiver")}
                className="border border-[#2d2218] px-6 py-3 rounded-full uppercase tracking-[0.2em] text-sm hover:bg-[#2d2218] hover:text-white transition"
              >
                Ver Produto
              </button>

            </div>

          </div>

        </div>

      </section>

    </main>

  );

}