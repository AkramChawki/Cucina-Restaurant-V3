import React from 'react'
import Restau from './Partials/Presence/Restau'
import { usePage } from '@inertiajs/react'


export default function Presence({restaurants}) {
  const { auth } = usePage().props
  return (
    <>
      <Restau restaurants={restaurants} auth={auth}/>
    </>
  )
}
