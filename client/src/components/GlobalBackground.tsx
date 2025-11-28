import { NeonOrbs } from "./NeonOrbs"

export function GlobalBackground() {
  return (
    <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none">
      <NeonOrbs />
    </div>
  )
}

