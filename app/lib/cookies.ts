'use server'

import { cookies } from 'next/headers';

export interface PlaceData {
  name: string;
  lat: number;
  lon: number;
}

export async function savePlaceToCookie(place: PlaceData): Promise<void> {
  const cookies = await import('next/headers').then(m => m.cookies);
  await cookies().set('place', JSON.stringify(place), {
    path: '/',
    maxAge: 31536000
  });
}

export async function getPlaceFromCookie(): Promise<PlaceData | null> {
  const cookies = await import('next/headers').then(m => m.cookies);
  const placeCookie = await cookies().get('place');
  if (placeCookie) {
    try {
      return JSON.parse(placeCookie.value);
    } catch {
      console.error("Error parsing place cookie");
    }
  }
  return null;
}

export async  function  getShowCurrentPlace() {
  const currentplace = await cookies().get('showcurrent');
   if (currentplace)  {return true;} else {
    return false;
   } 
}

export async function  saveShowCurrrentPlace(showcurrent: boolean) {
  await  cookies().set('showcurrent', JSON.stringify('showcurrent'), {
    path: '/',
    maxAge: 31536000
  });
}