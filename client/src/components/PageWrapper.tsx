import Sidebar from '@/components/Sidebar'

interface PageWrapperProps {
  children: React.ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Sidebar - now fixed */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 ml-64 rounded-l-3xl overflow-hidden">
        {children}
      </div>
    </div>
  )
}

