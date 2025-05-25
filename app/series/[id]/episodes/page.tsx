//komponneta za prikazs svih epizoda pojedine serije
import Link from "next/link";
import FavoriteButton from "@/app/components/FavoriteButton";

export async function generateMetadata({ params }: any) {
  const showRes = await fetch(`https://api.tvmaze.com/shows/${params.id}`);
  if (!showRes.ok) {
    return {
      title: 'Epizode serije',
      description: 'Popis svih epizoda serije.',
    };
  }
  const show = await showRes.json();

  return {
    title: `Epizode – ${show.name}`,
    description: `Pogledaj sve epizode serije "${show.name}", uključujući datume emitiranja i opise.`,
  };
}

type Episode = {
  id: number;
  name: string;
  season: number;
  number: number;
  airdate: string;
  summary: string | null;
};

type Props = {
  params: { id: string };
};

export default async function EpisodesPage({ params }: any) {
  const res = await fetch(`https://api.tvmaze.com/shows/${params.id}/episodes`);
  if (!res.ok) throw new Error('Failed to fetch episodes');
  const episodes: Episode[] = await res.json();

  const showRes = await fetch(`https://api.tvmaze.com/shows/${params.id}`);
  const show = await showRes.json();

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("hr-HR");

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Epizode serije: {show.name}</h1>
      <Link
  href={`/series/${params.id}`}
  className="inline-block mb-6 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300"
>
   Natrag na seriju
</Link>
      <ul className="space-y-4">
        {episodes.map((ep) => (
          <li key={ep.id} className="border p-4 rounded hover:shadow relative">
            <div className="absolute top-2 right-2"> {/*za dodavanje epizode u favorite*/}
              <FavoriteButton
                item={{
                  id: String(ep.id),
                  title: ep.name,
                  poster: '',
                  type: 'episode',
                  showTitle: show.name,
                  season: ep.season,
                  showId: params.id,
                }}
              />
            </div>
            <Link href={`/series/${params.id}/episodes/${ep.id}`}> {/*za pogledat detalje odredjene epizode */}
              <h2 className="text-xl font-semibold">{ep.name}</h2>
              <p>Sezona {ep.season}, epizoda {ep.number}</p>
              <p>Datum emitiranja: {formatDate(ep.airdate)}</p>
              <p className="relative text-red-500 font-medium px-4 py-2 hover:text-red-700 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-red-700 hover:after:w-full after:transition-all after:duration-300">
                Pogledaj detalje epizode
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
