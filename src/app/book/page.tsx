import Stripe from 'stripe'
import BookingWizard, { Availability, Service } from './bookingForm/BookingWizard'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
})

/* ---------- load Stripe products ---------- */
async function fetchServices(): Promise<Service[]> {
  const prices = await stripe.prices.list({ expand: ['data.product'], active: true })

  return prices.data.map((price) => {
    const product = price.product as Stripe.Product
    const full = price.metadata.full_price_cents
      ? parseInt(price.metadata.full_price_cents, 10)
      : price.unit_amount ?? 0

    return {
      id   : price.id,
      name : product.name,
      price: price.unit_amount ?? 0,
      full,
      image: product.images[0] ?? '/textures/chalk-Menuboard2.png',
      blurb: product.description || '',
      slots: 5,          // TODO: replace with real logic later
    }
  })
}

export default async function Page() {
  const services = await fetchServices()

  /* ----- demo availability – every day this month = OPEN ----- */
  const today          = new Date()
  const daysInMonth    = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const demoAvailability: Availability[] = Array.from({ length: daysInMonth }).map((_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), i + 1)
    return {
      date  : date.toISOString().slice(0, 10),
      status: 'OPEN',          // **required field**
      services,
    }
  })

  return (
    <main className="min-h-screen bg-[url('/textures/chalk-black.png')] bg-repeat text-silver-light py-12 px-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-10 text-center font-header text-4xl">Book&nbsp;Your&nbsp;Event</h1>
        <BookingWizard availability={demoAvailability} />
      </div>
    </main>
  )
}
