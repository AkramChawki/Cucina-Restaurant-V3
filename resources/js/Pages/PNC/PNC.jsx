import React from 'react'
import Name from './Partials/Name'
import Footer from '@/Components/Footer'

export default function PNC({restaurants}) {
  return (
    <>
    <Name restaurants={restaurants}/>
    <Footer />
    </>
  )
}
