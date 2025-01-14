import React from 'react'
import CoastPizzaForm from './partials/CoastPizzaForm'

export default function CoastPizza({ restaurant, products, currentMonth }) {
  return (
    <CoastPizzaForm restaurant={restaurant} products={products} currentMonth={currentMonth} />
      
  )
}
