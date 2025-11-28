
import React, { useState } from 'react';

const categories = [
  "Të Gjitha",
  "Portotarga lluksi 3D",
  "Portotarga me logo uv",
  "Portotarga me logo 3D fabrikisht",
  "Portotarga motorri",
  "Targa te thjeshta",
  "Targa 3D",
  "Targa 4D",
  "Targa motori"
];

// Placeholder data - You can replace these URLs with your actual images later
const initialGalleryItems = [
  { 
    id: 1, 
    category: 'Targa 4D', 
    url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800', 
    title: 'Audi RS6 - 4D Style' 
  },
  { 
    id: 2, 
    category: 'Targa 3D', 
    url: 'https://images.unsplash.com/photo-1603584173870-7b299f589836?auto=format&fit=crop&q=80&w=800', 
    title: 'BMW M4 - 3D Gel' 
  },
  { 
    id: 3, 
    category: 'Portotarga lluksi 3D', 
    url: 'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=800', 
    title: 'Mercedes Benz Frame' 
  },
  { 
    id: 4, 
    category: 'Targa te thjeshta', 
    url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800', 
    title: 'Standard Plate' 
  },
  { 
    id: 5, 
    category: 'Portotarga me logo uv', 
    url: 'https://images.unsplash.com/photo-1580273916550-e323be2ebcc6?auto=format&fit=crop&q=80&w=800', 
    title: 'UV Logo Frame' 
  },
  { 
    id: 6, 
    category: 'Targa motori', 
    url: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&q=80&w=800', 
    title: 'Moto Custom' 
  },
];

export const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("Të Gjitha");

  const filteredItems = activeCategory === "Të Gjitha" 
    ? initialGalleryItems 
    : initialGalleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          Galeria e <span className="text-brand-accent">Punimeve</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Eksploroni koleksionin tonë sipas kategorive. 
          Na ndiqni në Instagram <a href="https://instagram.com/targa_ime" target="_blank" rel="noreferrer" className="text-brand-accent hover:underline">@targa_ime</a> për më shumë.
        </p>
      </div>

      {/* Category Tabs (Scrollable on mobile) */}
      <div className="mb-10 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-3 min-w-max px-2 justify-start md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                activeCategory === cat
                  ? 'bg-brand-accent text-black border-brand-accent shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
        {filteredItems.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-xl aspect-[4/3] border border-gray-800 bg-gray-900">
            <img 
              src={item.url} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
            
            {/* Category Tag */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
               <span className="text-xs font-bold text-brand-accent">{item.category}</span>
            </div>

            <div className="absolute bottom-0 left-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-xl font-bold font-display text-white">{item.title}</h3>
              <p className="text-gray-400 text-sm mt-1">Targa Ime Custom</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-800 rounded-2xl bg-gray-900/20">
          <p className="text-gray-500 text-lg mb-2">Nuk ka imazhe në këtë kategori për momentin.</p>
          <p className="text-gray-600 text-sm">Na dërgoni fotot tuaja për t'u shfaqur këtu!</p>
        </div>
      )}
    </div>
  );
};
