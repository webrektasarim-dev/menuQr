'use client'

import { useState } from 'react'

interface Category {
  id: string
  name: string
  icon?: string
}

interface CategoryTabsProps {
  categories: Category[]
  activeCategory: string | null
  onSelectCategory: (categoryId: string | null) => void
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-6 sticky top-0 bg-primary-light z-10 pt-4">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
          activeCategory === null
            ? 'bg-primary-accent text-white'
            : 'bg-white text-primary hover:bg-gray-100'
        }`}
      >
        Tümü
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition flex items-center gap-2 ${
            activeCategory === category.id
              ? 'bg-primary-accent text-white'
              : 'bg-white text-primary hover:bg-gray-100'
          }`}
        >
          {category.icon && <span>{category.icon}</span>}
          {category.name}
        </button>
      ))}
    </div>
  )
}

