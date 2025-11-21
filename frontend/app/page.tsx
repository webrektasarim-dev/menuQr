import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-light to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-primary mb-4">
            CafeQR
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            QR ile hızlı menü, daha az bekleyiş — daha fazla sipariş
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/login"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              İşletme Girişi
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-primary-accent text-white rounded-lg hover:bg-primary-accent/90 transition"
            >
              Hemen Başla
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

