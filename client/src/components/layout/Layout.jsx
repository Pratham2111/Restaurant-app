import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MobileMenu from "./MobileMenu";
import { Toaster } from "../ui/toaster";

/**
 * Layout component that wraps the entire application
 * Includes Header, Footer, MobileMenu, and Toast notifications
 */
function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleMobileMenu={toggleMobileMenu} />
      
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
}

export default Layout;