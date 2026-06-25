import { NextResponse } from "next/server";

// Proxies the free Open-Meteo forecast API (no API key required).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 });
  }

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max` +
    `&timezone=auto&forecast_days=7`;

  try {
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
    return NextResponse.json(await res.json());
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch weather", detail: String(e) },
      { status: 502 }
    );
  }
}
