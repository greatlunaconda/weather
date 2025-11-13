import { useState } from "react";
import { getPlaceFromCookie, PlaceData } from "../lib/cookies"
//import PlaceSelector from "../ui/place-selector";
import PlaceTable from "../ui/placetable";
import LeafletPlaceSelector from "../ui/leaflet-place-selector";
import Showcurrent from "../ui/showcurrent";

export default async function selectPlace() {
  const currentplaces = await getPlaceFromCookie();

  
  

  return (
    <>
    <div>
      < Showcurrent />
    </div>
    <div>
       < PlaceTable  />
    </div>
    </>
 )
}
