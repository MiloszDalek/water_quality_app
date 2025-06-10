export type ParameterName =
  | 'Ammonium'
  | 'Phosphate'
  | 'COD'
  | 'BOD'
  | 'Conductivity'
  | 'PH'
  | 'Nitrogen'
  | 'Nitrate'
  | 'Turbidity'
  | 'TSS';

export const parameterUnits: Record<ParameterName, string> = {
  Ammonium: 'mg/L',
  Phosphate: 'mg/L',
  COD: 'mg/L',
  BOD: 'mg/L',
  Conductivity: 'mS/m',
  PH: '',
  Nitrogen: 'mg/L',
  Nitrate: 'mg/L',
  Turbidity: 'NTU',
  TSS: 'mg/L',
};

export type Limit = { min?: number; max?: number };

const legalLimits: Record<ParameterName, Limit> = {
  Ammonium: { max: 1.5 },
  Phosphate: { max: 0.9 },
  COD: { max: 125 },
  BOD: { max: 25 },
  Conductivity: { max: 100 },
  PH: { min: 5, max: 11 },
  Nitrogen: { max: 25 },
  Nitrate: { max: 50 },
  Turbidity: { max: 50 },
  TSS: { max: 35 },
};

export default legalLimits;
