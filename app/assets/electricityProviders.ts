export type ElectricityProvider = {
  id: string
  name: string
  tariff: string
  formula: (price: number) => number
}

export const epexSpotAt: ElectricityProvider = {
  id: 'epex-spot-at',
  name: 'EPEX',
  tariff: 'Spot AT',
  formula: (price: number) => price,
}

export const awattarHourlyPre2024: ElectricityProvider = {
  id: 'awattar-hourly-pre-2024',
  name: 'aWATTar',
  tariff: 'HOURLY',
  formula: (price: number) => price + Math.abs(price * 0.03),
}

export const awattarHourly: ElectricityProvider = {
  id: 'awattar-hourly',
  name: 'aWATTar',
  tariff: 'HOURLY',
  formula: (price: number) => price + Math.abs(price * 0.03) + 1.5,
}

export const energieSteiermarkSpot: ElectricityProvider = {
  id: 'energie-steiermark-spot',
  name: 'Energie Steiermark',
  tariff: 'SteirerStrom Spot',
  formula: (price: number) => price + 1.2,
}

export const smartEnergyControl: ElectricityProvider = {
  id: 'smart-energy-control',
  name: 'smart ENERGY',
  tariff: 'smartCONTROL',
  formula: (price: number) => price + 1.2,
}
