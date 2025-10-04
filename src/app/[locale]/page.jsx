'use client'
import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import {
  fetchEda,
  fetchTexnika,
  fetchMebel,
  fetchBuketi,
  fetchProdukti,
  fetchKnigi
} from '@/store/slices/appSlice'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Header from './header'

export default function Home() {
  const dispatch = useDispatch()
  const router = useRouter()
  const t = useTranslations()

  const [selectedCategory, setSelectedCategory] = useState('vse')
  const [searchQuery, setSearchQuery] = useState('')

  // Данные из Redux
  const eda = useSelector(state => state.app.eda)
  const texnika = useSelector(state => state.app.texnika)
  const mebel = useSelector(state => state.app.mebel)
  const buketi = useSelector(state => state.app.buketi)
  const produkti = useSelector(state => state.app.produkti)
  const knigi = useSelector(state => state.app.knigi)

  const loading = useSelector(state =>
    selectedCategory === 'eda' ? state.app.edaLoading :
      selectedCategory === 'texnika' ? state.app.texnikaLoading :
        selectedCategory === 'mebel' ? state.app.mebelLoading :
          selectedCategory === 'buketi' ? state.app.buketiLoading :
            selectedCategory === 'produkti' ? state.app.produktiLoading :
              selectedCategory === 'knigi' ? state.app.knigiLoading :
                false
  )

  const error = useSelector(state =>
    selectedCategory === 'eda' ? state.app.edaError :
      selectedCategory === 'texnika' ? state.app.texnikaError :
        selectedCategory === 'mebel' ? state.app.mebelError :
          selectedCategory === 'buketi' ? state.app.buketiError :
            selectedCategory === 'produkti' ? state.app.produktiError :
              selectedCategory === 'knigi' ? state.app.knigiError :
                null
  )

  const allItems = [...eda, ...texnika, ...mebel, ...buketi, ...produkti, ...knigi]

  // Функция для обработки поиска
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  // Фильтрация товаров по поисковому запросу
  const filteredItems = useMemo(() => {
    let items = selectedCategory === 'vse'
      ? allItems
      : selectedCategory === 'eda' ? eda :
        selectedCategory === 'texnika' ? texnika :
          selectedCategory === 'mebel' ? mebel :
            selectedCategory === 'buketi' ? buketi :
              selectedCategory === 'produkti' ? produkti :
                selectedCategory === 'knigi' ? knigi :
                  []

    // Применяем поиск, если есть запрос
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query))
      )
    }

    return items
  }, [selectedCategory, searchQuery, allItems, eda, texnika, mebel, buketi, produkti, knigi])

  useEffect(() => {
    // Загружаем только нужную категорию
    switch (selectedCategory) {
      case 'eda':
        dispatch(fetchEda())
        break
      case 'texnika':
        dispatch(fetchTexnika())
        break
      case 'mebel':
        dispatch(fetchMebel())
        break
      case 'buketi':
        dispatch(fetchBuketi())
        break
      case 'produkti':
        dispatch(fetchProdukti())
        break
      case 'knigi':
        dispatch(fetchKnigi())
        break
      case 'vse':
        // При "все" загружаем всё, но только если еще не загружено
        dispatch(fetchEda())
        dispatch(fetchTexnika())
        dispatch(fetchMebel())
        dispatch(fetchBuketi())
        dispatch(fetchProdukti())
        dispatch(fetchKnigi())
        break
      default:
        break
    }
  }, [dispatch, selectedCategory])

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
  }

  const handleProductClick = (productId) => {
    router.push(`/info/${productId}`)
  }

  return (
    <>
      <Header onSearch={handleSearch} />
      <main className="min-h-screen bg-gray-50/30">
        <div className="w-[85%] mx-auto pt-24 pb-16">
          <h1 className="text-3xl font-semibold text-gray-900 mb-8">{t('home')}</h1>

          {/* Показываем результаты поиска */}
          {searchQuery && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                {t('searchResults') || `Результаты поиска для: "${searchQuery}"`}
                {filteredItems.length > 0 && ` ${t("found")} ${filteredItems.length}`}
              </p>
            </div>
          )}

          {/* Категории */}
          <div className="mb-12">
            <h1 className="text-xl font-medium text-gray-900 mb-4">{t('kategorii')}</h1>
            <div className="flex items-center gap-3 p-6 rounded-2xl mx-auto overflow-y-scroll bg-white border border-gray-200 shadow-sm">
              {['vse', 'eda', 'texnika', 'mebel', 'buketi', 'produkti', 'knigi'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-5 py-2.5 rounded-xl text-[15px] font-medium transition-all duration-200 ${selectedCategory === cat
                    ? 'bg-blue-400 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                    }`}
                >
                  {t(cat)}
                </button>
              ))}
            </div>
          </div>

          {/* Контент */}
          <div className="mt-6">
            {loading && (
              <div className="flex justify-center items-center py-16">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {error && (
              <div className="text-center py-16 text-gray-500">
                Ошибка: {error}
              </div>
            )}

            {!loading && !error && (
              <>
                {searchQuery && filteredItems.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">
                      {t('noSearchResults') || `По запросу "${searchQuery}" ничего не найдено`}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map(item => (
                      <div
                        key={item.id}
                        onClick={() => handleProductClick(item.id)}
                        className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-5">
                          <h3 className="font-medium text-gray-900 text-[16px] mb-2">
                            {item.name}
                          </h3>
                          <p className='text-gray-600 text-[14px] leading-relaxed'>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  )
}