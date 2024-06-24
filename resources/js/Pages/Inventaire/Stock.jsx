import React from 'react'
import Table from './Partials/Table'
import Footer from '@/Components/Footer'

export default function Stock({ categories, ficheId, restau }) {
  return (
    <>
      <Table categories={categories} ficheId={ficheId} restau={restau} />
    </>
  )
}
