'use client'

import Link from 'next/link'

export default function PremiumHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-[#f8f6f3]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        <Link
          href="/"
          className="
            text-sm
            tracking-[0.35em]
            uppercase
            text-black/80
            hover:text-black
            transition-colors
            duration-300
          "
        >
          Aluria Premium
        </Link>

        <Link
          href="/"
          className="
            flex
            items-center
            gap-2
            text-sm
            text-black/60
            hover:text-black
            transition-all
            duration-300
          "
        >
          <span>←</span>
          <span>Voltar para Home</span>
        </Link>

      </div>
    </header>
  )
}