import memoize from 'lodash/memoize';

function memoizePromiseResolver(...args) {
  return JSON.stringify(args);
}

export function memoizePromise(f, resolver = memoizePromiseResolver) {
  const memorizedFunction = memoize(async function(...args) {
    try {
      return await f(...args);
    } catch (e) {
      memorizedFunction.cache.delete(resolver(...args));
      throw e;
    }
  }, resolver);
  return memorizedFunction;
}
