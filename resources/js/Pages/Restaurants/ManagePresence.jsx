import React from 'react'
import Form from './Partials/Presence/Form'

export default function ManagePresence({ restaurant, presences, currentMonth }) {
  return (
    <>
      <Form restaurant={restaurant}
        presences={presences}
        currentMonth={currentMonth} />
    </>
  )
}
