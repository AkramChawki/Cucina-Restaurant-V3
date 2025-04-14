import React from 'react'
import Formulaire from './Partials/Formulaire'
import Footer from '@/Components/Footer'
import { Head } from '@inertiajs/react'

export default function Ajouter({restau}) {
  return (
    <>
    <Head title={`Ajouter Clôture - ${restau}`} />
    <Formulaire restau={restau} />
    <Footer />
    </>
  )
}