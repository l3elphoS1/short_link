import { NextResponse } from "next/server";

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

function generateCode() {
  return Math.random().toString(36).substring(2, 8);
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

  return NextResponse.json({
    shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`,
  });
}
