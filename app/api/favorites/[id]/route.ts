// app/api/favorites/[id]/route.ts
import { NextResponse, type NextRequest } from "next/server";
import fs from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "data", "favorites.json");

// Pomoćna za čitanje
function readFavorites(): any[] {
  try {
    const file = fs.readFileSync(FILE_PATH, "utf8");
    return JSON.parse(file);
  } catch {
    return [];
  }
}

// Pomoćna za pisanje
function writeFavorites(favorites: any[]) {
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(favorites, null, 2), "utf8");
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const favorites = readFavorites();
  const filtered = favorites.filter((item) => item.id !== id);

  if (filtered.length === favorites.length) {
    // ništa nije obrisano
    return NextResponse.json(
      { error: "Item not found" },
      { status: 404 }
    );
  }

  writeFavorites(filtered);
  return NextResponse.json({ message: "Removed from favorites" });
}
