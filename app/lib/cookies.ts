'use server'

import { cookies } from 'next/headers';

export interface PlaceData {
  name: string;
  lat: number;
  lng: number;
}

export  async function savePlaceToCookie(places: PlaceData[] | []): Promise<void> {
  await  cookies().set('place', JSON.stringify(places), {
    path: '/',
    maxAge: 31536000
  });
}

export  async function getPlaceFromCookie(): Promise<PlaceData[] | []> {
  const placeCookie = await cookies().get('place');
  if (placeCookie) {
    try {
      return JSON.parse(placeCookie.value);
    } catch {
      Error("shmething wrong on parsing cookies");
    }
  }
  return [];
}