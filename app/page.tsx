'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Show = {
  id: number;
  name: string;
  rating: { average: number | null };
  image?: { medium: string };
};

export default function HomePage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [visibleCount, setVisibleCount] = useState(15);

  useEffect(() => {
    const fetchShows = async () => {
      const res = await fetch('https://api.tvmaze.com/shows');
      const data = await res.json();

      const topRated = data
        .filter((show: Show) => show.rating?.average)
        .sort((a: Show, b: Show) => (b.rating.average ?? 0) - (a.rating.average ?? 0));

      setShows(topRated);
    };

    fetchShows();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 15);
  };

  return (
    <main className="p-4">
      <h1 className="text-white text-3xl font-bold mb-6">Najbolje ocijenjene serije</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {shows.slice(0, visibleCount).map((show) => (
          <Link key={show.id} href={`/series/${show.id}`} className="block">
            <div className="rounded overflow-hidden shadow hover:shadow-lg transition">
              {show.image?.medium && (
                <Image
                  src={show.image.medium}
                  alt={show.name}
                  width={210}
                  height={295}
                  className="w-full h-auto"
                />
              )}
              <div className="p-2">
                <h2 className="text-md text-center font-semibold truncate">{show.name}</h2>
                <p className="text-sm text-center text-gray-500">Ocjena: {show.rating.average ?? 'N/A'}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {visibleCount < shows.length && (
        <div className="mt-6 text-center">
          <button
            onClick={handleLoadMore}
            className="bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition-all duration-300 hover:scale-105">
           Prikaži još
          </button>
        </div>
      )}
    </main>
  );
}
