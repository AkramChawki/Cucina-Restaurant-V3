import React from 'react'
import Restau from './Partials/Presence/Restau'

export default function Presence({restaurants}) {
  return (
    <>
      <Restau restaurants={restaurants}/>
    </>
  )
}
