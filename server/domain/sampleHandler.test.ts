import { describe, expect, it } from 'vitest'

import { sampleHandler } from './sampleHandler'

describe('Sample Test', () => {
  it('should return sample message', () => {
    expect(sampleHandler()).toEqual({
      message: 'Hello world!',
    })
  })
})
