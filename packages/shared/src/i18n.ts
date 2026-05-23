export { default as viTranslation } from '../../../src/locales/vi.json';
export { default as enTranslation } from '../../../src/locales/en.json';

export const fillMissingKeys = (primary: Record<string, unknown>, fallback: Record<string, unknown>) => {
  const output = { ...(primary || {}) };
  Object.entries(fallback || {}).forEach(([key, fallbackValue]) => {
    const primaryValue = output[key];
    if (primaryValue === undefined) {
      output[key] = fallbackValue;
    } else if (
      primaryValue &&
      fallbackValue &&
      typeof primaryValue === 'object' &&
      typeof fallbackValue === 'object' &&
      !Array.isArray(primaryValue) &&
      !Array.isArray(fallbackValue)
    ) {
      output[key] = fillMissingKeys(primaryValue as Record<string, unknown>, fallbackValue as Record<string, unknown>);
    }
  });
  return output;
};
