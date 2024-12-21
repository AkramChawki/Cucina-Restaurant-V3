import React from 'react'
import LaboratoireForm from './Partials/LaboratoireForm'
import RestaurantForm from './Partials/RestaurantForm'
import Footer from '@/Components/Footer'

export default function Form() {
  const queryParameters = new URLSearchParams(window.location.search);
  const type = queryParameters.get("type");

  return (
    <>
      {type === 'laboratoire' ? <LaboratoireForm /> : <RestaurantForm />}
      <Footer />
    </>
  )
}