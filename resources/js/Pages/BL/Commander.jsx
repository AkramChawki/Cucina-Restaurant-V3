import React from 'react'
import Table from './Partials/Table'
import Footer from '@/Components/Footer'

export default function Commander({ categories, ficheName, restau }) {
  return (
    <>
      <Table categories={categories} ficheName={ficheName} restau={restau} />
    </>
  )
}
