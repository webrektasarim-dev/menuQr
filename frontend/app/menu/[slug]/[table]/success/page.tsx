'use client'

import { use } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

interface SuccessPageProps {
  params: Promise<{ slug: string; table: string }>
}

export default function SuccessPage({ params }: SuccessPageProps) {
  const { slug, table } = use(params)

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-primary mb-4">
          Sipariş Alındı!
        </h1>
        <p className="text-gray-600 mb-6">
          Siparişiniz başarıyla oluşturuldu. Yakında hazır olacaktır.
        </p>
        <Link
          href={`/menu/${slug}/${table}`}
          className="inline-block bg-primary-accent text-white px-6 py-3 rounded-lg hover:bg-primary-accent/90 transition font-semibold"
        >
          Menüye Dön
        </Link>
      </div>
    </div>
  )
}

