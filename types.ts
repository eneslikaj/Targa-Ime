
export enum PlateStyle {
  SIMPLE = 'Targa te thjeshta',
  GEL_3D = 'Targa 3D',
  ACRYLIC_4D = 'Targa 4D',
  MOTO = 'Targa motori',
  FRAME_LUX = 'Portotarga lluksi 3D',
  FRAME_UV = 'Portotarga me logo uv',
  FRAME_FACTORY = 'Portotarga me logo 3D fabrikisht',
  FRAME_MOTO = 'Portotarga motorri'
}

export enum PlateShape {
  STANDARD = 'Standarde',
  HEX = 'Heksagonale',
  OVERSIZED = 'E Madhe',
  SHORT = 'E Shkurtër'
}

export enum PlateColor {
  YELLOW = 'Prapme (E Verdhë)',
  WHITE = 'Përpara (E Bardhë)',
  BLACK = 'E Zezë (Show)',
  SILVER = 'Argjend (Show)',
  CUSTOM = 'E Personalizuar'
}

export interface PlateConfig {
  text: string;
  style: PlateStyle;
  shape: PlateShape;
  color: PlateColor;
  customColor?: string;
  border: boolean;
  flag: string | null;
  shineIntensity: number;
}

export interface GeminiSuggestion {
  text: string;
  reasoning: string;
}
