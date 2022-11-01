import { test, describe, expect } from 'vitest'
const { average } = require('../utils/for_testing')

describe.skip('average', () => {
  test('average', () => {
    const array = [1]

    expect(average(array)).toBe(1)
  })

  test('of many is calculated right', () => {
    const array = [1, 2, 3, 4, 5, 6]

    expect(average(array)).toBe(3.5)
  })

  test('of empty array is zero', () => {
    const array = []

    expect(average(array)).toBe(0)
  })
})
