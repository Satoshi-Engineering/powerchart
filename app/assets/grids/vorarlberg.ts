import type { GridFees } from '~/types/GridFees'

export const vorarlberg: GridFees = {
  id: 'vorarlberg',
  label: 'Vorarlberg',
  fees: [{
    id: 'gridFee',
    label: 'Netznutzungsentgelt',
    color: '#8AA1B1',
    values: [{
      validUntil: '2026-01-01',
      amount: 5.4,
    }, {
      validUntil: '2026-04-01',
      amount: 4.96,
    }, {
      validUntil: '2026-10-01',
      amount: [{
        validUntil: '10:00',
        value: 4.96,
      }, {
        validUntil: '16:00',
        value: 3.97,
      }, {
      validUntil: null,
      amount: 4.96,
    }],
  }, {
    id: 'gridLoss',
    label: 'Netzverlustentgelt',
    color: '#9AC2C9',
    values: [{
      validUntil: '2026-01-01',
      amount: 0.485,
    }, {
      validUntil: null,
      amount: 0.393,
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
