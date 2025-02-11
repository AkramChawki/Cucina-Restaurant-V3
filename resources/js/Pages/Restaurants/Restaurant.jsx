import React from 'react'
import Name from './Partials/Restau/Name'

export default function Restaurant({restaurants}) {
  const { auth } = usePage().props
  return (
    <>
      <Name restaurants={restaurants} auth={auth}/>
    </>
  )
}
