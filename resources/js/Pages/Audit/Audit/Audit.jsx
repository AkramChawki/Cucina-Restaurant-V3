import React from 'react'
import Name from './Partials/Name'
import Footer from '@/Components/Footer'

export default function Audit({restaurants}) {
  return (
    <>
    <Name restaurants={restaurants}/>
    <Footer />
    </>
  )
}
