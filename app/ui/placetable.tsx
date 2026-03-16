'use client'
import { useEffect, useReducer } from "react";
import { getPlacesFromCookie, PlaceData, savePlacesToCookie} from "../lib/cookies"
import LeafletPlaceSelector from "./leaflet-place-selector";
import { canvas } from "leaflet";

type State = {
  current: PlaceData[] ;
  places: PlaceData[];
  selector: boolean;
  cansave: boolean;
};

type Action =
  | { type: 'SET_CURRENT'; payload: PlaceData[] }
  | { type: 'SET_PLACES'; payload: PlaceData[] }
  | { type: 'TOGGLE_SELECTOR' }
  | { type: 'SET_CANSAVE'; payload: boolean }
  | { type: 'SAVE_PLACES'}
  | { type: 'MOVE_UP'; payload: PlaceData }
  | { type: 'MOVE_DOWN'; payload: PlaceData }
  | { type: 'DELETE_PLACE'; payload: PlaceData }
  | { type: 'ADD_PLACE'; payload: PlaceData }
  | { type: 'CANCEL' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_CURRENT':
      return { ...state, current: action.payload, places: action.payload };
    case 'SET_PLACES':
      
      return { ...state, places: action.payload };
    case 'TOGGLE_SELECTOR':
      return { ...state, selector: !state.selector };
    case 'SET_CANSAVE':
      return { ...state, cansave: action.payload };
    case 'SAVE_PLACES':   
      return {...state, places:state.current, cansave:false };
    case 'MOVE_UP': {
      const index = state.current.findIndex(el => el === action.payload);
      if (index > 0) {
        const newplaces = state.current.slice();
        newplaces.splice(index - 1, 0, newplaces.splice(index, 1)[0]);
        return { ...state, current: newplaces, cansave: true };
      }
      return state;
    }
    case 'MOVE_DOWN': {
      const index = state.current.findIndex(el => el === action.payload);
      if (index < state.current.length - 1) {
        const newplaces = state.current.slice();
        newplaces.splice(index + 1, 0, newplaces.splice(index, 1)[0]);
        return { ...state, current: newplaces, cansave: true };
      }
      return state;
    }
    case 'DELETE_PLACE':
      return {
        ...state,
        places: state.places.filter(p => p.name !== action.payload.name),
        cansave: true
      };
    case 'ADD_PLACE':
      return {
        ...state,
        places: [action.payload, ...state.places],
        cansave: true
      };
    case 'CANCEL':
      return {
        ...state,
        places: state.current || [],
        cansave: false
      };
    default:
      return state;
  }
};

export default function PlaceTable({places, savePlaces}:{ places:PlaceData[], savePlaces: (newplaces:PlaceData[] | null) => void })

  {
  
  const [state, dispatch] = useReducer(reducer, {
    current: places,
    places: places,
    selector: false,
    cansave: false,
  });
/*  
  useEffect( () => {
    (async () =>  {
    if(state.saved == true) {
      await savePlacesToCookie(state.places);
      dispatch({ type: 'SET_CANSAVE', payload: false });
      dispatch({ type: 'SET_SAVED', payload: false });
    } else {
      let currentPlaces = await getPlacesFromCookie();
      console.log(currentPlaces);
      dispatch({ type: 'SET_CURRENT', payload: currentPlaces });
    }
  })() 
  }  , [state.saved] )
  */
  const up = (place:PlaceData) => {
    dispatch({ type: 'MOVE_UP', payload: place });
  };

  const down = (place:PlaceData) => {
    dispatch({ type: 'MOVE_DOWN', payload: place });
  };

  const deletePlace = (place: PlaceData) => {
    dispatch({ type: 'DELETE_PLACE', payload: place });
  };

  const toggleSelector = () => dispatch({ type: 'TOGGLE_SELECTOR' });

  const addPlace = (placedata:PlaceData):void  =>  {     
    if (placedata.lat &&  placedata.lon &&  placedata.name) {
      dispatch({ type: 'ADD_PLACE', payload: placedata });
      alert('Place saved successfully!');
    }
  };

  const savePlalces = ()  => {
    if(state.cansave){
      savePlaces(state.current)  
      dispatch({ type: 'SAVE_PLACES'});
    }
  };

  const cancel = () => {
    dispatch({ type: 'CANCEL' });
  };
  

  return (
    <div>
      <div className="mb-4 space-x-2"> 
        <button onClick={savePlalces} disabled={!state.cansave} className={state.cansave?"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded": "bg-blue-100 hover:bg-blue-100 text-white font-bold py-2 px-4 rounded"}>
          Save
        </button>
        <button onClick={cancel} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Cancel
        </button>
        
      </div> 
      <div className="mb-4">
         <button onClick={() => toggleSelector()} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
           { state.selector ? "Close Map" : "Open Map" }
         </button> 
    { state.selector && <LeafletPlaceSelector  onsave={ addPlace }  currentPlaces={state.places} /> }

     </div>
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            Name
          </th>
          <th scope="col" className="px-6 py-3">
            Latitude
          </th>
          <th scope="col" className="px-6 py-3">
            Longitude
          </th>
        </tr>
      </thead>
      <tbody>
        {  state.places.map((place, index) =>  
        (
          <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {place.name}
            </td>
            <td className="px-6 py-4">
              {place.lat}
            </td>
            <td className="px-6 py-4">
              {place.lon}
            </td>
            <td className="px-6 py-4">
              <div>
                <button onClick={() => up(place)}>UP</button>
                <button onClick={() => down(place)}>DOWN</button>
              </div> 
            </td>
            <td className="px-6 py-4">
              <button onClick={() => deletePlace(place)}>
              Delete 
              </button>
              </td>
          </tr>
        )
      ) 
      } 
      </tbody>
    </table>
</div>
 )
}