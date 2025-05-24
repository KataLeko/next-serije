import Link from 'next/link'
import Image from 'next/image'
import FavoriteButton from '@/app/components/FavoriteButton'


type Show = {
  id: number
  name: string
  genres: string[]
  rating: { average: number | null }
  summary: string
  image?: { medium: string; original: string }
  status: string
}

type Props = {
  params: { id: string }
}

export default async function SeriesDetailPage({ params }: Props) {
  const res = await fetch(`https://api.tvmaze.com/shows/${params.id}`)
  if (!res.ok) throw new Error("Greška pri dohvaćanju serije.")
  const show: Show = await res.json()

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold">{show.name}</h1>
        <FavoriteButton
          item={{
            id: String(show.id),
            title: show.name,
            poster: show.image?.medium || '',
            type: 'series',
          }}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {show.image?.medium && (
          <Image
            src={show.image.medium}
            alt={show.name}
            width={210}
            height={295}
            className="rounded"
          />
        )}
        <div>
          <p className="text-sm text-gray-600 mb-2">Status: {show.status}</p>
          <p className="text-sm text-gray-600 mb-2">
            Ocjena: {show.rating.average ?? 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Žanrovi: {show.genres.join(', ')}
          </p>
          <div
            className="prose max-w-none mt-2"
            dangerouslySetInnerHTML={{ __html: show.summary }}
          />
        </div>
      </div>

      <nav className="mt-6 flex gap-4">
        <Link
          href={`/series/${params.id}/episodes`}
           className="relative text-white font-medium px-4 py-2 hover:text-red-700 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-red-700 hover:after:w-full after:transition-all after:duration-300"
        >
           Epizode
        </Link>
        <Link
          href={`/series/${params.id}/cast`}
          className="relative text-white font-medium px-4 py-2 hover:text-red-700 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-red-700 hover:after:w-full after:transition-all after:duration-300"
        >
          Glumci
        </Link>
      </nav>
    </main>
  )
}
