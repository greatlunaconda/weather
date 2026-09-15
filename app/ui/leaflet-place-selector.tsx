'use client'
import { preload } from 'react-dom';
import { useState, useRef, useEffect } from 'react';
import { PlaceData } from '../lib/cookies';
import { LangProp } from '../page';


export interface LeafletSaveProps {
  onsave: (placedata: PlaceData ) => void;
}

preload('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', { as: 'style' });


async function getPlaceName({lat, lng, lang}:{ lat:number, lng:number, lang: string } ){
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=${lang}`,
              {
                headers: {
                  'User-Agent': 'WeatherApp/1.0'
                }
              }
            );
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Geocoding response:', data); // Debug log
            
            if (data.display_name) {
              return data.display_name;
            } else if (data.address) {
              // Fallback to constructing name from address components
              const parts = [];
              if (data.address.city) parts.push(data.address.city);
              if (data.address.state) parts.push(data.address.state);
              if (data.address.country) parts.push(data.address.country);
              return parts.join(', ') || `Location ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            } else {
              // Fallback to coordinates
              return `Location ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            }
          } catch (error) {
            console.error('Geocoding error:', error);
            // Fallback to coordinates if geocoding fails
            return `Location ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          }
  }



export default function LeafletPlaceSelector({ onsave, currentPlaces, lang }: { onsave: (placedata: PlaceData) => void;  currentPlaces : PlaceData[] | []; lang: LangProp }) {
  
  const [placename, setPlaceName] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }|null>(null) ;
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [editname, setEditName] = useState(false);

  const handleToggle = () => {
    const nextState = !editname;
    setEditName(nextState);
  };





  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return;

      // Dynamically import Leaflet
      const leaflet = await import('leaflet');
      const L = leaflet.default || leaflet; 
      
      // Fix for Leaflet default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      
      // Load saved place from cookie
      const savedPlaceses = currentPlaces;
     
            
      if (mapRef.current && !mapInstance.current) {
        // Initialize Leaflet map
        const map = L.map(mapRef.current);
        navigator.geolocation.getCurrentPosition((pos)=> 
          map.setView([pos.coords.latitude, pos.coords.longitude],10), (pos) => map.setView([35.689574, 139.693550, 10])
      );

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        mapInstance.current = map;

        // Add marker if saved place exists
        savedPlaceses.forEach?.(el => {
          if (el && typeof el.lat === 'number' && typeof el.lng === 'number') {
            L.marker([el.lat, el.lng]).addTo(map);
          }
        });

        // Handle map clicks
        map.on('click', async (e: any) => {
          const { lat, lng } = e.latlng;
          const  newcoordinate = { lat, lng };
          setCoordinates(newcoordinate);
          
          // Remove existing marker
          if (markerRef.current) {
            map.removeLayer(markerRef.current);
          }
          
          // Add new marker
          markerRef.current = L.marker([lat, lng]).addTo(map);
          
          // Get place name using Nominatim (OpenStreetMap's geocoding service)
          newcoordinate && setPlaceName(await getPlaceName({lat:newcoordinate.lat, lng:newcoordinate.lng, lang:lang[0]}));
          
        });
      }
    };  
    loadLeaflet();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        
      }
    };
   } , [] );

    return (
      <>
     <link
        rel="stylesheet"
        href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        precedence="default" 
      /> 
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-[12px]">
        <button 
        type="button"
        role="switch"
        aria-checked={editname}
        className={`relative w-[85px] h-[28px] rounded-full border-none p-0 flex items-center cursor-pointer transition-colors duration-200 ${
          editname ? 'bg-[#4cd964]' : 'bg-[#e4e4e7]'}` }
        onClick={handleToggle}
        >
        {/* 💡 オフの時だけ右側に表示される「デフォルト」の文字 */}
        {!editname && <span className="absolute right-[10px] text-[11px] font-medium text-[#71717a] select-none pointer-events-none">デフォルト</span>}

        {/* 動く丸いツマミ */}
          <span className={`absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.15)] transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            editname ? 'translate-x-[3px]' : 'translate-x-[60px]'}`}   />
        </button>

        <span className="text-[14px] font-bold">
          {editname ? '地名を保存中' : `The default name consists of the latitude  longitude, and the place name of the observation site` }          
        {coordinates && `Place name is  ${coordinates.lat.toFixed(2)}  ${coordinates.lng.toFixed(2)}  The observation site`}
        </span>
      </div>

      <div className="mb-4">
        
        <span>Pointing Place</span>
        <input
          type="text"
          value={placename} 
          readOnly={!editname} 
          onChange={(e) => setPlaceName(e.target.value)}
          placeholder="Enter plac e name"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      <div ref={mapRef} className="w-full h-96 border border-gray-300 rounded mb-4" />
      
      {coordinates && (
        <div className="mb-4 text-sm text-gray-600">
          <p>Latitude: {coordinates.lat.toFixed(6)}</p>
          <p>Longitude: {coordinates.lng.toFixed(6)}</p>
        </div>
      )}
      
      <button
        onClick={() => {
          if (coordinates && placename) {
            const saveplacename = editname ? placename: "default: "+placename;
              
            
            console.log('Saving place:', { name: placename, lat: coordinates.lat, lng: coordinates.lng }); // Debug log
            onsave({ name: saveplacename, lat: String(coordinates.lat), lng: String(coordinates.lng) } as PlaceData);
            setCoordinates(null);
            setPlaceName("");
          }
        }}
        disabled={!placename || !coordinates}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
      >
        Add Place
      </button>
    </div>
</>  
  );
}
