'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/context/AuthContext'
import { useRouter, useParams } from 'next/navigation'

type Seat = { id: string; name: string; seatType: string }

default export function SeatBookingPage() {
  const { user, isLoading, login } = useAuth()
  const router = useRouter()
  const { libraryId } = useParams()
  const [seats, setSeats] = useState<Seat[]>([])
  const draftKey = `seatBookingDraft_${libraryId}`
  const [form, setForm] = useState({ seatId: '', date: '', startTime: '', endTime: '', paymentMedium: '', paymentMethod: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) login()
  }, [isLoading, user])

  // load seats and draft
  useEffect(() => {
    // load draft from localStorage
    const draft = localStorage.getItem(draftKey)
    if (draft) setForm(JSON.parse(draft))

    // fetch seats from backend
    async function loadSeats() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/seats/library/${libraryId}`)
        const { data } = await res.json()
        setSeats(data)
      } catch (err) {
        console.error(err)
      }
    }
    loadSeats()
  }, [libraryId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const saveDraft = () => {
    localStorage.setItem(draftKey, JSON.stringify(form))
    alert('Draft saved')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/seat-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ libraryId, ...form }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Booking failed')
      localStorage.removeItem(draftKey)
      router.push('/dashboard/member/bookings')
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (isLoading || !user) {
    return <p>Loading or redirecting...</p>
  }

  return (
    <div>
      <h1>Book a Seat</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Seat:
          <select name="seatId" value={form.seatId} onChange={handleChange} required>
            <option value="">Select a seat</option>
            {seats.map(seat => (
              <option key={seat.id} value={seat.id}>
                {seat.name} ({seat.seatType})
              </option>
            ))}
          </select>
        </label>

        <label>
          Date:
          <input type="date" name="date" value={form.date} onChange={handleChange} required />
        </label>

        <label>
          Start Time:
          <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required />
        </label>

        <label>
          End Time:
          <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required />
        </label>

        <label>
          Payment Medium:
          <select name="paymentMedium" value={form.paymentMedium} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </label>

        <label>
          Payment Method:
          <input
            type="text"
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            required
          />
        </label>

        <button type="button" onClick={saveDraft} disabled={loading}>
          Save Draft
        </button>
        <button type="submit" disabled={loading}>
          {loading ? 'Booking...' : 'Book Seat'}
        </button>
      </form>
    </div>
  )
}
