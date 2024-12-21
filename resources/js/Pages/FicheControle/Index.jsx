import React from 'react'
import SelectType from './Partials/SelectType'
import Footer from '@/Components/Footer'

export default function Index({restaurants}) {
  return (
    <>
      <SelectType restaurants={restaurants}/>
      <Footer />
    </>
  )
}