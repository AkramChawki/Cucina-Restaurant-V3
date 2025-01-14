import React from 'react'
import Formulaire from './Partials/Formulaire'
import Footer from '@/Components/Footer'

export default function Ajouter({restau}) {
  return (
    <>
    <Formulaire restau={restau} />
    <Footer />
    </>
  )
}
