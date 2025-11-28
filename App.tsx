
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { PlatePreview } from './components/PlatePreview';
import { Gallery } from './components/Gallery';
import { PlateConfig, PlateColor, PlateStyle, PlateShape } from './types';
import { Send, CheckCircle, Settings, Download, ChevronDown, Check } from 'lucide-react';
import { toPng } from 'html-to-image';

// Default Config
const initialConfig: PlateConfig = {
  text: 'TARGA IME',
  style: PlateStyle.ACRYLIC_4D,
  shape: PlateShape.STANDARD,
  color: PlateColor.YELLOW,
  customColor: '#ff0000',
  border: true,
  flag: 'UK',
  shineIntensity: 0.9 // Default for 4D
};

// Helper to get default intensity based on style
const getStyleIntensity = (style: PlateStyle): number => {
  switch (style) {
    case PlateStyle.ACRYLIC_4D: return 0.9;
    case PlateStyle.GEL_3D: return 0.7;
    case PlateStyle.FRAME_UV:
    case PlateStyle.FRAME_LUX:
    case PlateStyle.FRAME_FACTORY: return 0.5;
    default: return 0.3;
  }
};

const Home = () => (
  <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
    
    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-8xl font-display font-bold mb-6 tracking-tighter">
        DEFINE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-brand-accent">IDENTITY</span>
      </h1>
      <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
        Destinacioni kryesor për targa të personalizuara 3D & 4D. 
        Materiale të cilësisë së lartë dhe mjeshtëri e pakrahasueshme.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/builder" className="bg-brand-accent text-black font-bold text-lg px-8 py-4 rounded-full hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)]">
          Dizenjo Targën Tënde
        </Link>
        <Link to="/gallery" className="border border-white/30 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-white/10 transition-all">
          Shiko Galerinë
        </Link>
      </div>
    </div>
  </div>
);

const AccordionItem = ({ title, isOpen, onClick, children }: { title: string, isOpen: boolean, onClick: () => void, children?: React.ReactNode }) => (
  <div className="border-b border-gray-800 last:border-none">
    <button 
      className="w-full flex items-center justify-between py-4 text-left font-bold font-display text-lg hover:text-brand-accent transition-colors"
      onClick={onClick}
    >
      {title}
      <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-accent' : 'text-gray-500'}`} />
    </button>
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
      {children}
    </div>
  </div>
);

