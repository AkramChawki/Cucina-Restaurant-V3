import React from 'react'
import CoastConsomableForm from './partials/CoastConsomableForm'

export default function CoastConsomable({ restaurant, products, currentMonth }) {
  return (
    <CoastConsomableForm restaurant={restaurant} products={products} currentMonth={currentMonth} />
      
  )
}
