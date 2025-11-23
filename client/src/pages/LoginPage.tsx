import { MeshGradient } from "@paper-design/shaders-react"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLocation } from "wouter"

export default function LoginPage() {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })
  const [mounted, setMounted] = useState(false)
  const [code, setCode] = useState("")
  const [, setLocation] = useLocation()

  const colors = ["#72b9bb", "#b5d9d9", "#ffd1bd", "#ffebe0", "#8cc5b8", "#dbf4a4"]

  useEffect(() => {
    setMounted(true)
    const update = () =>
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Pour l'instant, juste le design - redirige vers le dashboard avec n'importe quel code
    if (code.trim() !== "") {
      setLocation("/dashboard")
    }
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-background flex items-center justify-center">
      <div className="fixed inset-0 w-screen h-screen">
        {mounted && (
          <>
            <MeshGradient
              width={dimensions.width}
              height={dimensions.height}
              colors={colors}
              distortion={0.8}
              swirl={0.6}
              grainMixer={0}
              grainOverlay={0}
              speed={0.42}
              offsetX={0.08}
            />
            <div className="absolute inset-0 pointer-events-none bg-white/20 dark:bg-black/25" />
          </>
        )}
      </div>

      <div className="relative z-10 max-w-md mx-auto px-6 w-full">
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Connexion
            </h1>
            <p className="text-white/80 text-sm">
              Entrer votre code de connection à votre application
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Entrez votre code"
                className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20 h-12 text-center text-lg tracking-widest font-mono"
                maxLength={10}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[rgba(63,63,63,1)] border-4 border-card text-white hover:bg-[rgba(63,63,63,0.9)] transition-colors h-12 text-base font-semibold"
            >
              Se connecter
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

