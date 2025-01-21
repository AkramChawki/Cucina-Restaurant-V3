import React from 'react'
import CostPizzaForm from './partials/CostPizzaForm'

export default function CostPizza({ restaurant, products, currentMonth }) {
  return (
    <CostPizzaForm restaurant={restaurant} products={products} currentMonth={currentMonth} />
      
  )
}
