import { cookie } from 'next/headers';

export default async function Rows(){
    const cookieStore = await cookies();
    const points = cookieStore.get('points');
  
    return (
         {points?.map((point)=> 
         <Row name={point.name} lat={point.lat} lon={point.lon} > 
     ) }
    )
}

export async function Row(name, lat, lon) {
 const  weather = await fetchWeathea(lat, lon);    
  return (<div>
             <div><span>{name}</span></div>   
             <div>
               <div>Date</div>
               <div>weather</div>  
               <div>pop</div>
               <div>temp</div>
            </div> 
            
            <div>
               <div>{getlocal(wearher.dt, )})</div>
               <div>weather.icon</div>
               <div>weather.pop</div>
               <div>weather.ml</div>
               <div><span>weather.mintmp</span> 
                    <span>weather.maxtmp</span>
               </div>  
             
             </div>  
          </div>)
}
            
default async function Detail() {
   return(
     <div>weather.date</div>
     <div>weather.icon</div>
     <div>weather
      
*/