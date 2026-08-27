import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import MarkdownContent from "../../../components/MarkdownContent";
import { getTrip } from "../../../services/tripService";

type TripDetailPageProps = {
  params: Promise<{ id: string }>;
};

const unsplashPhotos = [
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=1600&q=80",
];

const getPhotoIndex = (destination: string) =>
  [...destination].reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  ) % unsplashPhotos.length;

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { id } = await params;
  const tripId = Number(id);

  if (!Number.isInteger(tripId) || tripId < 1) {
    notFound();
  }

  let trip;
  try {
    trip = await getTrip(tripId);
  } catch {
    notFound();
  }
  const photoUrl = unsplashPhotos[getPhotoIndex(trip.destination)];

  return (
    <main className="min-h-screen bg-[#f1ede2] px-6 py-6 text-[#111111] sm:px-8 lg:px-12 bg-[radial-gradient(#11111111_1px,transparent_1px)] bg-[size:16px_16px]">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b-2 border-[#111111] pb-5">
          <Link
            href="/"
            className="text-2xl font-black uppercase tracking-[-0.06em]"
          >
            kelana<span className="text-[#ff5c35]">.</span>
          </Link>
          <nav className="flex flex-wrap justify-end gap-3">
            <Link
              href="/"
              className="border-2 border-[#111111] bg-[#c6fab4] px-3 py-2 text-xs font-black uppercase text-[#111111] hover:bg-[#c6fab4] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:text-sm"
            >
              ✈️ Plan a trip
            </Link>
            <Link
              href={`/trips?returnTo=${trip.id}`}
              className="border-2 border-[#111111] bg-[#fff59f] px-3 py-2 text-xs font-black uppercase text-[#111111] active:bg-yellow-400 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:text-sm"
            >
              ⏳ Trip history
            </Link>
          </nav>
        </header>

        <section className="grid gap-8 py-12 sm:py-12 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-12">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ff5c35]">
              Perjalanan Adalah Penyembuhan - Trip
            </p>
            <h1 className="mt-3 text-5xl font-black uppercase tracking-[-0.07em] sm:text-8xl">
              {trip.destination}
            </h1>
          </div>
          <div className="border-4 border-[#111111] bg-[#ffffff] p-2 shadow-[4px_4px_0_#111111]">
            <Image
              src={photoUrl}
              alt={`Travel destination landscape for ${trip.destination}`}
              width={1600}
              height={900}
              priority
              unoptimized
              className="aspect-video w-full border-4 border-[#111111] object-cover object-center"
            />
            <p className="px-2 py-3 text-xs font-black uppercase tracking-widest text-[#111111]">
              Photo from{" "}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Unsplash
              </a>
            </p>
          </div>
          <div className="mt-8 grid gap-4 lg:col-span-2 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-4 border-[#111111] bg-[#ff5c35] p-5 shadow-[4px_4px_0_#111111]">
              <p className="text-xs font-black uppercase tracking-widest">
                Budget
              </p>
              <p className="mt-3 text-xl font-black">
                {formatCurrency(trip.budget)}
              </p>
            </div>
            <div className="border-4 border-[#111111] bg-[#f5d547] p-5 shadow-[4px_4px_0_#111111]">
              <p className="text-xs font-black uppercase tracking-widest">
                Days
              </p>
              <p className="mt-3 text-xl font-black">{trip.days} days</p>
            </div>
            <div className="border-4 border-[#111111] bg-[#f5d547] p-5 shadow-[4px_4px_0_#111111]">
              <p className="text-xs font-black uppercase tracking-widest">
                Daily budget
              </p>
              <p className="mt-3 text-xl font-black">
                {formatCurrency(trip.daily_budget)}
              </p>
            </div>
            <div className="border-4 border-[#111111] bg-[#ff5c35] p-5 shadow-[4px_4px_0_#111111]">
              <p className="text-xs font-black uppercase tracking-widest">
                Trip style
              </p>
              <p className="mt-3 text-xl font-black">{trip.category}</p>
            </div>
          </div>
        </section>

        <article className="border-4 border-[#111111] bg-[#fffdf8] p-6 shadow-[8px_8px_0_#111111] sm:p-8">
          <div className="mb-8 border-b-0 border-[#111111] pb-0">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#111111]">
              AI recommendation for
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.04em]">
              Your {trip.destination} {trip.days}-Day Itinerary
            </h2>
          </div>
          <MarkdownContent
            content={
              trip.ai_recommendation || "Your recommendation is being prepared."
            }
          />
        </article>
      </div>
    </main>
  );
}
