import React, { Suspense } from 'react'
import LibrariesPage from './client'

const page = () => {
  return (
    <div>
      <Suspense>
        <LibrariesPage />
      </Suspense>

    </div>
  )
}

export default page