import React from 'react'
import Restau from './Partials/Employe/Restau'

export default function Employe({restaurants}) {
  return (
    <>
      <Restau restaurants={restaurants}/>
    </>
  )
}
