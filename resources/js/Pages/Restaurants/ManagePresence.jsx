import React from 'react'
import Form from './Partials/Presence/Form'

export default function ManagePresence({ restaurant, employes }) {
  return (
    <>
      <Form restaurant={restaurant} employes={employes}/>
    </>
  )
}
