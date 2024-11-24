import React from 'react'
import Restaurant from './Partials/Restau/Restaurant'

export default function ManageRestaurant({restaurant, products}) {
  return (
    <>
      <Restaurant restaurant={restaurant} products={products} />
    </>
  )
}
