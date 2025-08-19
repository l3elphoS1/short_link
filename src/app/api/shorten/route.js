import { NextResponse } from "next/server";

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

function generateCode() {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const codeLength = 6;
  let result = "";
  for (let i = 0; i < codeLength; i++) {
    const idx = Math.floor(Math.random() * alphabet.length);
    result += alphabet[idx];
  }
  return result;
}

export async function POST(req) {
  const { url } = await req.json();
  const shortCode = generateCode();

  const response = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          ShortCode: shortCode,
          OriginalUrl: url,
        },
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json({ error: data }, { status: 400 });
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const baseNormalized = base ? base.replace(/\/$/, "") : "";
  const shortPath = `/${shortCode}`;
  const shortUrl = baseNormalized ? `${baseNormalized}${shortPath}` : shortPath;

  return NextResponse.json({ shortUrl });
}
