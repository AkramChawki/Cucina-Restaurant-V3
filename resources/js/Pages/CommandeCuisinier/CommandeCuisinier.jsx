import React from 'react'
import Name from './Partials/Name'
import Footer from '@/Components/Footer'

export default function CommandeCuisinier({ficheId, restaurants}) {
  return (
    <>
    <Name ficheId={ficheId} restaurants={restaurants}/>
    <Footer />
    </>
  )
}
