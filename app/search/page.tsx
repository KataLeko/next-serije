// za pretrazivanje serija i prikaz zanrova
"use client";

import { useEffect, useState, useDeferredValue } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Science-Fiction",
  "Thriller",
];

type Show = {
  id: number;
  name: string;
  image?: {
    medium: string;
    original: string;
  };
  genres: string[];
  rating?: {
    average: number | null;
  };
};

export default function SearchPage() {
  const [query, setQuery] = useState(""); // unos korisnika
  const deferredQuery = useDeferredValue(query);
  const [shows, setShows] = useState<Show[]>([]);
  const [filteredShows, setFilteredShows] = useState<Show[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showGenres, setShowGenres] = useState(false);
  const [page, setPage] = useState(0);

  const fetchShows = async (page: number) => {
    try {
      const res = await fetch(`https://api.tvmaze.com/shows?page=${page}`);
      const data: Show[] = await res.json();
      setShows((prev) => {
        const existingIds = new Set(prev.map((show) => show.id));
        const newShows = data.filter((show) => !existingIds.has(show.id));
        return [...prev, ...newShows];
      });
    } catch (err) {
      console.error("Greška pri dohvaćanju serija:", err);
    }
  };

  useEffect(() => {
    if (!deferredQuery.trim()) return;

    const fetchUntilMatch = async () => {
      let nextPage = 0;
      let found = false;
      let safetyLimit = 10;

      while (!found && safetyLimit > 0) {
        const res = await fetch(
          `https://api.tvmaze.com/shows?page=${nextPage}`
        );
        const data: Show[] = await res.json();
        if (!data.length) break;

        setShows((prev) => {
          const existing = new Set(prev.map((s) => s.id));
          const unique = data.filter((s) => !existing.has(s.id));
          return [...prev, ...unique];
        });

        const matches = data.filter((show) =>
          show.name.toLowerCase().includes(deferredQuery.toLowerCase())
        );
        if (matches.length > 0) found = true;

        nextPage++;
        safetyLimit--;
      }
    };

    fetchUntilMatch();
  }, [deferredQuery]);

  useEffect(() => {  //  filtrira serije na osnovu upita i odabranih zanrova
    const filtered = shows
      .filter((show) => {
        const matchesQuery = show.name
          .toLowerCase()
          .includes(deferredQuery.toLowerCase());
       // provjera je li serija ima jedan od odabranih zanrova, ako nije odabran zanr, sve prikazuje
          const matchesGenre =
          selectedGenres.length === 0 ||
          selectedGenres.some((genre) => show.genres.includes(genre));
        return matchesQuery && matchesGenre;
      })
      .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0)); // prikaz po ocjeni

    setFilteredShows(filtered);
  }, [deferredQuery, selectedGenres, shows]);
 // za dodavanje zanra 
  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre] // dodaj ga u odabrane
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Head>
        <title>Pretraga serija</title>
        <meta
          name="description"
          content="Pretražuj popularne serije po nazivu i žanru."
        />
      </Head>

      <h1 className="text-2xl font-bold mb-4">Pretraga serija</h1>

      <input
        type="text"
        placeholder="Pretraži serije..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        aria-label="Pretraga serija"
      />

      <div className="mb-6">
        <button
          onClick={() => setShowGenres(!showGenres)}
          className="bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 text-white text-sm font-medium px-4 py-1.5 rounded-lg shadow-sm transition-all duration-300 hover:scale-105"
        >
          {showGenres ? "Sakrij žanrove" : "Prikaži žanrove"}
        </button>

        {showGenres && (
          <div className="mt-4 flex flex-wrap gap-3">
            {GENRES.map((genre) => (
              <label
                key={genre}
                className={`cursor-pointer px-4 py-1 rounded-full border border-red-700 text-sm font-medium transition-colors duration-300 ${
                  selectedGenres.includes(genre)
                    ? "bg-red-700 text-white"
                    : "text-red-700 hover:bg-red-100"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => toggleGenre(genre)}
                />
                {genre}
              </label>
            ))}
          </div>
        )}
      </div>

      {filteredShows.length === 0 ? (
        <p>Nema rezultata.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredShows.map((show) => (
            <Link href={`/series/${show.id}`} key={`show-${show.id}`}>
              <div className="bg-white p-3 rounded shadow cursor-pointer hover:shadow-md">
                {show.image?.medium ? (
                  <Image
                    src={show.image.medium}
                    alt={`Poster serije ${show.name}`}
                    width={200}
                    height={300}
                    loading="lazy"
                    className="rounded"
                  />
                ) : (
                  <div className="w-48 h-72 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                    Nema slike
                  </div>
                )}
                <p className="mt-2 text-sm font-semibold text-center text-black">
                  {show.name}
                </p>
                <p className="text-xs text-gray-500 text-center">
                  Ocjena: {show.rating?.average ?? "N/A"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
