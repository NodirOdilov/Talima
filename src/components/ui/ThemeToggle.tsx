import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

const STORAGE_KEY = 'theme'

function readInitialTheme(): boolean {
  if (typeof window === 'undefined') return false
  if (localStorage.getItem(STORAGE_KEY) === 'dark') return true
  return document.documentElement.classList.contains('dark')
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(readInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem(STORAGE_KEY, 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem(STORAGE_KEY, 'light')
    }
  }, [isDark])

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setIsDark((v) => !v)}
      className="relative w-[60px] h-[32px] rounded-full transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2"
    >
      <div
        className={`absolute inset-0 rounded-full transition-all duration-300 ease-in-out ${
          isDark ? 'bg-slate-700' : 'bg-blue-500'
        }`}
      />

      <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none z-0">
        <Sun
          className={`w-3.5 h-3.5 transition-all duration-300 text-white ${
            isDark ? 'opacity-50' : 'opacity-100'
          }`}
          aria-hidden="true"
        />
        <Moon
          className={`w-3.5 h-3.5 transition-all duration-300 text-white ${
            isDark ? 'opacity-100' : 'opacity-50'
          }`}
          aria-hidden="true"
        />
      </div>

      <div
        className={`absolute top-[2px] bottom-[2px] w-[28px] rounded-full bg-white shadow-md transition-all duration-300 ease-in-out z-10 ${
          isDark ? 'left-[30px]' : 'left-[2px]'
        }`}
      />
    </button>
  )
}
