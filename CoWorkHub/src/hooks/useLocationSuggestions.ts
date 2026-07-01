import { useEffect, useState } from "react";

export type LocationSuggestion = { id: string; label: string; value: string };

type PhotonFeature = {
  properties: {
    osm_type?: string; osm_id?: number;
    name?: string; city?: string; state?: string; country?: string;
  };
};

export function useLocationSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) { setSuggestions([]); setLoading(false); return; }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&limit=6&lang=en`,
          { signal: controller.signal }
        );
        const data = await res.json();
        const seen = new Set<string>();
        const results: LocationSuggestion[] = (data.features as PhotonFeature[] ?? [])
          .map((f, i) => {
            const p = f.properties ?? {};
            const name = p.name ?? p.city ?? "";
            const parts = [name, p.state, p.country].filter(Boolean) as string[];
            return { id: `${p.osm_type ?? "loc"}-${p.osm_id ?? i}`, label: Array.from(new Set(parts)).join(", "), value: name };
          })
          .filter(s => s.label && !seen.has(s.label) && seen.add(s.label));
        setSuggestions(results);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);

  return { suggestions, loading };
}
