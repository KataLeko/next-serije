import { NextResponse } from "next/server";

let favorites: any[] = [];

export async function GET() {
  return NextResponse.json(favorites);
}

export async function POST(req: Request) {
  const data = await req.json();

  if (!data || !data.id || !data.title || !data.type) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  data.id = String(data.id);

  const exists = favorites.some(
    (item) => item.id === data.id && item.type === data.type
  ); //komb id i type jer npr.serija  i epizoda mogu imati isti id
  if (!exists) {
    favorites.push(data);
  }

  return NextResponse.json(
    { message: "Added to favorites", data },
    { status: 201 }
  );
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  if (!id || !type) {
    return new NextResponse(null, { status: 400 });
  }

  favorites = favorites.filter((f) => !(f.id === id && f.type === type));
  return new NextResponse(null, { status: 204 });
}
