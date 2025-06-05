export type ElectricityTariff = {
  id: string
  name: string
  provider: string
  formula: (price: number) => number
}

export const epexSpotAt: ElectricityTariff = {
  id: 'epex-spot-at',
  name: 'Spot AT',
  provider: 'EPEX',
  formula: (price: number) => price,
}

export const awattarHourly: ElectricityTariff = {
  id: 'awattar-hourly',
  name: 'HOURLY',
  provider: 'aWATTar',
  formula: (price: number) => price + Math.abs(price * 0.03) + 1.5,
}

export const energieSteiermarkSpot: ElectricityTariff = {
  id: 'energie-steiermark-spot',
  name: 'SteirerStrom Spot',
  provider: 'Energie Steiermark',
  formula: (price: number) => price + 1.2,
}

export const smartEnergyControl: ElectricityTariff = {
  id: 'smart-energy-control',
  name: 'smartCONTROL',
  provider: 'smart ENERGY',
  formula: (price: number) => price + 1.2,
}
