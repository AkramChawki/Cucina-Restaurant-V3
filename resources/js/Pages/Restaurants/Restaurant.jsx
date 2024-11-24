import React from 'react'
import Name from './Partials/Restau/Name'

export default function Restaurant({restaurants}) {
  return (
    <>
      <Name restaurants={restaurants}/>
    </>
  )
}
