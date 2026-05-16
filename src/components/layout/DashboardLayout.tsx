import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import { useChatStore } from '@/store/chatStore'
import { getNavigation } from '@/core/routing/navigation.config'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import LanguageSelector from '@/components/ui/LanguageSelector'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { LogOut, X, Menu, User } from 'lucide-react'
import { env } from '@/core/config/env'
import { TalimaLogo } from '@/components/brand/TalimaLogo'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()
  const { getUnreadCount } = useChatStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const unreadCount = user ? getUnreadCount(user.id) : 0
  const navSections = user ? getNavigation(user.role, unreadCount) : []

  const handleNavigation = (href: string) => {
    navigate(href)
    setSidebarOpen(false)
  }

  const currentTitle = navSections
    .flatMap((s) => s.items)
    .find((item) => item.href === location.pathname)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Боковая панель */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <TalimaLogo size="sm" />
              <p className="mt-0.5 pl-10 text-[10px] font-medium text-slate-500">Enterprise v{env.versionShort}</p>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-4">
            {navSections.map((section) => (
              <div key={section.titleKey}>
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  {t(section.titleKey)}
                </p>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.href
                    const hasBadge = (item.badge ?? 0) > 0
                    return (
                      <Button
                        key={item.href}
                        variant={isActive ? 'default' : 'ghost'}
                        size="sm"
                        className={`w-full justify-start relative h-9 ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        onClick={() => handleNavigation(item.href)}
                      >
                        <Icon className="w-4 h-4 mr-2 shrink-0" />
                        <span className="flex-1 text-left text-sm truncate">{t(item.nameKey)}</span>
                        {hasBadge && (
                          <Badge variant="destructive" className="ml-auto h-4 min-w-4 px-1 text-[10px]">
                            {(item.badge ?? 0) > 99 ? '99+' : item.badge}
                          </Badge>
                        )}
                      </Button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              {t('common.logout')}
            </Button>
          </div>
        </div>
      </aside>

      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentTitle ? t(currentTitle.nameKey) : 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