const Builder = () => {
  const [config, setConfig] = useState<PlateConfig>(initialConfig);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('text');

  const updateConfig = (key: keyof PlateConfig, value: any) => {
    setConfig(prev => {
      const newConfig = { ...prev, [key]: value };
      
      // If style changes, automatically set the recommended shine intensity
      if (key === 'style') {
        newConfig.shineIntensity = getStyleIntensity(value);
      }
      
      return newConfig;
    });
  };

  const toggleSection = (section: string) => {
    setActiveSection(prev => prev === section ? '' : section);
  };

  const handleDownload = async () => {
    const node = document.getElementById('plate-preview-canvas');
    if (!node) return;

    setIsDownloading(true);
    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        backgroundColor: 'transparent',
        pixelRatio: 2, // Higher quality
        fetchRequestInit: {
          mode: 'cors',
          credentials: 'omit',
        },
        onClone: (clonedNode) => {
            // Find the watermark element in the cloned DOM and make it visible
            const watermark = clonedNode.querySelector('#export-watermark') as HTMLElement;
            if (watermark) {
                watermark.style.opacity = '1';
                watermark.style.display = 'block';
            }
             // Find the QR Code element in the cloned DOM and make it visible
             const qrcode = clonedNode.querySelector('#export-qrcode') as HTMLElement;
             if (qrcode) {
                 qrcode.style.opacity = '1';
                 qrcode.style.display = 'block';
             }
            
            // Find and hide zoom controls in the cloned DOM
            const zoomControls = clonedNode.querySelector('#zoom-controls') as HTMLElement;
            if (zoomControls) {
                zoomControls.style.display = 'none';
            }
        }
      });

      const link = document.createElement('a');
      link.download = `targa-ime-${config.text}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
      alert("Nuk u arrit të gjenerohej imazhi. Ju lutemi provoni një shfletues tjetër.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Generate WhatsApp Link
  const getWhatsAppLink = () => {
    const message = `Përshëndetje Targa Ime, kam dizenjuar një targë në website:%0A
    - Teksti: ${config.text}%0A
    - Stili: ${config.style}%0A
    - Forma: ${config.shape}%0A
    - Ngjyra: ${config.color === PlateColor.CUSTOM ? `Custom (${config.customColor})` : config.color}%0A
    - Flamuri: ${config.flag || 'Pa flamur'}%0A
    - Korniza: ${config.border ? 'Po' : 'Jo'}%0A
    Jam i interesuar ta porosis.`;
    
    return `https://wa.me/355695850530?text=${message}`; 
  };

  // Helper for color button preview background
  const getColorPreviewStyle = (color: PlateColor) => {
    switch (color) {
      case PlateColor.YELLOW: return { background: '#FFD700' };
      case PlateColor.WHITE: return { background: '#F3F4F6' };
      case PlateColor.BLACK: return { background: 'linear-gradient(to bottom, #2a2a2a, #000000)' };
      case PlateColor.SILVER: return { background: 'linear-gradient(135deg, #e0e0e0 0%, #a0a0a0 100%)' };
      case PlateColor.CUSTOM: return { background: 'linear-gradient(45deg, #ff0000, #0000ff)' };
      default: return { background: '#fff' };
    }
  };

  return (
    // Flex direction reversed on mobile to show controls first (as requested)
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen flex flex-col-reverse lg:flex-row gap-8 lg:gap-12">
      
      {/* Left (Desktop) / Bottom (Mobile): Preview Area */}
      <div className="lg:w-1/2 flex flex-col gap-8">
        <div className="lg:sticky lg:top-28">
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
            <CheckCircle className="text-brand-accent" /> Pamja Live
          </h2>
          
          {/* Preview Component */}
          <PlatePreview config={config} />
          
          {/* Action Buttons */}
          <div className="mt-4">
             <button 
               onClick={handleDownload}
               disabled={isDownloading}
               className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-lg transition-colors font-bold border border-gray-700"
             >
               {isDownloading ? 'Duke procesuar...' : <><Download size={18} /> Shkarko Dizajnin</>}
             </button>
          </div>

          <div className="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-800">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Përmbledhje</h3>
            <div className="flex justify-between items-end">
              <div>
                 <div className="text-2xl font-bold text-white">{config.style}</div>
                 <div className="text-brand-yellow">{config.shape}</div>
              </div>
            </div>
            <a 
              href={getWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="mt-6 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-900/50"
            >
              <Send size={20} /> Porosit në WhatsApp
            </a>
            <p className="text-center text-xs text-gray-500 mt-3">
              Ose na shkruani në Instagram @targa_ime
            </p>
          </div>
        </div>
      </div>

      {/* Right (Desktop) / Top (Mobile): Controls */}
      <div className="lg:w-1/2 bg-gray-900/30 p-6 rounded-2xl border border-gray-800 backdrop-blur-md h-fit">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="text-brand-accent" size={24} />
          <h2 className="text-2xl font-display font-bold">Personalizo</h2>
        </div>

        <div className="divide-y divide-gray-800">
          
          {/* Registration Text Section */}
          <AccordionItem 
            title="Numri i Regjistrimit" 
            isOpen={activeSection === 'text'} 
            onClick={() => toggleSection('text')}
          >
             <input 
              type="text" 
              value={config.text}
              onChange={(e) => updateConfig('text', e.target.value.toUpperCase())}
              maxLength={8}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-4 text-3xl font-plate uppercase tracking-widest focus:border-brand-accent focus:outline-none transition-colors text-center text-white placeholder-gray-600"
              placeholder="SHKRUAJ KETU"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">Hapësira llogaritet si karakter</p>
          </AccordionItem>

          {/* Style Selection */}
          <AccordionItem 
            title="Stili i Targës" 
            isOpen={activeSection === 'style'} 
            onClick={() => toggleSection('style')}
          >
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {Object.values(PlateStyle).map((style) => (
                 <button
                   key={style}
                   onClick={() => updateConfig('style', style)}
                   className={`p-4 rounded-lg border text-left transition-all ${
                     config.style === style 
                       ? 'bg-brand-accent text-black border-brand-accent' 
                       : 'bg-black border-gray-700 text-gray-300 hover:border-gray-500'
                   }`}
                 >
                   <div className="font-bold">{style}</div>
                 </button>
               ))}
             </div>
          </AccordionItem>

          {/* Shape Selection */}
          <AccordionItem 
            title="Forma e Targës" 
            isOpen={activeSection === 'shape'} 
            onClick={() => toggleSection('shape')}
          >
             <div className="grid grid-cols-2 gap-3">
               {Object.values(PlateShape).map((shape) => (
                 <button
                   key={shape}
                   onClick={() => updateConfig('shape', shape)}
                   className={`p-3 rounded-lg border text-center transition-all ${
                     config.shape === shape 
                       ? 'bg-white text-black border-white' 
                       : 'bg-black border-gray-700 text-gray-300 hover:border-gray-500'
                   }`}
                 >
                   {shape}
                 </button>
               ))}
             </div>
          </AccordionItem>

           {/* Color Selection */}
           <AccordionItem 
            title="Sfondi / Ngjyra" 
            isOpen={activeSection === 'color'} 
            onClick={() => toggleSection('color')}
          >
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {Object.values(PlateColor).map((color) => (
                 <button
                   key={color}
                   onClick={() => updateConfig('color', color)}
                   className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${
                     config.color === color 
                       ? 'border-brand-accent ring-1 ring-brand-accent bg-gray-800' 
                       : 'border-gray-700 hover:border-gray-500 bg-black'
                   }`}
                 >
                   <div 
                    className="w-8 h-8 rounded-full border border-gray-500 shadow-sm"
                    style={getColorPreviewStyle(color)}
                   />
                   <span className="text-sm font-medium text-left">{color}</span>
                 </button>
               ))}
             </div>

             {/* Custom Color Picker Input */}
             {config.color === PlateColor.CUSTOM && (
               <div className="mt-4 animate-fadeIn">
                 <label className="block text-sm text-gray-400 mb-2">Zgjidhni ngjyrën e personalizuar:</label>
                 <div className="flex gap-4 items-center">
                   <input 
                    type="color"
                    value={config.customColor}
                    onChange={(e) => updateConfig('customColor', e.target.value)}
                    className="w-16 h-12 bg-transparent cursor-pointer rounded overflow-hidden"
                   />
                   <div className="text-gray-300 font-mono">{config.customColor}</div>
                 </div>
               </div>
             )}
          </AccordionItem>

           {/* Additional Options */}
           <AccordionItem 
            title="Opsione Shtesë" 
            isOpen={activeSection === 'options'} 
            onClick={() => toggleSection('options')}
          >
             <div className="space-y-4">
               {/* Border Toggle */}
               <div className="flex items-center justify-between p-3 bg-black border border-gray-700 rounded-lg">
                 <span className="text-gray-300">Kornizë e Zezë</span>
                 <button 
                   onClick={() => updateConfig('border', !config.border)}
                   className={`w-12 h-6 rounded-full relative transition-colors ${config.border ? 'bg-brand-accent' : 'bg-gray-700'}`}
                 >
                   <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${config.border ? 'translate-x-6' : ''}`} />
                 </button>
               </div>

               {/* Flag Selection */}
               <div>
                 <label className="block text-sm text-gray-400 mb-2">Flamuri / Logo</label>
                 <div className="flex gap-2">
                   {['UK', 'EU', null].map((flag) => (
                     <button
                       key={flag || 'none'}
                       onClick={() => updateConfig('flag', flag)}
                       className={`flex-1 py-2 rounded border text-sm font-bold transition-all ${
                         config.flag === flag 
                           ? 'bg-blue-600 border-blue-600 text-white' 
                           : 'bg-black border-gray-700 text-gray-400 hover:border-gray-500'
                       }`}
                     >
                       {flag === 'UK' ? 'UK' : flag === 'EU' ? 'EU' : 'Asnjë'}
                     </button>
                   ))}
                 </div>
               </div>

               {/* Shine Intensity Slider */}
               <div>
                 <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-400">Intensiteti i Shkëlqimit</label>
                    <span className="text-xs text-brand-accent font-mono">{(config.shineIntensity * 100).toFixed(0)}%</span>
                 </div>
                 <input 
                   type="range" 
                   min="0" 
                   max="1" 
                   step="0.05" 
                   value={config.shineIntensity}
                   onChange={(e) => updateConfig('shineIntensity', parseFloat(e.target.value))}
                   className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                 />
                 <p className="text-[10px] text-gray-500 mt-1">Rregulloni efektin e shkëlqimit sipas dëshirës.</p>
               </div>
             </div>
          </AccordionItem>
          
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-dark text-white selection:bg-brand-accent selection:text-black">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
        <footer className="bg-black py-8 border-t border-gray-800 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-500">© 2024 Targa Ime. Të gjitha të drejtat e rezervuara.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
