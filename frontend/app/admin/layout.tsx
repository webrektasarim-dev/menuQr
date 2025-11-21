'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (!token && pathname?.startsWith('/admin')) {
      router.push('/auth/login')
    }
  }, [router, pathname])

  return <>{children}</>
}

