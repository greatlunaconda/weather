'use client';

import Link from "next/link";
import { useState } from "react";

export default function Menu() {
  const [menu, setMenu] = useState(false);
  const showMenu = () => {
    setMenu(true);

  }  

  return (
    <div className="menu-container">
      <button onClick={() =>showMenu()}> menu </button>
      {menu == true && (
    
      <div className="menu-items">        
          <div className="menu-content">
            <Link href="/select-place">Select Place</Link>
          </div>
   
  
      <div className="menu-content">
        <p>Language content</p>
     </div>
      <div className="menu-content">
           <p>About us content</p>
      </div>
       
  
    </div>
    
      )}
    </div>

    )
}
