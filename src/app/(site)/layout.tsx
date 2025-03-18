import React from 'react'
import { Suspense } from 'react'
function HomePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Suspense>{children}</Suspense>
    </main>
  )
}

export default HomePageLayout
