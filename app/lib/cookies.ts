export interface PlaceData {
  name: string;
  lat: number;
  lon: number;
}

export function savePlaceToCookie(place: PlaceData): void {
  if (typeof document !== 'undefined') {
    document.cookie = `place=${JSON.stringify(place)}; path=/; max-age=31536000`;
  }
}

export function getPlaceFromCookie(): PlaceData | null {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/place=([^;]+)/);
    if (match) {
      try {
        return JSON.parse(decodeURIComponent(match[1]));
      } catch {
        return null;
      }
    }
  }
  return null;
}