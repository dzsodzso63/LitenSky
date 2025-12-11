import { describe, expect, it } from 'vitest';
import { convertTemperature } from './temperature';

describe('convertTemperature', () => {
  it('converts celsius to fahrenheit and rounds', () => {
    expect(convertTemperature(0, 'imperial')).toBe(32);
    expect(convertTemperature(21.1, 'imperial')).toBe(70);
  });

  it('returns rounded celsius for metric', () => {
    expect(convertTemperature(21.6, 'metric')).toBe(22);
    expect(convertTemperature(-3.4, 'metric')).toBe(-3);
  });
});

