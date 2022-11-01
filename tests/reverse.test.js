import { test, expect } from 'vitest'
const { reverse } = require('../utils/for_testing')

test.skip('reverse of a', () => {
  const result = reverse('a')

  expect(result).toBe('a')
})

test.skip('reverse of react', () => {
  const result = reverse('react')

  expect(result).toBe('tcaer')
})

test.skip('reverse of releveler', () => {
  const result = reverse('releveler')

  expect(result).toBe('releveler')
})

test.skip('reverse of number', () => {
  const result = reverse(1234)

  expect(result).toBeUndefined()
})

test.skip('reverse of undefined', () => {
  const result = reverse()

  expect(result).toBeUndefined()
})
