'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { mutate: login, isPending } = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const { data: response } = await api.post('/auth/login', data)
      return response
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('user', JSON.stringify(data.user))
      toast.success('Giriş başarılı!')
      // Hard redirect to ensure token is saved before navigation
      setTimeout(() => {
        window.location.href = '/admin/dashboard'
      }, 100)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Giriş başarısız!')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">
          İşletme Girişi
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary-accent text-white py-3 rounded-lg hover:bg-primary-accent/90 transition font-semibold disabled:opacity-50"
          >
            {isPending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Hesabınız yok mu?{' '}
            <Link
              href="/auth/register"
              className="text-primary-accent hover:underline"
            >
              Kayıt Ol
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-primary-accent"
          >
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  )
}

