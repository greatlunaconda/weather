'use server'

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export interface PlaceData {
  name: string;
  lat: string;
  lng: string;
}

export async function savePlacesToCookie(places: PlaceData[] | null): Promise<void> {
  const cookiestore = await cookies();
  cookiestore.set('places', JSON.stringify(places), {
    path: '/',
    maxAge: 31536000
  });
}

export async function getPlacesFromCookie(): Promise<PlaceData[]> {
  const placeCookie = await cookies().get('places');
  if (placeCookie) {
    try {
      return JSON.parse(placeCookie.value);
    } catch {
      console.error("Error parsing places cookie");
    }
  }
  return [];
}

export type Language = 'en' | 'ja' | 'zh_cn' | 'ru' | 'es' | 'fr' | 'ar';

export async function saveLanguage(language: Language) {
  const cookiestore = await cookies();
  cookiestore.set('language', JSON.stringify(language), {
    path: '/',
    maxAge: 31536000
}); 
  revalidatePath('/');
}

export async function getLanguage(): Promise<Language> {
  const language = await cookies().get('language');
  if (language) {
    try {
      return JSON.parse(language.value);
    } catch {
      console.error("Error parsing language from cookie");
    }
  }  return  'en';
}
export async function  saveShowCurrrentPlace(showcurrent: boolean) {
  const cookiestore = await cookies();
  cookiestore.set('showcurrent', JSON.stringify(showcurrent), {
    path: '/',
    maxAge: 31536000
  });
  revalidatePath('/');
}


export async  function  getShowCurrentPlace() {
  const currentplace = await cookies().get('showcurrent');
   if (currentplace)  {return JSON.parse(currentplace.value);} else {
    return false;
   } 
}

