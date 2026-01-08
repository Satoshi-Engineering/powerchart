import type { GridFees } from '~/types/GridFees'

export const vienna: GridFees = {
  id: 'vienna',
  label: 'Wien',
  fees: [{
    id: 'gridFee',
    label: 'Netznutzungsentgelt',
    color: '#8AA1B1',
    values: [{
      validUntil: '2026-01-01',
      amount: 7.4,
    }, {
      validUntil: '2026-04-01',
      amount: 6.98,
    }, {
      validUntil: '2026-10-01',
      amount: [{
        validUntil: '10:00',
        value: 6.98,
      }, {
        validUntil: '16:00',
        value: 5.58,
      }, {
      validUntil: null,
      amount: 6.98,
    }],
  }, {
    id: 'gridLoss',
    label: 'Netzverlustentgelt',
    color: '#9AC2C9',
    values: [{
      validUntil: '2026-01-01',
      amount: 0.7,
    }, {
      validUntil: null,
      amount: 0.7,
    }],
  }, {
    id: 'renewableFee',
    label: 'Erneuerbare Förderbeitrag',
    color: '#CAA0D0',
    values: [{
      validUntil: '2025-01-01',
      amount: 0.0,
    }, {
      validUntil: '2026-01-01',
      amount: 0.796,
    }, {
      validUntil: null,
      amount: 0.620,
    }],
  }, {
    id: 'electricityFee',
    label: 'Elektrizitätsabgabe',
    color: '#D0A0A0',
    values: [{
      validUntil: '2025-01-01',
      amount: 0.1,
    }, {
      validUntil: '2026-01-01',
      amount: 1.5,
    }, {
      validUntil: '2027-01-01',
      amount: 0.82,
    }, {
      validUntil: null,
      amount: 1.5,
    }],
  }],
}
