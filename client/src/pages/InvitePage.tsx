import { useLocation } from "wouter"
import { WaitlistHero } from "@/components/WaitlistHero"

export default function InvitePage() {
  const [location] = useLocation()
  // Extraire le token de l'URL
  const token = location.startsWith('/invite/') ? location.split('/invite/')[1] : ""

  return <WaitlistHero mode="invite" inviteToken={token} />
}

