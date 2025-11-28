
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Menu } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path ? 'text-brand-accent' : 'text-gray-300 hover:text-white';

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-brand-yellow p-1 rounded">
                <Car className="text-black" size={24} />
              </div>
              <span className="font-display font-bold text-2xl tracking-tighter">
                TARGA<span className="text-brand-accent">IME</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className={`${isActive('/')} px-3 py-2 rounded-md text-sm font-medium transition-colors`}>Kreu</Link>
              <Link to="/builder" className={`${isActive('/builder')} px-3 py-2 rounded-md text-sm font-medium transition-colors`}>Krijo</Link>
              <Link to="/gallery" className={`${isActive('/gallery')} px-3 py-2 rounded-md text-sm font-medium transition-colors`}>Galeria</Link>
              <a href="https://instagram.com/targa_ime" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-pink-500 transition-colors px-3 py-2 rounded-md text-sm font-medium">Instagram</a>
            </div>
          </div>
          
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300 hover:text-white p-2">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800 px-2 pt-2 pb-3 space-y-1 sm:px-3">
           <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800">Kreu</Link>
           <Link to="/builder" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800">Krijo</Link>
           <Link to="/gallery" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800">Galeria</Link>
        </div>
      )}
    </nav>
  );
};
