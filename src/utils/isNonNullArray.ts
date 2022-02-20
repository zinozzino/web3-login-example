import isNil from 'lodash/isNil';

function isNonNullArray<T>(
  value: (T | undefined)[] | null | undefined
): value is T[] {
  return !isNil(value) && 'length' in value && value.filter(isNil).length === 0;
}

export default isNonNullArray;
