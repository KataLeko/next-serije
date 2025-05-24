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

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  // Pretvori u string da je sigurno
  const idStr = String(id);

  const favorites = readFavorites();
  const filtered = favorites.filter((item) => item.id !== idStr);

  if (filtered.length === favorites.length) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  writeFavorites(filtered);
  return NextResponse.json({ message: "Removed from favorites" });
}
