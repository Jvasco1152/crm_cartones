'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, TrendingUp, Activity, CheckSquare, Sparkles, Box } from 'lucide-react'
import clsx from 'clsx'

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/oportunidades', label: 'Oportunidades', icon: TrendingUp },
  { href: '/actividades', label: 'Actividades', icon: Activity },
  { href: '/tareas', label: 'Tareas', icon: CheckSquare },
  { href: '/ia', label: 'IA Asistente', icon: Sparkles },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-blue-950 flex flex-col flex-shrink-0 h-full">
      {/* Logo */}
      <div className="p-5 border-b border-blue-900">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Box className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Cartones América</p>
            <p className="text-blue-400 text-xs">CRM Comercial</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-300 hover:bg-blue-900 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-900">
        <p className="text-blue-500 text-xs text-center">Colombia · 2026</p>
      </div>
    </aside>
  )
}
