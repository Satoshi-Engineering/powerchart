import type { GridFees } from '~/types/GridFees'

export const chargingStation: GridFees = {
  id: 'chargingStation',
  label: 'Charging Station',
  fees: [{
    id: 'infrastructureFee',
    label: 'Infrastrukturbeitrag',
    color: '#9BE2B0',
    values: [{
      validUntil: null,
      amount: 4,
    }],
  }, {
    id: 'gridFee',
    label: 'Netznutzungsentgelt',
    color: '#8AA1B1',
    values: [{
      validUntil: '2024-01-01',
      amount: [{
        validUntil: '06:00',
        value: 3.44,
      }, {
        validUntil: '22:00',
        value: 6.89,
      }, {
        validUntil: null,
        value: 3.44,
      }],
    }, {
      validUntil: '2025-01-01',
      amount: [{
        validUntil: '06:00',
        value: 3.73,
      }, {
        validUntil: '22:00',
        value: 7.47,
      }, {
        validUntil: null,
        value: 3.73,
      }],
    }, {
      validUntil: '2026-01-01',
      amount: [{
        validUntil: '06:00',
        value: 6.85,
      }, {
        validUntil: '22:00',
        value: 9.25,
      }, {
        validUntil: null,
        value: 6.85,
      }],
    }, {
      validUntil: '2026-04-01',
      amount: [{
        validUntil: '06:00',
        value: 8.30,
      }, {
        validUntil: '22:00',
        value: 9.25,
      }, {
        validUntil: null,
        value: 8.30,
      }],
    }, {
      validUntil: '2026-10-01',
      amount: [{
        validUntil: '10:00',
        value: 8.82,
      }, {
        validUntil: '16:00',
        value: 7.06,
      }, {
        validUntil: null,
        value: 8.82,
      }],
    }, {
      validUntil: null,
      amount: 8.82,
    }],
  }, {
    id: 'gridLoss',
    label: 'Netzverlustentgelt',
    color: '#9AC2C9',
    values: [{
      validUntil: '2023-03-01',
      amount: 2.328,
    }, {
      validUntil: '2024-01-01',
      amount: 0.387,
    }, {
      validUntil: '2025-01-01',
      amount: 0.793,
    }, {
      validUntil: '2026-01-01',
      amount: 0.444,
    }, {
      validUntil: null,
      amount: 0.336,
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
