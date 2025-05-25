// za prikaz detalja o glumcu

// ({ params }: any) -- nije htjelo na Vercelu raditi ako nije : any
// app/person/[id]/page.tsx
// Type error: Type '{ params: { id: string; }; }' does not satisfy the constraint 'PageProps'.
//   Types of property 'params' are incompatible.
//     Type '{ id: string; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]

import Image from "next/image";

type Person = {
  id: number;
  name: string;
  birthday: string | null;
  gender: string;
  country: { name: string } | null;
  image?: { medium: string; original: string };
  url: string;
};

export default async function PersonPage({ params }: any) {
  const res = await fetch(`https://api.tvmaze.com/people/${params.id}`);
  if (!res.ok) throw new Error("Greška pri dohvaćanju osobe.");
  const person: Person = await res.json();

  return (
    <main className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-4xl font-extrabold tracking-tight text-white mb-8">
        {person.name}
      </h1>

      <div className="flex flex-col md:flex-row gap-6 items-start bg-neutral-900 rounded-2xl shadow-lg p-6">
        {person.image?.medium ? (
          <Image
            src={person.image.medium}
            alt={person.name}
            width={240}
            height={340}
            className="rounded-xl shadow-md"
          />
        ) : (
          <div className="w-[240px] h-[340px] bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
            Nema slike
          </div>
        )}

        <div className="space-y-2 text-gray-300 text-base">
          <p>
            <span className="font-semibold text-white">Spol:</span>{" "}
            {person.gender}
          </p>
          <p>
            <span className="font-semibold text-white">Rođendan:</span>{" "}
            {person.birthday
              ? new Date(person.birthday).toLocaleDateString("hr-HR")
              : "Nepoznato"}
          </p>
          <p>
            <span className="font-semibold text-white">Država:</span>{" "}
            {person.country?.name ?? "Nepoznato"}
          </p>

          <a
            href={person.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition-all duration-300 hover:scale-105"
          >
            Više informacija na TVmaze
          </a>
        </div>
      </div>
    </main>
  );
}
