"use client";

import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function Home() {

  const { addToCart, totalItems } = useCart();

  const [openProduct, setOpenProduct] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);

  const [cartSuccessOpen, setCartSuccessOpen] =
    useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);

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

    cerejaeavela: {
      title: "Cereja & Avelã",
      price: 39.90,
      description:
        "Delicada, envolvente e sofisticada. A combinação do toque frutado da cereja com a cremosidade suave da avelã cria uma atmosfera acolhedora, elegante e irresistivelmente confortável.",
      notes:
        "Saída: cereja madura e nuances frutadas delicadas. Corpo: amêndoas suaves e acordes cremosos de avelã. Fundo: baunilha aveludada, musk branco e madeiras leves.",
      duration: "20 a 25 horas de queima",
      weight: "100g",
      environment:
        "Quartos, salas de estar, lounges, closets e ambientes sofisticados que valorizam sensações de conforto, bem-estar e acolhimento através de uma fragrância envolvente e elegante.",
      image: "/images/Cereja_e_Avela.png",
    },

    lavanda: {
      title: "Lavanda",
      price: 39.90,
      description:
        "Serena, elegante e reconfortante. As notas aromáticas da lavanda criam uma atmosfera de tranquilidade e bem-estar, perfeita para momentos de relaxamento e equilíbrio.",
      notes:
        "Saída: notas herbais frescas e lavanda provençal. Corpo: lavanda floral e nuances aromáticas suaves. Fundo: musk branco e madeiras delicadas.",
      duration: "20 a 25 horas de queima",
      weight: "100g",
      environment:
        "Quartos, salas de descanso, espaços de leitura, spas e ambientes que valorizam serenidade, conforto e bem-estar.",
      image: "/images/Lavanda 3.png",
},

  };

    const heroImages = [
    "/images/Lavanda 3.png",
    "/images/Cereja_e_Avela.png",
    "/images/Cha_Branco_Roma.PNG",
    "/images/vela3vertiver.jpeg",
    "/images/vela1broto.jpeg",
  ];

    useEffect(() => {

    const interval = setInterval(() => {

      setCurrentSlide((prev) =>

        prev === heroImages.length - 1
          ? 0
          : prev + 1

      );

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  const product =
    products[
      openProduct as keyof typeof products
    ] || null;

  return (

    <main className="min-h-screen bg-[#f5efe8] text-[#2d2218]">

      {/* HEADER */}
      <header className="absolute left-0 top-0 z-50 flex w-full items-center justify-between px-6 md:px-10 py-6 md:py-8">

        <div className="flex items-center">

          <button
            onClick={() => setMenuOpen(true)}
            className="mr-4 text-3xl md:hidden text-white drop-shadow-[0_0_12px_rgba(0,0,0,0.9)]"
          >
            ☰
          </button>

            <Image
              src="/images/logo-aluria-3.png"
              alt="Alúria Premium"
              width={420}
              height={140}
              priority
              className="object-contain w-[260px] md:w-[380px] h-auto drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]"
            />

        </div>

        
        <nav className="hidden gap-8 text-sm uppercase tracking-[0.2em] text-white md:flex">

          <a href="#" className="text-white transition hover:opacity-80">
            Home
          </a>

          <a
            href="#colecoes"
            className="text-white transition hover:opacity-80"
          >
            Coleções
          </a>

          <Link
            href="/sobre"
            className="text-white transition hover:opacity-80"
          >
            Sobre
          </Link>

          <Link
            href="/contato"
            className="text-white transition hover:opacity-80"
          >
            Contato
          </Link>

        </nav>

        {/* CARRINHO */}
        <a
          href="/carrinho"
          className="relative z-50 flex items-center transition hover:scale-105"
        >

          <ShoppingBag
            size={32}
            className="text-white drop-shadow-[0_0_12px_rgba(0,0,0,0.9)]"
          />

          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#2d2218] text-xs font-semibold text-white shadow-lg">
            {totalItems}
          </span>

        </a>

      </header>

      {menuOpen && (

  <div className="fixed inset-0 z-[999] bg-[#f8f4ef]">

    <button
      onClick={() => setMenuOpen(false)}
      className="absolute right-6 top-6 text-4xl text-[#2d2218]"
    >
      ×
    </button>

    <div className="flex h-full flex-col items-center justify-center gap-10">

      <a
        href="#"
        onClick={() => setMenuOpen(false)}
        className="text-xl uppercase tracking-[0.3em]"
      >
        Home
      </a>

      <a
        href="#colecoes"
        onClick={() => setMenuOpen(false)}
        className="text-xl uppercase tracking-[0.3em]"
      >
        Coleções
      </a>

      <Link
        href="/sobre"
        onClick={() => setMenuOpen(false)}
        className="text-xl uppercase tracking-[0.3em]"
      >
        Sobre
      </Link>

      <Link
        href="/contato"
        onClick={() => setMenuOpen(false)}
        className="text-xl uppercase tracking-[0.3em]"
      >
        Contato
      </Link>

    </div>

  </div>

)}

      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">

        {heroImages.map((image, index) => (

          <img
            key={image}
            src={image}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms]
            ${
              currentSlide === index
                ? "opacity-100"
                : "opacity-0"
            }`}
          />

        ))}

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 px-6 text-center text-white mt-24 md:mt-32">

          <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-bold leading-tight md:text-6xl xl:text-7xl">

            Transforme ambientes em experiências memoráveis

          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed md:text-xl text-white/90">

            Velas aromáticas artesanais criadas para proporcionar conforto,
            elegância e bem-estar em cada momento.

          </p>

          <a
            href="#colecoes"
            className="mt-12 inline-block rounded-full border border-white px-10 py-4 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[#2d2218]"
          >
            Explorar Coleção
          </a>

        </div>

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
      <section className="bg-[#f5efe8] px-6 md:px-10 py-16 md:py-20">

        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">

          <div className="mx-auto w-full max-w-[620px] overflow-hidden rounded-[40px]">

            <img
            src="/images/vela3vertiver.jpeg"
            alt="Experiência Alúria Premium"
            className="w-full h-auto object-contain"
          />

        </div>

          <div>

            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#8a7768]">
              Experiência Alúria
            </p>

            <h2 className="mb-6 text-3xl md:text-[52px] font-bold leading-tight text-[#2d2218]">

              Mais do que fragrâncias. Uma experiência sensorial completa.

            </h2>

            <p className="mb-6 text-[17px] leading-8 text-[#6b5a4d] text-justify">

              Na Alúria Premium, cada vela é desenvolvida para unir fragrância, design e bem-estar em uma experiência única. Criamos peças que elevam a atmosfera dos ambientes e tornam momentos simples mais especiais.

            </p>

            <p className="mb-10 text-lg leading-relaxed text-[#6b5a4d] text-justify">

              Da seleção das essências ao acabamento artesanal, cada detalhe é pensado para proporcionar conforto, autenticidade e elegância em cada ambiente.

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


      {/* CERA DE COCO PREMIUM */}
<section className="bg-white px-6 md:px-10 py-20 md:py-24">

  <div className="mx-auto max-w-7xl">

    {/* CABEÇALHO */}
    <div className="mb-16 md:mb-20 text-center">

      <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#8a7768]">
        Cera de Coco Premium
      </p>

      <h2 className="mb-6 text-4xl md:text-5xl font-bold text-[#2d2218]">
        A Diferença Está na Cera
      </h2>

      <p className="mx-auto max-w-3xl text-lg md:text-xl leading-relaxed text-[#6b5a4d]">
        Utilizamos cera de coco premium para proporcionar uma queima mais limpa, melhor desempenho aromático e uma experiência sensorial superior em cada detalhe.
      </p>

    </div>

    {/* CARDS */}
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

      <div className="rounded-[30px] bg-[#f5efe8] p-8 text-center">

        <div className="mb-5 text-5xl">
          🌿
        </div>

        <h3 className="mb-4 text-2xl font-bold text-[#2d2218]">
          Origem Vegetal
        </h3>

        <p className="leading-relaxed text-[#6b5a4d] text-justify">
          Produzida a partir do coco, uma matéria-prima renovável que oferece
          uma alternativa mais sustentável às ceras tradicionais.
        </p>

      </div>

      <div className="rounded-[30px] bg-[#f5efe8] p-8 text-center">

        <div className="mb-5 text-5xl">
          ✨
        </div>

        <h3 className="mb-4 text-2xl font-bold text-[#2d2218]">
          Queima Mais Limpa
        </h3>

        <p className="leading-relaxed text-[#6b5a4d] text-justify">
          Menor emissão de resíduos e combustão mais uniforme, proporcionando
          uma experiência mais agradável dentro do ambiente.
        </p>

      </div>

      <div className="rounded-[30px] bg-[#f5efe8] p-8 text-center">

        <div className="mb-5 text-5xl">
          🌸
        </div>

        <h3 className="mb-4 text-2xl font-bold text-[#2d2218]">
          Melhor Difusão
        </h3>

        <p className="leading-relaxed text-[#6b5a4d] text-justify">
          Liberação gradual das fragrâncias, permitindo que os aromas sejam
          percebidos de forma elegante e equilibrada.
        </p>

      </div>

      <div className="rounded-[30px] bg-[#f5efe8] p-8 text-center">

        <div className="mb-5 text-5xl">
          🕯️
        </div>

        <h3 className="mb-4 text-2xl font-bold text-[#2d2218]">
          Experiência Premium
        </h3>

        <p className="leading-relaxed text-[#6b5a4d] text-justify">
          Combinação ideal entre desempenho, acabamento e sofisticação para
          transformar qualquer ambiente.
        </p>

      </div>

    </div>

    {/* TABELA */}
    <div className="mt-16 md:mt-20 overflow-hidden rounded-[30px] border border-[#e7ddd3]">

      <div className="overflow-x-auto">

        <table className="w-full min-w-[650px]">

          <thead>

            <tr className="bg-[#f5efe8]">

              <th className="px-6 py-5 text-left text-sm uppercase tracking-[0.2em] text-[#8a7768]">
                Característica
              </th>

              <th className="px-6 py-5 text-left text-sm uppercase tracking-[0.2em] text-[#8a7768]">
                Cera de Coco Premium
              </th>

              <th className="px-6 py-5 text-left text-sm uppercase tracking-[0.2em] text-[#8a7768]">
                Parafina Tradicional
              </th>

            </tr>

          </thead>

          <tbody>

            <tr className="border-t border-[#e7ddd3]">
              <td className="px-6 py-4 font-medium">Origem</td>
              <td className="px-6 py-4">Vegetal</td>
              <td className="px-6 py-4">Derivada do petróleo</td>
            </tr>

            <tr className="border-t border-[#e7ddd3]">
              <td className="px-6 py-4 font-medium">Queima</td>
              <td className="px-6 py-4">Mais limpa e uniforme</td>
              <td className="px-6 py-4">Pode gerar mais resíduos</td>
            </tr>

            <tr className="border-t border-[#e7ddd3]">
              <td className="px-6 py-4 font-medium">Difusão do Aroma</td>
              <td className="px-6 py-4">Excelente</td>
              <td className="px-6 py-4">Moderada</td>
            </tr>

            <tr className="border-t border-[#e7ddd3]">
              <td className="px-6 py-4 font-medium">Sustentabilidade</td>
              <td className="px-6 py-4">Alta</td>
              <td className="px-6 py-4">Baixa</td>
            </tr>

            <tr className="border-t border-[#e7ddd3]">
              <td className="px-6 py-4 font-medium">Experiência Sensorial</td>
              <td className="px-6 py-4">Premium</td>
              <td className="px-6 py-4">Convencional</td>
            </tr>

          </tbody>

        </table>

        <div className="mt-12 text-center">

        </div>

      </div>

    </div>

    {/* FECHAMENTO */}
    <div className="mx-auto mt-14 md:mt-16 max-w-4xl text-center">

      <p className="text-lg md:text-xl leading-relaxed text-[#6b5a4d]">

        Cada vela Alúria é desenvolvida para unir fragrâncias exclusivas,
        design elegante e cera de coco premium em uma experiência sensorial
        criada para transformar momentos simples em ocasiões especiais.

      </p>

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
              O cuidado está nos detalhes
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

              <p className="leading-relaxed text-[#6b5a4d] text-justify">
                Velas produzidas com cuidado em cada detalhe para proporcionar experiências sofisticadas e memoráveis.
              </p>

            </div>

            <div className="rounded-[30px] bg-[#f5efe8] p-10 text-center">

              <div className="mb-6 text-5xl">
                🌿
              </div>

              <h3 className="mb-4 text-2xl font-bold text-[#2d2218]">
                  Cera de Coco Premium
                </h3>

              <p className="leading-relaxed text-[#6b5a4d] text-justify">
                Utilizamos cera de coco premium para proporcionar uma queima mais limpa,
                excelente difusão das fragrâncias e uma experiência superior em cada vela.
              </p>

            </div>

            <div className="rounded-[30px] bg-[#f5efe8] p-10 text-center">

              <div className="mb-6 text-5xl">
                📦
              </div>

              <h3 className="mb-4 text-2xl font-bold text-[#2d2218]">
                Entrega Segura
              </h3>

              <p className="leading-relaxed text-[#6b5a4d] text-justify">
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

              <p className="leading-relaxed text-[#6b5a4d] text-justify">
                Ambiente protegido e pagamentos processados com segurança para uma experiência tranquila.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* BANNER EMOCIONAL */}
      <section className="relative h-[500px] md:h-[650px] overflow-hidden">

        <img
          src="/images/Cereja_e_Avela_2.png"
          alt="Alúria Premium"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 md:px-12">

          <div className="max-w-2xl text-white">

            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-white/80">
              Descubra sua fragrância
            </p>

            <h2 className="mb-6 text-4xl md:text-6xl font-bold leading-tight">
              Cada fragrância conta uma história diferente.
            </h2>

            <p className="max-w-xl text-base md:text-lg leading-relaxed text-white/85 text-justify">
              Das notas relaxantes da lavanda aos aromas envolventes do vetiver,
              cada coleção foi desenvolvida para criar sensações únicas e
              transformar a atmosfera dos ambientes.
            </p>

            <a
              href="#colecoes"
              className="mt-10 inline-flex rounded-full border border-white px-8 py-4 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[#2d2218]"
            >
              Escolher Minha Fragrância
            </a>

          </div>

        </div>

      </section>

      {/* FOOTER PREMIUM */}
      <footer className="bg-[#2d2218] px-8 py-16 text-[#d8cfc5]">

        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">

          <h3 className="mb-4 text-3xl md:text-4xl font-semibold text-white">
              Alúria Premium
            </h3>

          <div className="mb-8 h-[1px] w-20 bg-[#b89574]" />

          <p className="max-w-2xl text-[17px] leading-[1.9] text-[#d8cfc5]">
            Transformando ambientes em experiências sofisticadas através de
            fragrâncias exclusivas, design elegante e produção artesanal.
          </p>

          <div className="mt-14 grid gap-12 text-center md:grid-cols-3">

        <div>

          <h4 className="mb-4 text-sm uppercase tracking-[0.25em] text-[#b89574]">
            Navegação
          </h4>

              <div className="flex flex-col gap-3">

                <a href="#colecoes">
                  Coleções
                </a>

                <Link href="/sobre">
                  Nossa História
                </Link>

                <Link href="/contato">
                  Contato
                </Link>

              </div>

            </div>

            <div>

              <h4 className="mb-4 text-sm uppercase tracking-[0.25em] text-[#b89574]">
                Atendimento
              </h4>

              <div className="flex flex-col gap-3">

                <a
                  href="https://wa.me/5548999567140"
                  target="_blank"
                >
                  WhatsApp
                </a>

                <a href="mailto:contato@aluriapremium.com.br">
                  contato@aluriapremium.com.br
                </a>

              </div>

            </div>

            <div>

              <h4 className="mb-4 text-sm uppercase tracking-[0.25em] text-[#b89574]">
                Confiança
              </h4>

              <div className="flex flex-col gap-3">

                <span>
                  Pagamento Seguro
                </span>

                <span>
                  Checkout Protegido
                </span>

              </div>

            </div>

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

                <p className="mb-6 leading-relaxed text-[#6b5a4d] text-justify">
                  {product.description}
                </p>

                <div className="mb-4 space-y-3 border-y border-[#e7ddd3] py-4">

                  <div>
                    <h4 className="mb-2 text-sm uppercase tracking-[0.2em] text-[#8a7768]">
                      Notas Olfativas
                    </h4>

                    <p className="leading-relaxed text-[#6b5a4d] text-justify">
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