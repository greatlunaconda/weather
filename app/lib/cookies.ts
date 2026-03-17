'use server'

import { cookies } from 'next/headers';

export interface PlaceData {
  name: string;
  lat: number;
  lon: number;
}

export async function savePlacesToCookie(places: PlaceData[] | null): Promise<void> {
  await cookies().set('places', JSON.stringify(places), {
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

export type Language = 'english' | 'japanese' | 'chinese' | 'russian' | 'spanish' | 'french' | 'arabic';

export async function saveLanguage(language: Language) {
  await cookies().set('language', JSON.stringify(language), {
    path: '/',
    maxAge: 31536000
});  
}

export async function getLanguage(): Promise<Language> {
  const language = await cookies().get('language');
  if (language) {
    try {
      return JSON.parse(language.value);
    } catch {
      console.error("Error parsing places cookie");
    }
  }  return  'english';
  
}
/*export async  function  getShowCurrentPlace() {
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

*/