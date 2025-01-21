import React from 'react'
import Footer from '@/Components/Footer'
import HygieneForm from './Partials/HygieneForm';
import PatrimoineForm from './Partials/PatrimoineForm';

export default function Form() {
  const queryParameters = new URLSearchParams(window.location.search);
  const type = queryParameters.get("type");

  return (
    <>
      {type === 'hygiene' ? <HygieneForm /> : <PatrimoineForm />}
      <Footer />
    </>
  )
}