import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Authentication endpoint" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ message: "Authentication successful" });
  } catch (error) {
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 500 }
    );
  }
}
