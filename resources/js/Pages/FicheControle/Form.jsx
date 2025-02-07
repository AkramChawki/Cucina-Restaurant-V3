import React from 'react'
import Footer from '@/Components/Footer'
import HygieneForm from './Partials/HygieneForm';
import PatrimoineForm from './Partials/PatrimoineForm';
import ListePrestataires from './Partials/PrestataireForm';

export default function Form({ restau, type, existingData }) {
  const renderForm = () => {
    switch(type) {
      case 'hygiene':
        return <HygieneForm />;
      case 'patrimoine':
        return <PatrimoineForm />;
      case 'prestataires':
        return <ListePrestataires restau={restau} type={type} existingData={existingData} />;
      default:
        return <HygieneForm />;
    }
  }

  return (
    <>
      {renderForm()}
      <Footer />
    </>
  )
}