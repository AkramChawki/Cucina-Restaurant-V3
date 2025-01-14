import React from 'react'
import CoastEconomatForm from './partials/CoastEconomatForm'

export default function CoastEconomat({ restaurant, products, currentMonth }) {
  return (
    <CoastEconomatForm restaurant={restaurant} products={products} currentMonth={currentMonth} />
      
  )
}
