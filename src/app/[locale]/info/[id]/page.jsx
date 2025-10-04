'use client'
import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ArrowLeft, Phone, Mail, User, MessageCircle, Send, MapPin, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

// Временные интервалы для доставки
const DELIVERY_TIME_SLOTS = [
  '09:00 - 11:00',
  '11:00 - 13:00',
  '13:00 - 15:00',
  '15:00 - 17:00',
  '17:00 - 19:00',
  '19:00 - 21:00'
];

export default function InfoPage() {
  const params = useParams()
  const router = useRouter()
  const t = useTranslations()
  const productId = params.id
  const [activeTab, setActiveTab] = useState('info')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState(null)

  // Получаем все продукты из Redux (с защитой от undefined)
  const eda = useSelector(state => state.app?.eda || [])
  const texnika = useSelector(state => state.app?.texnika || [])
  const mebel = useSelector(state => state.app?.mebel || [])
  const buketi = useSelector(state => state.app?.buketi || [])
  const produkti = useSelector(state => state.app?.produkti || [])
  const knigi = useSelector(state => state.app?.knigi || [])

  // Объединяем все продукты из Redux
  const allReduxItems = [...eda, ...texnika, ...mebel, ...buketi, ...produkti, ...knigi]

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deliveryAddress: '',
    deliveryTime: '',
    message: ''
  })

  // Поиск продукта
  useEffect(() => {
    console.log('🔍 Поиск продукта:', {
      productId,
      reduxItems: allReduxItems.length,
    })

    // Сначала ищем в Redux
    let foundProduct = allReduxItems.find(item => {
      if (!item?.id || !productId) return false
      return item.id.toString().toLowerCase().trim() === productId.toString().toLowerCase().trim()
    })

    console.log('🔍 Найденный продукт:', foundProduct)
    setProduct(foundProduct)

    // Снимаем состояние загрузки
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [productId, allReduxItems])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Функция отправки в Telegram
  const sendToTelegram = async (data) => {
    const TELEGRAM_BOT_TOKEN = "8296762893:AAHXc-ZX3LrPFgGemCOiZxpkXj2UjpRsyoU"
    const TELEGRAM_CHAT_ID = "8309392164"

    const text = `
🛒 *Новый заказ с DarDast*

*Товар:* ${product?.name || 'Не указан'}
*Описание:* ${product?.description || 'Не указано'}
*Цена:* ${product?.price || 'Не указано'}
*Время заказа:* ${new Date().toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
    
*Контактные данные:*
👤 *Имя:* ${data.name}
📞 *Телефон:* ${data.phone}

*Доставка:*
📍 *Адрес доставки:* ${data.deliveryAddress || 'Не указан'}
⏰ *Время доставки:* ${data.deliveryTime || 'Не указано'}

💬 *Сообщение:*
${data.message}

🆔 *ID товара:* ${productId}
    `.trim()

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: 'Markdown',
        }),
      })

      const result = await response.json()
      console.log('📨 Ответ от Telegram API:', result)

      if (!response.ok) {
        throw new Error(result.description || `Ошибка HTTP: ${response.status}`)
      }

      return result
    } catch (error) {
      console.error('❌ Ошибка при отправке в Telegram:', error)
      throw error
    }
  }
  // Демо-режим отправки
  const simulateTelegramSend = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('🎭 Демо-отправка:', { product: product?.name, ...data })
    return { ok: true, result: { message_id: 123 } }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Отправляем в Telegram
      await sendToTelegram(formData)


      alert(t('successMessage'))
      setFormData({
        name: '',
        phone: '',
        deliveryAddress: '',
        deliveryTime: '',
        message: ''
      })
      setActiveTab('info')
    } catch (error) {
      console.error('❌ Ошибка отправки:', error)

      // Предлагаем демо-режим
      const useDemo = confirm(t('demoModePrompt'))
      if (useDemo) {
        try {
          await simulateTelegramSend(formData)
          alert(t('demoSuccess'))
          setFormData({
            name: '',
            phone: '',
            deliveryAddress: '',
            deliveryTime: '',
            message: ''
          })
          setActiveTab('info')
        } catch (demoError) {
          console.error('Демо-ошибка:', demoError)
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Показываем загрузку
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    )
  }

  // Показываем "не найден" если продукт не существует
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">{t('productNotFound')}</h1>
          <p className="text-gray-600 mb-2">ID: {productId}</p>
          <p className="text-gray-600 mb-4">{t('checkLink')}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors duration-200"
          >
            {t('home')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50/30">
      <div className="w-[85%] mx-auto pt-24 pb-16">
        {/* Кнопка назад */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[15px] font-medium">{t('back')}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Изображение продукта */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Информация о продукте и форма */}
          <div className="space-y-8">
            {/* Заголовок */}
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-gray-600 text-[16px] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Табы */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-6 py-3 text-[15px] font-medium border-b-2 transition-colors duration-200 ${activeTab === 'info'
                  ? 'border-blue-400 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {t('productDetails')}
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-6 py-3 text-[15px] font-medium border-b-2 transition-colors duration-200 ${activeTab === 'contact'
                  ? 'border-blue-400 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {t('placeOrder')}
              </button>
            </div>

            {/* Контент табов */}
            {activeTab === 'info' ? (
              <>
                {/* Дополнительная информация */}
                <div className="space-y-4">
                  <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="font-medium text-gray-900 text-[18px] mb-3">{t('details')}</h3>
                    <div className="space-y-2 text-[15px] text-gray-600">
                      <p><span className="font-medium">{t('category')}:</span> {product.category || t('notSpecified')}</p>
                      <p><span className="font-medium">{t('price')}:</span> {product.price || t('notSpecified')}</p>
                      <p><span className="font-medium">{t('inStock')}:</span> {product.stock || t('yes')}</p>
                    </div>
                  </div>
                </div>

                {/* Контакты продавца */}
                <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="font-medium text-gray-900 text-[18px] mb-4">{t('sellerContacts')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700 text-[15px]">+992 000 00 7808</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700 text-[15px]">majidzzoda@mail.ru</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('contact')}
                    className="w-full mt-6 px-6 py-3 bg-blue-400 text-white rounded-xl hover:bg-blue-500 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {t('placeOrder')}
                  </button>
                </div>
              </>
            ) : (
              /* Форма заказа */
              <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-medium text-gray-900 text-[18px] mb-6">{t('orderForm')}</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Имя */}
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 text-[15px] font-medium mb-2">
                      <User className="w-4 h-4" />
                      {t('yourName')} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                               text-gray-900 placeholder-gray-500 text-[15px]
                               focus:bg-white focus:border-gray-300 focus:shadow-sm transition-all duration-200
                               outline-none"
                      placeholder={t('enterName')}
                    />
                  </div>

                  {/* Телефон */}
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 text-[15px] font-medium mb-2">
                      <Phone className="w-4 h-4" />
                      {t('phone')} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => {
                        let value = e.target.value;

                        // Убеждаемся, что начинается с +992
                        if (!value.startsWith('+992 ')) {
                          value = '+992 ' + value.replace(/^\+992\s?/, '');
                        }

                        // Ограничиваем длину (префикс +992 + 9 цифр = 13 символов)
                        if (value.length <= 14) {
                          // Разрешаем только цифры после префикса
                          const numbersOnly = value.replace(/[^\d]/g, '');
                          if (numbersOnly.length <= 12) { // +992 = 4 символа, но мы храним как строку
                            setFormData(prev => ({
                              ...prev,
                              phone: value
                            }));
                          }
                        }
                      }}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
           text-gray-900 placeholder-gray-500 text-[15px]
           focus:bg-white focus:border-gray-300 focus:shadow-sm transition-all duration-200
           outline-none"
                      placeholder="+992 ___ __ __ __"
                    />
                  </div>

                  {/* Адрес доставки */}
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 text-[15px] font-medium mb-2">
                      <MapPin className="w-4 h-4" />
                      {t('deliveryAddress')} *
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                               text-gray-900 placeholder-gray-500 text-[15px]
                               focus:bg-white focus:border-gray-300 focus:shadow-sm transition-all duration-200
                               outline-none"
                      placeholder={t('enterAddress')}
                    />
                  </div>

                  {/* Время доставки */}
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 text-[15px] font-medium mb-2">
                      <Clock className="w-4 h-4" />
                      {t('deliveryTime')}
                    </label>
                    <select
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                               text-gray-900 text-[15px]
                               focus:bg-white focus:border-gray-300 focus:shadow-sm transition-all duration-200
                               outline-none"
                    >
                      <option value="">{t('selectTime')}</option>
                      {DELIVERY_TIME_SLOTS.map((time, index) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Сообщение */}
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 text-[15px] font-medium mb-2">
                      <MessageCircle className="w-4 h-4" />
                      {t('additionalInfo')}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                               text-gray-900 placeholder-gray-500 text-[15px]
                               focus:bg-white focus:border-gray-300 focus:shadow-sm transition-all duration-200
                               outline-none resize-none"
                      placeholder={t('enterMessage')}
                    />
                  </div>

                  {/* Кнопки */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('info')}
                      disabled={isSubmitting}
                      className="flex-1 lg:px-6 lg:py-3 py-1 lg:text-[18px] text-[10px] px-3 border border-gray-300 text-gray-700 rounded-xl 
                               hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50"
                    >
                      {t('back')}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 lg:px-6 lg:py-3 py-1 lg:text-[18px] text-[10px] px-3 bg-blue-400 text-white rounded-xl 
                               hover:bg-blue-500 transition-colors duration-200 font-medium 
                               disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {t('sending')}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          {t('sendOrder')}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}