'use client'

import { ClerkProvider } from '@clerk/nextjs'

export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  // Only render ClerkProvider if we have the publishable key
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <>{children}</>
  }

  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  )
}
