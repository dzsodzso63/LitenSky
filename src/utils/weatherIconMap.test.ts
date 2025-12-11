import { describe, expect, it } from 'vitest';
import { WEATHER_ICON_MAP } from './weatherIconMap';

describe('WEATHER_ICON_MAP', () => {
  it('marks thunderstorm icons as thunder', () => {
    expect(WEATHER_ICON_MAP['80000'].isThunder).toBe(true);
    expect(WEATHER_ICON_MAP['80020'].iconFileName).toContain('tstorm');
  });

  it('keeps clear conditions marked as non-thunder', () => {
    expect(WEATHER_ICON_MAP['10000'].isThunder).toBe(false);
    expect(WEATHER_ICON_MAP['10000'].iconFileName).toContain('clear');
  });
});

