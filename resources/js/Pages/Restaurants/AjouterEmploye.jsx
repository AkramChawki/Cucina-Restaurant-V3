import React from 'react'
import Restau from './Partials/Employe/add/Restau'

export default function AjouterEmploye({restaurants}) {
  return (
    <>
      <Restau restaurants={restaurants}/>
    </>
  )
}
