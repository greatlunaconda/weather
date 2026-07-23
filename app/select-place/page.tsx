import { getPlacesFromCookie, savePlacesToCookie, PlaceData } from "../lib/cookies"
//import PlaceSelector from "../ui/place-selector";
import PlaceTable from "../ui/placetable";
import LeafletPlaceSelector from "../ui/leaflet-place-selector";
import Showcurrent from "../ui/showcurrent";
import Link from "next/link";

export default async function selectPlace() {
  const currentplaces = await getPlacesFromCookie();

  
  

  return (
    <>
    <div>
      <button className="bg-orange-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-[25%] rounded">
         <Link href="/">Back to Weather</Link>
      </button>

    </div>
    <div>
      < Showcurrent />
    </div>
    <div>
       < PlaceTable   places={currentplaces} savePlaces={savePlacesToCookie} /> 
 ,    </div>
    </>
 )
}
