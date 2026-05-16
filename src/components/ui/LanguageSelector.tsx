import { useLanguage } from '@/lib/useLanguage'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Check } from 'lucide-react'

const FLAG_CODE: Record<string, string> = {
  en: 'us',
  ru: 'ru',
  uz: 'uz',
}

function Flag({ code, label }: { code: string; label: string }) {
  const flagCode = FLAG_CODE[code] ?? code
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center w-10 h-6"
      role="img"
      aria-label={`${label} flag`}
    >
      <img
        alt={`${code} flag`}
        loading="lazy"
        src={`https://flagcdn.com/w320/${flagCode}.png`}
        className="block w-10 h-6 object-cover rounded-sm"
      />
    </div>
  )
}

export default function LanguageSelector() {
  const { currentLanguage, changeLanguage, languages } = useLanguage()

  const handleLanguageChange = (value: string) => {
    changeLanguage(value as 'en' | 'ru' | 'uz')
  }

  const currentLang = languages.find((l) => l.code === currentLanguage) ?? languages[0]

  return (
    <div className="relative">
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[240px] h-11 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/30 dark:hover:to-purple-800/30 hover:border-blue-300 dark:hover:border-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
          <SelectValue asChild>
            <div className="flex items-center gap-3 w-full">
              <Flag code={currentLang.code} label={currentLang.nativeName} />
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 pointer-events-none">
                {currentLang.nativeName}
              </span>
            </div>
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-700 shadow-2xl rounded-xl overflow-hidden">
          {languages.map((language) => (
            <SelectItem
              key={language.code}
              value={language.code}
              className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 focus:bg-gradient-to-r focus:from-blue-50 focus:to-purple-50 dark:focus:from-blue-900/20 dark:focus:to-purple-900/20 transition-all duration-200 cursor-pointer rounded-lg my-0.5"
            >
              <div className="flex items-center justify-between w-full py-1.5 gap-3">
                <div className="flex items-center gap-3">
                  <Flag code={language.code} label={language.nativeName} />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                      {language.nativeName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                      {language.name}
                    </span>
                  </div>
                </div>
                {currentLanguage === language.code && (
                  <div className="ml-3 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
