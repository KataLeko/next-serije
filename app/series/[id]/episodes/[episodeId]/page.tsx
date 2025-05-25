//komponenta za prikaz detalja pojedine epizode
import Link from "next/link";
import { Metadata } from "next";

type Episode = {
  id: number;
  name: string;
  season: number;
  number: number;
  airdate: string;
  summary: string | null;
  image?: {
    medium: string;
    original: string;
  };
};

type Props = {
  params: {
    id: string;
    episodeId: string;
  };
};
// naslov i opis za SEO 
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const res = await fetch(
    `https://api.tvmaze.com/episodes/${params.episodeId}`
  );
  if (!res.ok)
    return {
      title: "Detalji epizode",
      description: "Informacije o TV epizodi.",
    };
  const episode: Episode = await res.json();

  return {
    title: `${episode.name} – S${episode.season}E${episode.number}`,
    description:
      episode.summary?.replace(/<[^>]+>/g, "").slice(0, 150) ||
      "Detalji o TV epizodi.",
  };
}

export default async function EpisodeDetailPage({ params }: any) {
  const res = await fetch(
    `https://api.tvmaze.com/episodes/${params.episodeId}`
  );
  if (!res.ok) throw new Error("Greška pri dohvaćanju epizode.");
  const episode: Episode = await res.json();

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("hr-HR");

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-white">{episode.name}</h1>
      <p className="mb-2 text-gray-400">
        Sezona {episode.season}, Epizoda {episode.number} | Emitirano:{" "}
        {formatDate(episode.airdate)}
      </p>

      {episode.image?.medium && (
        <img
          src={episode.image.medium}
          alt={episode.name}
          className="rounded-xl mb-4 w-full max-w-md shadow-md"
        />
      )}

      {episode.summary && (
        <div
          className="prose max-w-none text-white"
          dangerouslySetInnerHTML={{ __html: episode.summary }}  // nije ispravo prikazivalo tekst bez ovoga
        />
      )}

      <div className="mt-6">
        <Link
          href={`/series/${params.id}/episodes`}
          className="inline-block bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition-all duration-300 hover:scale-105"
        >
          Natrag na popis epizoda
        </Link>
      </div>
    </main>
  );
}
