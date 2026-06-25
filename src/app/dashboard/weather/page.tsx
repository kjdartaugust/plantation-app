"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Topbar } from "@/components/topbar";
import { SectionCard, EmptyState } from "@/components/ui";
import {
  describeWeather,
  farmAdvisory,
  WeatherResponse,
} from "@/lib/weather";
import { Droplets, Wind, Thermometer, Gauge, Lightbulb } from "lucide-react";

export default function WeatherPage() {
  const { data } = useStore();
  const [farmId, setFarmId] = useState("");
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const farm = data.farms.find((f) => f.id === farmId) ?? data.farms[0];

  useEffect(() => {
    if (data.farms.length && !farmId) setFarmId(data.farms[0].id);
  }, [data.farms, farmId]);

  useEffect(() => {
    if (!farm) return;
    let active = true;
    setLoading(true);
    setError("");
    fetch(`/api/weather?lat=${farm.latitude}&lon=${farm.longitude}`)
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        if (d.error) setError(d.error);
        else setWeather(d);
      })
      .catch(() => active && setError("Could not load weather"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [farm?.id, farm?.latitude, farm?.longitude]);

  if (!farm) {
    return (
      <>
        <Topbar title="Weather" />
        <div className="p-5">
          <EmptyState message="Register a farm to view its weather forecast." />
        </div>
      </>
    );
  }

  const cur = weather?.current;
  const desc = cur ? describeWeather(cur.weather_code) : null;

  return (
    <>
      <Topbar title="Weather" />
      <div className="space-y-6 p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Live forecast via Open-Meteo for{" "}
            <span className="font-medium text-foreground">{farm.location}</span>
          </p>
          <select
            className="input max-w-xs"
            value={farmId}
            onChange={(e) => setFarmId(e.target.value)}
          >
            {data.farms.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="card border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        {loading && !weather ? (
          <div className="card p-10 text-center text-sm text-muted-foreground">
            Loading forecast…
          </div>
        ) : weather && cur ? (
          <>
            <div className="card flex flex-wrap items-center justify-between gap-6 p-6">
              <div className="flex items-center gap-5">
                <span className="text-6xl">{desc?.icon}</span>
                <div>
                  <p className="text-4xl font-bold">{Math.round(cur.temperature_2m)}°C</p>
                  <p className="text-muted-foreground">{desc?.label}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
                <Metric icon={Droplets} label="Humidity" value={`${cur.relative_humidity_2m}%`} />
                <Metric icon={Wind} label="Wind" value={`${Math.round(cur.wind_speed_10m)} km/h`} />
                <Metric icon={Gauge} label="Rain now" value={`${cur.precipitation} mm`} />
                <Metric icon={Thermometer} label="High today" value={`${Math.round(weather.daily.temperature_2m_max[0])}°`} />
              </div>
            </div>

            <div className="card flex items-start gap-3 border-primary/30 bg-primary/8 p-4">
              <Lightbulb className="mt-0.5 h-5 w-5 text-primary" />
              <div className="text-sm">
                <p className="font-medium">Agronomic advisory</p>
                <p className="text-muted-foreground">{farmAdvisory(weather)}</p>
              </div>
            </div>

            <SectionCard title="7-Day Forecast">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                {weather.daily.time.map((day, i) => {
                  const d = describeWeather(weather.daily.weather_code[i]);
                  return (
                    <div key={day} className="rounded-lg border border-border p-3 text-center">
                      <p className="text-xs font-medium text-muted-foreground">
                        {new Date(day).toLocaleDateString("en", { weekday: "short" })}
                      </p>
                      <p className="my-1 text-2xl">{d.icon}</p>
                      <p className="text-sm font-semibold">
                        {Math.round(weather.daily.temperature_2m_max[i])}°
                        <span className="text-muted-foreground">
                          {" "}/ {Math.round(weather.daily.temperature_2m_min[i])}°
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-primary">
                        💧 {weather.daily.precipitation_probability_max[i]}%
                      </p>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </>
        ) : null}
      </div>
    </>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
