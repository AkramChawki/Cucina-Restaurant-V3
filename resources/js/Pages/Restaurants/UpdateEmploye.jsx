import React from 'react'
import Form from './Partials/Employe/edit/Form'

export default function UpdateEmploye({employe, restaurants}) {
  return (
    <>
      <Form employe={employe} restaurants={restaurants}/>
    </>
  )
}
