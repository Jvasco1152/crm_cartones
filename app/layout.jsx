import './globals.css'
import { Toaster } from 'react-hot-toast'
import Sidebar from '@/components/Sidebar'

export const metadata = {
  title: 'CRM Catrones - Cartones América',
  description: 'Sistema CRM para la fuerza comercial de Cartones América Colombia',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 h-full">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  )
}
