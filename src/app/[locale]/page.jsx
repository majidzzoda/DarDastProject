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
  const [currentSlide, setCurrentSlide] = useState(0)

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

  // Слайды для доставки Дардаст с данными из next-intl
  const deliverySlides = useMemo(() => [
    {
      id: 1,
      title: t('deliverySlides.freeDelivery.title'),
      description: t('deliverySlides.freeDelivery.description'),
      image: "/images/geminiDeliveryCar.png",
      bgColor: "bg-white",
      features: [
        t('deliverySlides.freeDelivery.features.freeFrom1000'),
        t('deliverySlides.freeDelivery.features.citywide'),
        t('deliverySlides.freeDelivery.features.noHiddenFees')
      ]
    },
    {
      id: 2,
      title: t('deliverySlides.fastDelivery.title'),
      description: t('deliverySlides.fastDelivery.description'),
      image: "/images/geminiDeliveryMan.png",
      bgColor: "bg-white",
      features: [
        t('deliverySlides.fastDelivery.features.within2Hours'),
        t('deliverySlides.fastDelivery.features.24_7'),
        t('deliverySlides.fastDelivery.features.orderTracking')
      ]
    },
    {
      id: 3,
      title: t('deliverySlides.reliablePackaging.title'),
      description: t('deliverySlides.reliablePackaging.description'),
      image: "/images/geminiDeliverySafe.png",
      bgColor: "bg-white",
      features: [
        t('deliverySlides.reliablePackaging.features.protectivePackaging'),
        t('deliverySlides.reliablePackaging.features.hermetic'),
        t('deliverySlides.reliablePackaging.features.qualityPreservation')
      ]
    }
  ], [t])

  // Автопереключение слайдов
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % deliverySlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [deliverySlides.length])

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

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % deliverySlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + deliverySlides.length) % deliverySlides.length)
  }

  return (
    <>
      <Header onSearch={handleSearch} />
      <main className="min-h-screen bg-gray-50/30">
        <div className="w-[85%] mx-auto pt-24 pb-16">
          <h1 className="text-3xl font-semibold text-gray-900 mb-8">{t('home')}</h1>

          {/* Исправленный слайдер */}
          <div className="mb-12 relative">
            <div className="relative h-96 rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
              {deliverySlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    index === currentSlide 
                      ? 'opacity-100 translate-x-0' 
                      : index < currentSlide 
                        ? 'opacity-0 -translate-x-full' 
                        : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row h-full">
                    {/* Левая часть - фотография */}
                    <div className="lg:w-1/2 h-48 lg:h-full relative">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                    
                    {/* Правая часть - информация */}
                    <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
                      <div className="max-w-md mx-auto lg:mx-0">
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">
                          {slide.title}
                        </h2>
                        <p className="text-gray-600 mb-4 lg:mb-6 leading-relaxed text-sm lg:text-base">
                          {slide.description}
                        </p>
                        
                        {/* Особенности */}
                        <div className="mb-4 lg:mb-6 space-y-2">
                          {slide.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center text-gray-700">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                              <span className="text-xs lg:text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Кнопки навигации */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center shadow-lg transition-all duration-200 border border-gray-200 z-10"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center shadow-lg transition-all duration-200 border border-gray-200 z-10"
            >
              ›
            </button>

            {/* Индикаторы слайдов */}
            <div className="flex justify-center mt-4 space-x-2">
              {deliverySlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 lg:w-8 lg:h-2 rounded-full transition-all duration-200 ${
                    index === currentSlide ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Показываем результаты поиска */}
          {searchQuery && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                {t('searchResults')} "{searchQuery}"
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
                      {t('noSearchResults')}
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