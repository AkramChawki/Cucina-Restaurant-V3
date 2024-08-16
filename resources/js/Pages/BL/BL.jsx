import React from 'react'
import Name from './Partials/Name'
import Footer from '@/Components/Footer'

export default function BL({ficheName, restaurants}) {
  return (
    <>
    <Name ficheName={ficheName} restaurants={restaurants}/>
    <Footer />
    </>
  )
}
