import type { GridFees } from '~/types/GridFees'

export const tyrolDoubleTariff: GridFees = {
  id: 'tyrolDoubleTariff',
  label: 'Tirol Doppeltarif',
  fees: [{
    id: 'gridFee',
    label: 'Netznutzungsentgelt',
    color: '#8AA1B1',
    values: [{
      validUntil: null,
      amount: [{
        validUntil: '06:00',
        value: 4.87,
      }, {
        validUntil: '22:00',
        value: 6.24,
      }, {
        validUntil: null,
        value: 4.87,
      }],
    }],
  }, {
    id: 'gridLoss',
    label: 'Netzverlustentgelt',
    color: '#9AC2C9',
    values: [{
      validUntil: null,
      amount: 0.472,
    }],
  }, {
    id: 'renewableFee',
    label: 'Erneuerbare Förderbeitrag',
    color: '#CAA0D0',
    values: [{
      validUntil: '2025-01-01',
      amount: 0.0,
    }, {
      validUntil: null,
      amount: 0.796,
    }],
  }, {
    id: 'electricityFee',
    label: 'Elektrizitätsabgabe',
    color: '#D0A0A0',
    values: [{
      validUntil: '2025-01-01',
      amount: 0.1,
    }, {
      validUntil: null,
      amount: 1.5,
    }],
  }],
}
