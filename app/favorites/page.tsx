"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";

interface FavoriteItem {
  id: string;
  title: string;
  poster: string;
  type: string;
  showTitle?: string;
  season?: number;
  showId?: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const pathname = usePathname();

  const fetchFavorites = () => {
    fetch("/api/favorites")
      .then((res) => res.json())
      .then(setFavorites);
  };

  useEffect(() => {
    if (pathname === "/favorites") {
      fetchFavorites();
    }
  }, [pathname]);

  const removeFavorite = async (id: string) => {
    await fetch(`/api/favorites/${id}`, { method: "DELETE" });
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const seriesFavorites = favorites.filter((f) => f.type === "series");
  const episodeFavorites = favorites.filter((f) => f.type === "episode");
  const actorFavorites = favorites.filter((f) => f.type === "actor");

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tvoji favoriti</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-600">Nema spremljenih favorita.</p>
      ) : (
        <div className="space-y-10">
          {seriesFavorites.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Serije</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {seriesFavorites.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white text-black text-sm font-semibold text-center  rounded-xl shadow p-3 relative"
                  >
                    <Link href={`/series/${item.id}`}>
                      {item.poster ? (
                        <Image
                          src={item.poster}
                          alt={item.title}
                          width={200}
                          height={300}
                          className="rounded-xl hover:opacity-90 transition"
                        />
                      ) : (
                        <div className="w-48 h-72 bg-gray-200 rounded-xl" />
                      )}
                    </Link>
                    <p className="mt-2 font-medium text-sm">{item.title}</p>
                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="ml-4 text-red-600 hover:text-red-800 transition"
                      aria-label="Ukloni iz favorita"
                    >
                      <HeartSolid className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {episodeFavorites.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4"> Epizode</h2>
              <div className="space-y-4">
                {episodeFavorites.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow transition"
                  >
                    <Link
                      href={`/series/${item.showId}/episodes/${item.id}`}
                      className="flex-1"
                    >
                      <p className=" text-white  font-semibold">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        Serija: {item.showTitle} | Sezona: {item.season}
                      </p>
                    </Link>
                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="ml-4 text-red-600 hover:text-red-800 transition"
                      aria-label="Ukloni iz favorita"
                    >
                      <HeartSolid className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {actorFavorites.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Glumci</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {actorFavorites.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white text-black text-center rounded-xl shadow p-3 relative"
                  >
                    <Link href={`/person/${item.id}`}>
                      {item.poster ? (
                        <Image
                          src={item.poster}
                          alt={item.title}
                          width={200}
                          height={300}
                          className="rounded-xl hover:opacity-90 transition"
                        />
                      ) : (
                        <div className="w-48 h-72 bg-gray-200 rounded-xl" />
                      )}
                    </Link>
                    <p className="mt-2 font-medium text-sm">{item.title}</p>
                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="ml-4 text-red-600 hover:text-red-800 transition"
                      aria-label="Ukloni iz favorita"
                    >
                      <HeartSolid className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
