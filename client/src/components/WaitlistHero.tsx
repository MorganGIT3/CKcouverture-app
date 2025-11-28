"use client"

import { useState, useRef, useEffect } from "react"
import { useLocation } from "wouter"
import { useAuth } from "@/context/AuthContext"
import { verifyTeamMemberCode, getInvitationByToken, markInvitationAsUsed, type TeamInvitation } from "@/lib/supabase"

interface WaitlistHeroProps {
  onButtonClick?: () => void;
  mode?: 'login' | 'invite';
  inviteToken?: string;
}

export const WaitlistHero = ({ onButtonClick, mode = 'login', inviteToken }: WaitlistHeroProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<'email' | 'password' | 'code' | 'success'>('email')
  const [status, setStatus] = useState("idle") // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState<string | null>(null)
  const [invitation, setInvitation] = useState<TeamInvitation | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { signIn } = useAuth()
  const [, setLocation] = useLocation()

  // Load invitation if in invite mode
  useEffect(() => {
    if (mode === 'invite' && inviteToken) {
      getInvitationByToken(inviteToken).then((inv) => {
        setInvitation(inv)
        if (!inv) {
          setError("Cette invitation n'existe pas, a expiré ou a déjà été utilisée.")
          setStatus('error')
        } else {
          setStep('code')
        }
      }).catch(() => {
        setError("Erreur lors du chargement de l'invitation.")
        setStatus('error')
      })
    }
  }, [mode, inviteToken])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer une adresse email valide")
      return
    }

    setError(null)
    setStatus("loading")

    // Move to password step
    setTimeout(() => {
      setStep('password')
      setStatus("idle")
    }, 500)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return

    setError(null)
    setStatus("loading")

    try {
      const { error: authError } = await signIn(email, password)
      if (authError) {
        setError(authError.message || "Email ou mot de passe incorrect")
        setStatus("error")
      } else {
        setStatus("success")
        fireConfetti()
        setTimeout(() => {
          setLocation("/dashboard")
        }, 1500)
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue")
      setStatus("error")
    }
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) {
      setError("Veuillez entrer votre code de connexion")
      return
    }

    if (!invitation || !inviteToken) {
      setError("Invitation invalide")
      return
    }

    setError(null)
    setStatus("loading")

    try {
      const member = await verifyTeamMemberCode(code.trim(), inviteToken)
      if (member) {
        localStorage.setItem('teamMember', JSON.stringify(member))
        localStorage.setItem('userType', 'team')
        await markInvitationAsUsed(inviteToken)
        setStatus("success")
        fireConfetti()
        setTimeout(() => {
          setLocation("/team-dashboard")
        }, 1500)
      } else {
        setError("Code de connexion incorrect")
        setStatus("error")
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue")
      setStatus("error")
    }
  }

  // --- Confetti Logic ---
  const fireConfetti = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      color: string
      size: number
    }> = []
    const colors = ["#0079da", "#10b981", "#fbbf24", "#f472b6", "#fff"]

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const createParticle = () => {
      return {
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 2) * 10,
        life: 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
      }
    }

    for (let i = 0; i < 50; i++) {
      particles.push(createParticle())
    }

    const animate = () => {
      if (particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.5
        p.life -= 2

        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, p.life / 100)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        if (p.life <= 0) {
          particles.splice(i, 1)
          i--
        }
      }

      requestAnimationFrame(animate)
    }

    animate()
  }

  // Color tokens
  const colors = {
    textMain: "#ffffff",
    textSecondary: "#94a3b8",
    bluePrimary: "#0079da",
    success: "#10b981",
    error: "#ef4444",
    inputBg: "#27272a",
    baseBg: "#09090b",
    inputShadow: "rgba(255, 255, 255, 0.1)",
  }

  const getPlaceholder = () => {
    if (mode === 'invite') return "Code de connexion"
    if (step === 'email') return "name@email.com"
    return "••••••••"
  }

  const getButtonText = () => {
    if (status === "loading") return ""
    if (mode === 'invite') return "Vérifier"
    if (step === 'email') return "Continuer"
    return "Se connecter"
  }

  const handleSubmit = (e: React.FormEvent) => {
    if (mode === 'invite') {
      handleCodeSubmit(e)
    } else if (step === 'email') {
      handleEmailSubmit(e)
    } else if (step === 'password') {
      handlePasswordSubmit(e)
    }
  }

  const currentValue = mode === 'invite' ? code : (step === 'email' ? email : password)
  const setCurrentValue = mode === 'invite' ? setCode : (step === 'email' ? setEmail : setPassword)
  const inputType = mode === 'invite' ? 'text' : (step === 'email' ? 'email' : 'password')

  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center">
      {/* Animation Styles */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 60s linear infinite;
        }
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes success-pulse {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes success-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 60px rgba(16, 185, 129, 0.8), 0 0 100px rgba(16, 185, 129, 0.4); }
        }
        @keyframes checkmark-draw {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes celebration-ring {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        .animate-success-pulse {
          animation: success-pulse 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-success-glow {
          animation: success-glow 2s ease-in-out infinite;
        }
        .animate-checkmark {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
          animation: checkmark-draw 0.4s ease-out 0.3s forwards;
        }
        .animate-ring {
          animation: celebration-ring 0.8s ease-out forwards;
        }
      `}</style>

      {/* Main Container */}
      <div
        className="relative w-full h-screen overflow-hidden shadow-2xl"
        style={{
          backgroundColor: colors.baseBg,
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Background Decorative Layer */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            perspective: "1200px",
            transform: "perspective(1200px) rotateX(15deg)",
            transformOrigin: "center bottom",
            opacity: 1,
          }}
        >
          {/* Image 3 (Back) - spins clockwise */}
          <div className="absolute inset-0 animate-spin-slow">
            <div
              className="absolute top-1/2 left-1/2"
              style={{
                width: "2000px",
                height: "2000px",
                transform: "translate(-50%, -50%) rotate(279.05deg)",
                zIndex: 0,
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Image 2 (Middle) - spins counter-clockwise */}
          <div className="absolute inset-0 animate-spin-slow-reverse">
            <div
              className="absolute top-1/2 left-1/2"
              style={{
                width: "1000px",
                height: "1000px",
                transform: "translate(-50%, -50%) rotate(304.42deg)",
                zIndex: 1,
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 rounded-full blur-2xl" />
            </div>
          </div>

          {/* Image 1 (Front) - spins clockwise */}
          <div className="absolute inset-0 animate-spin-slow">
            <div
              className="absolute top-1/2 left-1/2"
              style={{
                width: "800px",
                height: "800px",
                transform: "translate(-50%, -50%) rotate(48.33deg)",
                zIndex: 2,
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-violet-500/40 to-pink-500/40 rounded-full blur-xl" />
            </div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${colors.baseBg} 10%, rgba(9, 9, 11, 0.8) 40%, transparent 100%)`,
          }}
        />

        {/* Content Container */}
        <div className="relative z-20 w-full h-full flex flex-col items-center justify-end pb-24 gap-6">
          <div className="w-16 h-16 rounded-2xl shadow-lg overflow-hidden mb-2 ring-1 ring-white/10 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">CK</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-center tracking-tight" style={{ color: colors.textMain }}>
            CK-Couverture
          </h1>

          <p className="text-lg font-medium" style={{ color: colors.textSecondary }}>
            Construire pour durer
          </p>

          {/* Error Message */}
          {error && (
            <div className="w-full max-w-md px-4">
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm text-center">
                {error}
              </div>
            </div>
          )}

          {/* Form / Success Container */}
          <div className="w-full max-w-md px-4 mt-4 h-[60px] relative perspective-1000">
            {/* Confetti Canvas */}
            <canvas
              ref={canvasRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-50"
            />

            {/* SUCCESS STATE */}
            <div
              className={`absolute inset-0 flex items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                status === "success"
                  ? "opacity-100 scale-100 rotate-x-0 animate-success-pulse animate-success-glow"
                  : "opacity-0 scale-95 -rotate-x-90 pointer-events-none"
              }`}
              style={{ backgroundColor: colors.success }}
            >
              {status === "success" && (
                <>
                  <div
                    className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-2 border-emerald-400 animate-ring"
                    style={{ animationDelay: "0s" }}
                  />
                  <div
                    className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-2 border-emerald-300 animate-ring"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <div
                    className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-2 border-emerald-200 animate-ring"
                    style={{ animationDelay: "0.3s" }}
                  />
                </>
              )}
              <div
                className={`flex items-center gap-2 text-white font-semibold text-lg ${status === "success" ? "animate-bounce-in" : ""}`}
              >
                <div className="bg-white/20 p-1 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      className={status === "success" ? "animate-checkmark" : ""}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span>Connexion réussie !</span>
              </div>
            </div>

            {/* FORM STATE */}
            <form
              onSubmit={handleSubmit}
              className={`relative w-full h-full group transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                status === "success"
                  ? "opacity-0 scale-95 rotate-x-90 pointer-events-none"
                  : "opacity-100 scale-100 rotate-x-0"
              }`}
            >
              <input
                type={inputType}
                required
                placeholder={getPlaceholder()}
                value={currentValue}
                disabled={status === "loading"}
                onChange={(e) => {
                  setCurrentValue(e.target.value)
                  setError(null)
                }}
                className="w-full h-[60px] pl-6 pr-[150px] rounded-full outline-none transition-all duration-200 placeholder-zinc-500 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.textMain,
                  boxShadow: `inset 0 0 0 1px ${colors.inputShadow}`,
                }}
              />

              <div className="absolute top-[6px] right-[6px] bottom-[6px]">
                <button
                  type="submit"
                  disabled={status === "loading" || !currentValue.trim()}
                  className="h-full px-6 rounded-full font-medium text-white transition-all active:scale-95 hover:brightness-110 disabled:hover:brightness-100 disabled:active:scale-100 disabled:cursor-wait flex items-center justify-center min-w-[130px]"
                  style={{ backgroundColor: colors.bluePrimary }}
                >
                  {status === "loading" ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    getButtonText()
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Back button for password step */}
          {step === 'password' && mode === 'login' && (
            <button
              onClick={() => {
                setStep('email')
                setPassword('')
                setError(null)
              }}
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              ← Retour
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
