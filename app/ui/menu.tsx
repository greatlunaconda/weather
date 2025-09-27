'use client';

import Link from "next/link";
import { useState } from "react";

export default function Menu() {
  const [activeMenu, setActiveMenu] = useState('');

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? '' : menuName);
  };

  return (
    <div className="menu-container">
      <div className="menu-items">
        <button 
          onClick={() => handleMenuClick('selectPlace')}
          className="menu-button"
        >
          Select Place
        </button>
        {activeMenu === 'selectPlace' && (
          <div className="menu-content">
            <Link href="/leaflet-place-selector">Select Place</Link>
          </div>
        )}
        
        <button
          onClick={() => handleMenuClick('language')}
          className="menu-button"
        >
          Language
        </button>
        {activeMenu === 'language' && (
          <div className="menu-content">
            <p>Language content</p>
          </div>
        )}
        
        <button 
          onClick={() => handleMenuClick('aboutUs')}
          className="menu-button"
        >
          About us
        </button>
        {activeMenu === 'aboutUs' && (
          <div className="menu-content">
            <p>About us content</p>
          </div>
        )}
      </div>
    </div>
  );
}