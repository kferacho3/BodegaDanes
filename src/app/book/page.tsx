import BookingWizard, {
  Availability,
} from "./bookingForm/BookingWizard";

/* ---------- temporary mock ---------- */
const mockAvailability: Availability[] = [
  {
    date: "2025-04-18",
    services: [
      {
        id: "chef-table",
        name: "Chef Table Experience",
        slots: 2,
        blurb:
          "Five‑course plated dinner cooked on‑site.\nIncludes menu planning, prep, service staff, and clean‑up.",
      },
      {
        id: "backyard-bbq",
        name: "Backyard BBQ",
        slots: 4,
        blurb:
          "Slow‑smoked meats & sides for outdoor gatherings.\nEquipment rental included.",
      },
    ],
  },
  {
    date: "2025-04-19",
    services: [
      {
        id: "tasting-menu",
        name: "Tasting Menu",
        slots: 0,
        blurb: "Fully booked.",
      },
    ],
  },
];

export default function Page() {
  // TODO: replace mock with real fetch (`await fetch(process.env.API_URL + '/availability').then(r => r.json())`)
  return (
    <main className="min-h-screen bg-[url('/textures/chalk-black.png')] bg-repeat text-silver-light py-12 px-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-10 text-center font-header text-4xl">
          Book&nbsp;Your&nbsp;Event
        </h1>
        <BookingWizard availability={mockAvailability} />
      </div>
    </main>
  );
}
