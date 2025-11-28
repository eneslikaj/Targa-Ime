
import React, { useRef, useState, useCallback } from 'react';
import { PlateConfig, PlateColor, PlateStyle, PlateShape } from '../types';
import { Flag, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface PlatePreviewProps {
  config: PlateConfig;
}

export const PlatePreview: React.FC<PlatePreviewProps> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [zoom, setZoom] = useState(1);

  const getShineSettings = () => {
    // Base settings for texture and blend mode based on style
    let size = '70%';
    let blend = 'screen';

    switch (config.style) {
      case PlateStyle.ACRYLIC_4D:
        size = '40%';
        blend = 'overlay';
        break;
      case PlateStyle.GEL_3D:
        size = '50%';
        blend = 'overlay';
        break;
      case PlateStyle.FRAME_UV:
      case PlateStyle.FRAME_LUX:
      case PlateStyle.FRAME_FACTORY:
        size = '60%';
        blend = 'soft-light';
        break;
      default:
        size = '70%';
        blend = 'screen';
    }

    // Use user-defined intensity from config
    return { intensity: config.shineIntensity, size, blend };
  };

  const shineSettings = getShineSettings();

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Enhanced rotation range (max 25 degrees) for better 3D feel
    const rotateX = ((y - centerY) / centerY) * -25; 
    const rotateY = ((x - centerX) / centerX) * 25;

    // Calculate shine position
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;

    setRotation({ x: rotateX, y: rotateY });
    setShine({ x: shineX, y: shineY, opacity: 1 });
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setShine(prev => ({ ...prev, opacity: 0 }));
    setIsHovering(false);
    setIsPressed(false);
  }, []);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(prev => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(1);
  };

  const getBackgroundStyle = () => {
    switch (config.color) {
      case PlateColor.YELLOW:
        return { backgroundColor: '#FFD700' };
      case PlateColor.WHITE:
        return { backgroundColor: '#F3F4F6' };
      case PlateColor.BLACK:
        return { background: 'linear-gradient(to bottom, #2a2a2a, #000000)' };
      case PlateColor.SILVER:
        return { background: 'linear-gradient(135deg, #e0e0e0 0%, #a0a0a0 50%, #d0d0d0 100%)' };
      case PlateColor.CUSTOM:
        return { backgroundColor: config.customColor || '#FFD700' };
      default:
        return { backgroundColor: '#FFD700' };
    }
  };

  const getTextStyle = () => {
    // If background is dark (Black), force lighter text unless it's a specific style that handles it
    const isDarkBackground = config.color === PlateColor.BLACK;
    const baseTextColor = isDarkBackground ? 'text-gray-200' : 'text-black';

    switch (config.style) {
      case PlateStyle.ACRYLIC_4D:
        return `${baseTextColor} text-4d`;
      case PlateStyle.GEL_3D:
        return `text-gel drop-shadow-lg ${isDarkBackground ? 'brightness-150 contrast-125' : ''}`;
      case PlateStyle.MOTO:
      case PlateStyle.FRAME_MOTO:
      case PlateStyle.SIMPLE:
        return baseTextColor;
      case PlateStyle.FRAME_LUX:
      case PlateStyle.FRAME_UV:
      case PlateStyle.FRAME_FACTORY:
        return `${baseTextColor} drop-shadow-md`;
      default:
        return baseTextColor;
    }
  };

  const getShapeClass = () => {
    switch (config.shape) {
      case PlateShape.HEX:
        return 'px-12 py-6'; 
      case PlateShape.SHORT:
        return 'w-[320px]';
      case PlateShape.OVERSIZED:
        return 'h-[140px]';
      default:
        return 'w-full max-w-[520px]';
    }
  };

  const isHex = config.shape === PlateShape.HEX;

  return (
    <div 
      id="plate-preview-canvas"
      className="relative w-full h-[450px] flex items-center justify-center overflow-hidden select-none bg-gray-900/20 rounded-2xl border border-white/5"
      style={{ perspective: '1200px' }}
    >
       {/* Export Watermark - Hidden by default */}
      <div 
        id="export-watermark" 
        className="hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none -rotate-12 border-4 border-white/20 px-8 py-4 rounded-xl backdrop-blur-sm bg-black/30 shadow-2xl"
      >
        <span className="text-white/40 font-display font-bold text-6xl whitespace-nowrap tracking-widest uppercase drop-shadow-lg">
          @targa_ime
        </span>
      </div>

       {/* Export QR Code - Hidden by default */}
       <div 
        id="export-qrcode" 
        className="hidden absolute bottom-4 left-4 z-[100] pointer-events-none bg-white p-1 rounded-lg shadow-xl"
      >
        <img 
          src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://targa-ime.al" 
          alt="QR Code" 
          className="w-20 h-20"
        />
        <div className="text-[10px] text-center font-bold text-black mt-1">targa-ime.al</div>
      </div>

      {/* Zoom Controls */}
      <div id="zoom-controls" className="absolute bottom-4 right-4 flex flex-col gap-2 z-50">
        <button onClick={handleZoomIn} className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors shadow-lg border border-gray-700">
          <ZoomIn size={20} />
        </button>
        <button onClick={handleResetZoom} className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors shadow-lg border border-gray-700">
          <Maximize2 size={20} />
        </button>
        <button onClick={handleZoomOut} className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors shadow-lg border border-gray-700">
          <ZoomOut size={20} />
        </button>
      </div>

      {/* Interactive Area */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="relative z-10 cursor-pointer transition-transform duration-200 ease-out will-change-transform flex items-center justify-center w-full h-full"
        style={{
          transform: `
            rotateX(${rotation.x}deg) 
            rotateY(${rotation.y}deg) 
            scale(${zoom * (isPressed ? 0.98 : (isHovering ? 1.02 : 1))})
          `,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* The Plate Entity */}
        <div 
          className={`
            relative flex items-center justify-between
            ${getShapeClass()}
            ${isHex ? '' : 'rounded-xl'}
            min-h-[110px] 
            border-4 ${config.border ? 'border-black' : 'border-transparent'}
            shadow-2xl
            transition-all duration-300
          `}
          style={{
             ...getBackgroundStyle(),
             borderRadius: isHex ? '16px' : '12px',
             clipPath: isHex ? 'polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0% 50%)' : 'none',
             boxShadow: `
               ${-rotation.y * 1.5}px ${rotation.x * 1.5 + 20}px 30px rgba(0,0,0,0.6),
               inset 0 2px 4px rgba(255,255,255,0.5),
               inset 0 -2px 4px rgba(0,0,0,0.2)
             `,
             transform: 'translateZ(0px)'
          }}
        >
          {/* Left Badge */}
          <div 
            className="w-14 h-full flex flex-col items-center justify-center bg-blue-700 text-white rounded-l-[inherit] absolute left-0 top-0 bottom-0 z-20"
            style={{ transform: 'translateZ(2px)' }}
          >
            {config.flag === 'UK' && <span className="font-bold text-sm mt-1">UK</span>}
            {config.flag === 'EU' && <span className="text-yellow-400 text-lg">★</span>}
            {!config.flag && <Flag size={24} className="opacity-40"/>}
          </div>

          {/* Main Text */}
          <div className="flex-1 flex items-center justify-center h-full pl-12 pr-4 z-30" style={{ transform: 'translateZ(15px)' }}>
            <h1 
              className={`
                font-plate text-5xl md:text-7xl uppercase tracking-widest font-bold whitespace-nowrap
                ${getTextStyle()}
              `}
            >
              {config.text || "TARGA IME"}
            </h1>
          </div>

          {/* Dynamic Shine/Glare - Specular Reflection */}
          <div 
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-40"
            style={{ 
              background: `linear-gradient(135deg, rgba(255,255,255,${Math.max(0, shineSettings.intensity - 0.3)}) 0%, rgba(255,255,255,0) 50%)`,
              opacity: 1,
              mixBlendMode: 'soft-light',
            }}
          />
          
          {/* Interactive Spotlight Glare */}
          <div 
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-50 transition-all duration-75"
            style={{ 
              background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,${isPressed ? shineSettings.intensity + 0.2 : shineSettings.intensity}) 0%, rgba(255,255,255,0) ${shineSettings.size})`,
              opacity: shine.opacity,
              mixBlendMode: shineSettings.blend as any,
            }}
          />
        </div>
        
        {/* Floor Shadow */}
        <div 
          className="absolute -bottom-20 w-[80%] h-[40px] bg-black blur-2xl rounded-[100%] z-0 pointer-events-none transition-transform duration-200"
          style={{
            transform: `translateX(${-rotation.y}px) scale(${1 - Math.abs(rotation.x)/90})`,
            opacity: 0.5
          }}
        />
      </div>
    </div>
  );
};
