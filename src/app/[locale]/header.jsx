"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe, Search } from "lucide-react"
import { useLocale, useTranslations } from "next-intl";
import { useTransition, useState } from "react";

const Header = ({ onSearch }) => {
    const t = useTranslations();
    const pathName = usePathname();
    const locale = useLocale();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState("");

    const switchLocale = () => {
        const newLocale = locale === 'ru' ? 'tj' : 'ru';
        
        startTransition(() => {
            router.replace(pathName, { locale: newLocale });
        });
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        }
    }

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        // Поиск при вводе
        if (onSearch) {
            onSearch(value);
        }
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-2xl border-b border-gray-100">
            <header className="flex items-center justify-between lg:w-[85%] px-6 py-4 max-w-7xl mx-auto">
                {/* Search Input */}
                <form onSubmit={handleSearch} className="relative hidden lg:flex items-center w-[20%] min-w-[280px]">
                    <input
                        id="search-input"
                        name="search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="bg-gray-50/80 border border-gray-200 rounded-xl py-3 pl-4 pr-12 outline-none w-full 
                                 text-gray-900 placeholder-gray-500 text-[15px]
                                 focus:bg-white focus:border-gray-300 focus:shadow-sm transition-all duration-200"
                        type="text"
                        placeholder={t('search') || "Search..."}
                        aria-label="Search"
                    />
                    <button 
                        type="submit"
                        className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </form>

                {/* Logo */}
                <div className="lg:w-[20%] flex justify-center">
                    <a 
                        href="/" 
                        className="text-blue-400 font-semibold text-2xl tracking-tight hover:text-blue-500 transition-colors"
                        onClick={(e) => {
                            e.preventDefault();
                            router.push('/');
                        }}
                    >
                        DarDast
                    </a>
                </div>

                {/* Language Switcher */}
                <div className="lg:w-[20%] flex justify-end">
                    <button
                        onClick={switchLocale}
                        disabled={isPending}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50/80 border border-gray-200 
                                 hover:bg-gray-100/80 transition-all duration-200
                                 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={locale === "ru" ? "Switch to Tajik" : "Switch to Russian"}
                    >
                        <Globe className="w-4 h-4 text-gray-600" />
                        <span className="text-[15px] font-medium text-gray-900">
                            {locale === "ru" ? "TJ" : "RU"}
                        </span>
                        {isPending && (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        )}
                    </button>
                </div>
            </header>
        </div>
    )
}

export default Header;