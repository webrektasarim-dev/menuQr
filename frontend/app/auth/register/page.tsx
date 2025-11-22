'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    businessName: '',
    password: '',
    confirmPassword: '',
  })

  const { mutate: register, isPending } = useMutation({
    mutationFn: async (data: {
      email: string
      businessName: string
      password: string
    }) => {
      const { data: response } = await api.post('/auth/register', data)
      return response
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('user', JSON.stringify(data.user))
      toast.success('Kayıt başarılı!')
      // Hard redirect to ensure token is saved before navigation
      setTimeout(() => {
        window.location.href = '/admin/dashboard'
      }, 100)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Kayıt başarısız!')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Şifreler eşleşmiyor!')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır!')
      return
    }

    register({
      email: formData.email,
      businessName: formData.businessName,
      password: formData.password,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">
          İşletme Kaydı
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-posta
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İşletme Adı
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) =>
                setFormData({ ...formData, businessName: e.target.value })
              }
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent"
              placeholder="Kahve Dünyası"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">
              En az 6 karakter olmalıdır
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifre Tekrar
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
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
            {isPending ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Zaten hesabınız var mı?{' '}
            <Link
              href="/auth/login"
              className="text-primary-accent hover:underline"
            >
              Giriş Yap
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

