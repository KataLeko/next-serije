'use client';

import { useState, useEffect } from 'react';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';

export default function FavoriteButton({
  item,
}: {
  item: {
    id: string;
    title: string;
    poster: string;
    type: string;
    showTitle?: string;
    season?: number;
    showId?: string;
  };
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      const res = await fetch('/api/favorites');
      const data = await res.json();
      const found = data.find((fav: any) => fav.id === item.id);
      setIsFavorite(!!found);
    };
    fetchFavorites();
  }, [item.id]);

  const toggleFavorite = async () => {
    if (isFavorite) {
      await fetch(`/api/favorites/${item.id}`, { method: 'DELETE' });
      setIsFavorite(false);
      window.dispatchEvent(new Event('favoritesUpdated'));
    } else {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      setIsFavorite(true);
      window.dispatchEvent(new Event('favoritesUpdated'));
    }
  };

  return (
    <button onClick={toggleFavorite} className="text-red-500" aria-label={isFavorite ? "Ukloni iz favorita" : "Dodaj u favorite"}>
      {isFavorite ? (
        <HeartSolid className="w-6 h-6 fill-red-600" />
      ) : (
        <HeartOutline className="w-6 h-6 stroke-red-600" />
      )}
    </button>
  );
}
