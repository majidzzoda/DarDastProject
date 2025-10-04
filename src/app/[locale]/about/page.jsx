'use client'
import { useTranslations } from 'next-intl'
import { Phone, Mail, MapPin, Clock, Shield, Truck, Heart } from 'lucide-react'

export default function About() {
  const t = useTranslations()

  return (
    <main className="min-h-screen bg-gray-50/30">
      <div className="w-[85%] mx-auto pt-24 pb-16">
        {/* Заголовок */}
        <div className="mb-12">
          <span className="text-blue-400 font-semibold text-2xl tracking-tight mb-4 block">DarDast</span>
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">{t('footer.about')}</h1>
          <p className="text-gray-600 text-[15px] leading-relaxed max-w-2xl">
            {t('footer.description')}
          </p>
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка - Основная информация */}
          <div className="lg:col-span-2 space-y-8">
            {/* О компании */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Наша история</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-[15px]">
                  <strong>DarDast</strong> {t('aboutHistory1')}
                </p>
                <p className="text-[15px]">
                  {t('aboutHistory2')}
                </p>
                <p className="text-[15px]">
                  {t('aboutHistory3')}
                </p>
              </div>
            </div>

            {/* Преимущества */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Наши преимущества</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <Truck className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t('advantages.fastDelivery')}</h3>
                    <p className="text-gray-600 text-[14px]">{t('advantages.fastDeliveryDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-50 p-3 rounded-xl">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t('advantages.reliability')}</h3>
                    <p className="text-gray-600 text-[14px]">{t('advantages.reliabilityDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-50 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t('advantages.24_7')}</h3>
                    <p className="text-gray-600 text-[14px]">{t('advantages.24_7Desc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-red-50 p-3 rounded-xl">
                    <Heart className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t('advantages.care')}</h3>
                    <p className="text-gray-600 text-[14px]">{t('advantages.careDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка - Контакты и услуги */}
          <div className="space-y-8">
            {/* Контакты */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('footer.contact')}</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 text-[15px]">+992 000 00 7808</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 text-[15px]">majidzzoda@mail.ru</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 text-[15px]">{t('footer.address')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 text-[15px]">{t('workingHours')}</span>
                </div>
              </div>
            </div>

            {/* Услуги */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('footer.services')}</h2>
              <ul className="space-y-3 text-gray-700 text-[15px]">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  {t('eda')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  {t('texnika')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  {t('mebel')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  {t('buketi')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  {t('knigi')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  {t('andMore')}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Миссия */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('ourMission')}</h2>
            <p className="text-gray-700 text-[15px] leading-relaxed">
              {t('missionDescription')}
            </p>
            <div className="mt-6">
              <span className="text-blue-400 font-semibold text-lg">{t('slogan')}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}