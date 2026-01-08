import type { GridFees } from '~/types/GridFees'

export const grazDoubleTariff: GridFees = {
  id: 'grazDoubleTariff',
  label: 'Graz Doppeltarif',
  fees: [{
    id: 'gridFee',
    label: 'Netznutzungsentgelt',
    color: '#8AA1B1',
    values: [{
      validUntil: '2026-01-01',
      amount: [{
        validUntil: '06:00',
        value: 4.61,
      }, {
        validUntil: '22:00',
        value: 5.52,
      }, {
        validUntil: null,
        value: 4.61,
      }],
    }, {
      validUntil: '2026-04-01',
      amount: [{
        validUntil: '06:00',
        value: 4.58,
      }, {
        validUntil: '22:00',
        value: 5.25,
      }, {
        validUntil: null,
        value: 4.58,
      }],
    }, {
      validUntil: '2026-10-01',
      amount: [{
        validUntil: '10:00',
        value: 5.17,
      }, {
        validUntil: '16:00',
        value: 4.14,
      }, {
        validUntil: null,
        value: 5.17,
      }],
    }, {
      validUntil: null,
      amount: 5.17,
    }],
  }, {
    id: 'gridLoss',
    label: 'Netzverlustentgelt',
    color: '#9AC2C9',
    values: [{
      validUntil: '2026-01-01',
      amount: 0.743,
    }, {
      validUntil: null,
      amount: 0.658,
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
