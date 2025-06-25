import type { ElectricityTariff } from '~/types/ElectricityTariff'

export const electricityTariffs: ElectricityTariff[] = [
  {
    id: 'epex-spot-at',
    name: 'Spot AT',
    provider: 'EPEX',
    formula: 'price',
  },
  {
    id: 'awattar-hourly',
    name: 'HOURLY',
    provider: 'aWATTar',
    formula: 'price + abs(price) * 0.03 + 1.5',
  },
  {
    id: 'energie-steiermark-spot',
    name: 'SteirerStrom Spot',
    provider: 'Energie Steiermark',
    formula: 'price + 1.2',
  },
  {
    id: 'smart-energy-control',
    name: 'smartCONTROL',
    provider: 'smart ENERGY',
    formula: 'price + 1.2',
  },
]
