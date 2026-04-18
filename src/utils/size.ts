const SIZE_ORDER: Record<string, number> = {
  xs: 1,
  s: 2,
  m: 3,
  l: 4,
  xl: 5,
  xxl: 6,
  xxxl: 7,
  '2xl': 6,
  '3xl': 7,
  '4xl': 8,
  '5xl': 9,
};

/**
 * Sorts product sizes intelligently based on alphabetical labels or numeric values.
 * Standard labels follow a predefined order (XS -> S -> M -> L -> XL -> XXL -> XXXL).
 * Numeric values are sorted in ascending order.
 * Mixed values handle numeric first, then alphabetical.
 */
export const sortSizes = <T extends { name: string }>(sizes: T[]): T[] => {
  if (!sizes || !Array.isArray(sizes)) return [];

  return [...sizes].sort((a, b) => {
    const nameA = a.name.toLowerCase().trim();
    const nameB = b.name.toLowerCase().trim();

    // Check if both are numeric
    const numA = parseFloat(nameA);
    const numB = parseFloat(nameB);

    const isNumA = !isNaN(numA);
    const isNumB = !isNaN(numB);

    if (isNumA && isNumB) {
      return numA - numB;
    }

    // If one is numeric and the other is not, numeric comes first
    if (isNumA) return -1;
    if (isNumB) return 1;

    // Standard labels
    const orderA = SIZE_ORDER[nameA] || 999;
    const orderB = SIZE_ORDER[nameB] || 999;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // Fallback to alphabetical for unknown labels
    return nameA.localeCompare(nameB);
  });
};

/**
 * Normalizes size input to handle common variants (e.g., 2XL -> XXL)
 * @param size - The size name to normalize
 */
export const normalizeSize = (size: string): string => {
  let normalized = size.toUpperCase().trim();
  if (normalized === '2XL') return 'XXL';
  if (normalized === '3XL') return 'XXXL';
  return normalized;
};
