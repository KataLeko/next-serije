// prikaz svih glumaca neke serije
import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/app/components/FavoriteButton";

type CastMember = {
  person: {
    id: number;
    name: string;
    image?: { medium: string; original: string };
  };
  character: { // koga glumi
    id: number;
    name: string;
  };
};

export default async function CastPage({ params }: any) {
  const res = await fetch(`https://api.tvmaze.com/shows/${params.id}/cast`);
  if (!res.ok) throw new Error("Greška pri dohvaćanju glumaca.");
  const cast: CastMember[] = await res.json();

  return (
    <main className="p-6 max-w-6xl mx-auto text-white">
      <h1 className="text-4xl font-extrabold tracking-tight text-white mb-8">
        Glumačka postava
      </h1>
      <Link
        href={`/series/${params.id}`}
        className="inline-block mb-6 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300"
      >
        Natrag na seriju
      </Link>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {cast.map(({ person, character }) => (
          <div
            key={`${person.id}-${character.id}`}
            className="relative bg-neutral-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="absolute top-3 right-3 z-10"> {/* za dodavanje u favorite*/}   
                <FavoriteButton
                item={{
                  id: String(person.id),
                  title: person.name,
                  poster: person.image?.medium || "",
                  type: "actor",
                }}
              />
            </div>

            {person.image?.medium ? (
              <Image
                src={person.image.medium}
                alt={person.name}
                width={300}
                height={400}
                className="w-full h-auto object-cover rounded-t-2xl"
              />
            ) : (
              <div className="w-full h-[300px] bg-gray-800 flex items-center justify-center text-gray-400 text-sm">
                Nema slike
              </div>
            )}

            <div className="p-4">
              <Link href={`/person/${person.id}`}>
                <h2 className="relative text-white font-medium px-4 py-2 hover:text-red-700 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-red-700 hover:after:w-full after:transition-all after:duration-300">
                  {person.name}
                </h2>
              </Link>
              <p className="text-sm text-gray-400 mt-0.5">
                Kao: {character.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
