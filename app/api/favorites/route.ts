// app/api/favorites/route.ts
import { NextResponse, type NextRequest } from "next/server";
import fs from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "data", "favorites.json");

// Helper: očitaj favorite iz JSON filea
function readFavorites(): any[] {
  try {
    const file = fs.readFileSync(FILE_PATH, "utf8");
    return JSON.parse(file);
  } catch (e) {
    // Ako file ne postoji ili je prazan, vrati prazan array
    return [];
  }
}

// Helper: upiši favorite natrag u JSON file
function writeFavorites(favorites: any[]) {
  // osiguraj da direktorij postoji
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(favorites, null, 2), "utf8");
}

export async function GET() {
  const favorites = readFavorites();
  return NextResponse.json(favorites);
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  if (!data.id || !data.title || !data.type) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Osiguraj da je id string
  data.id = String(data.id);

  const favorites = readFavorites();
  const exists = favorites.find((item) => item.id === data.id);
  if (!exists) {
    favorites.push(data);
    writeFavorites(favorites);
  }

  return NextResponse.json({ message: "Added to favorites", data });
}


