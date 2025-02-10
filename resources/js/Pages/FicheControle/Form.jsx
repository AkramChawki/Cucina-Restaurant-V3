import React from 'react'
import Footer from '@/Components/Footer'
import HygieneForm from './Partials/HygieneForm';
import PatrimoineForm from './Partials/PatrimoineForm';
import ListePrestataires from './Partials/PrestataireForm';
import TravauxForm from './Partials/TravauxForm';
import MaintenancePreventiveForm from './Partials/MaintenancePreventiveForm';

export default function Form({ type, existingData }) {
  const renderForm = () => {
    switch(type) {
      case 'hygiene':
        return <HygieneForm />;
      case 'patrimoine':
        return <PatrimoineForm />;
      case 'prestataires':
        return <ListePrestataires type={type} existingData={existingData} />;
      case 'travaux':
        return <TravauxForm />;
      case 'maintenance_preventive':
        return <MaintenancePreventiveForm />;
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