import React from 'react'
import Name from './Partials/Name'

export default function Restaurants({restaurants}) {
  return (
    <>
      <Name restaurants={restaurants}/>
    </>
  )
}
