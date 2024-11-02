import React from 'react'
import Name from './Partials/Name'
import Footer from '@/Components/Footer'

export default function CommandeCuisinier({ficheId, restaurants, requiresRest}) {
  return (
    <>
    <Name ficheId={ficheId} restaurants={restaurants} requiresRest={requiresRest}/>
    <Footer />
    </>
  )
}
