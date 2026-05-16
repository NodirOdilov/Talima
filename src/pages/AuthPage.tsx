import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { getDashboardPath } from '@/core/routing/navigation.config'
import { TalimaLogo } from '@/components/brand/TalimaLogo'
import {
  Eye, EyeOff, Lock, User, GraduationCap, Users, ShoppingCart, Heart,
  Shield, Briefcase, Calculator, Sparkles, ArrowRight,
} from 'lucide-react'

export default function AuthPage() {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const success = await login(username, password)
      if (success) {
        const user = useAuthStore.getState().user
        if (user) navigate(getDashboardPath(user.role))
      } else {
        setError(t('auth.invalidCredentials'))
      }
    } catch {
      setError(t('auth.loginError'))
    } finally {
      setIsLoading(false)
    }
  }

  const demoAccounts = [
    { role: 'Superadmin', username: 'superadmin', password: 'talima2026', icon: Shield, color: 'from-rose-500 to-red-600' },
    { role: t('common.admin'), username: 'admin', password: 'talima2026', icon: Users, color: 'from-blue-500 to-indigo-600' },
    { role: 'Директор', username: 'director', password: 'talima2026', icon: Briefcase, color: 'from-indigo-500 to-violet-600' },
    { role: 'Бухгалтер', username: 'accountant', password: 'talima2026', icon: Calculator, color: 'from-emerald-500 to-teal-600' },
    { role: t('common.teacher'), username: 'teacher1', password: 'talima2026', icon: GraduationCap, color: 'from-violet-500 to-purple-600' },
    { role: t('common.student'), username: 'student1', password: 'talima2026', icon: ShoppingCart, color: 'from-fuchsia-500 to-pink-600' },
    { role: t('common.parent'), username: 'parent1', password: 'talima2026', icon: Heart, color: 'from-amber-500 to-orange-600' },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Фон */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-indigo-600/30 blur-[100px]" />
        <div className="absolute top-1/3 -right-24 h-[480px] w-[480px] rounded-full bg-fuchsia-600/25 blur-[100px]" />
        <div className="absolute -bottom-24 left-1/3 h-[400px] w-[400px] rounded-full bg-violet-600/20 blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center gap-10 px-4 py-12 lg:flex-row lg:gap-16 lg:px-8">
        {/* Hero */}
        <div className="hidden max-w-xl flex-1 lg:block">
          <TalimaLogo size="lg" className="mb-8" />
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-indigo-200 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-fuchsia-400" />
            Enterprise 2.0 — ERP / CRM / LMS
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
            {t('auth.welcomeToFuture')}
            <span className="mt-2 block bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              {t('auth.educationManagement')}
            </span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-400">
            {t('auth.streamlineDescription')}
          </p>
          <div className="mt-10 grid gap-3">
            {[
              { icon: Users, title: t('auth.studentManagement'), desc: t('auth.studentManagementDesc'), color: 'text-indigo-400' },
              { icon: GraduationCap, title: t('auth.teacherDashboard'), desc: t('auth.teacherDashboardDesc'), color: 'text-violet-400' },
              { icon: ShoppingCart, title: t('auth.studentShop'), desc: t('auth.studentShopDesc'), color: 'text-fuchsia-400' },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition hover:border-white/20 hover:bg-white/[0.07]"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Login */}
        <Card className="w-full max-w-md border-white/10 bg-slate-900/60 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl">
          <CardHeader className="space-y-4 pb-2 text-center">
            <div className="mx-auto lg:hidden">
              <TalimaLogo size="md" className="justify-center" />
            </div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 shadow-lg shadow-indigo-500/40">
              <Lock className="h-7 w-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">{t('auth.welcomeBack')}</CardTitle>
              <CardDescription className="mt-1 text-slate-400">{t('auth.signInToAccount')}</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-slate-300">
                  {t('auth.username')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('auth.enterUsername')}
                    className="h-11 border-white/10 bg-slate-950/50 pl-10 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-300">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.enterPassword')}
                    className="h-11 border-white/10 bg-slate-950/50 pl-10 pr-10 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
                    required
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:via-violet-500 hover:to-fuchsia-500"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t('auth.signingIn')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {t('auth.signIn')}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="border-t border-white/10 pt-5">
              <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                {t('auth.demoAccounts')}
              </p>
              <div className="grid max-h-52 gap-2 overflow-y-auto pr-1">
                {demoAccounts.map((account) => (
                  <button
                    key={account.username}
                    type="button"
                    onClick={() => {
                      setUsername(account.username)
                      setPassword(account.password)
                    }}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/40 p-2.5 text-left transition hover:border-indigo-500/40 hover:bg-indigo-500/10"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${account.color}`}>
                      <account.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{account.role}</p>
                      <p className="truncate text-xs text-slate-500">{account.username}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
