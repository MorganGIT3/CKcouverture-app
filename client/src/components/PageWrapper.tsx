import Sidebar from '@/components/Sidebar'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { useLocation } from 'wouter'
import { AnimatePresence, motion } from 'framer-motion'

interface PageWrapperProps {
  children: React.ReactNode
}

const contentVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export function PageWrapper({ children }: PageWrapperProps) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 w-screen h-screen z-0" style={{ backgroundColor: "#09090b" }}>
        <AnimatedBackground />
      </div>

      {/* Sidebar - now fixed, no animation */}
      <Sidebar />

      {/* Main Content - animated */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={contentVariants}
          className="flex-1 flex flex-col relative z-10 overflow-hidden ml-64"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

