/**
 * function to get the unique array elements.
 */
const uniqueArray = (elemment, index, self = [])=>{
  if (self?.indexOf(elemment) === index){
    return elemment;
  }
};

/**
 * function to add regex
 * @param {*} str
 * @returns
 */
function createRegexp (str) {
  if (str.charAt(0) === '/'
    && str.charAt(str.length - 1) === '/') {
    const text = str.substring(1, str.length - 2).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    return new RegExp(text, 'i');
  }

  return str;
}

/**
 * function for check given value is string or not
 */
function isString (val) {
  return val && val.constructor.name === 'String';
}

/**
 * function to check is array
 * @param {*} arg
 * @returns
 */
function isArray (arg) {
  return arg && arg.constructor.name === 'Array';
}

/**
 * function to check is object
 * @param {*} arg
 * @returns
 */
function isObject (arg) {
  return arg && arg.constructor.name === 'Object';
}

/**
 * function for resolve the array
 * @param {*} arr
 * @returns
 */
function resolveArray (arr) {
  for (let x = 0; x < arr.length; x++) {
    if (isObject(arr[x])) {
      arr[x] = validateFilter(arr[x]);
    } else if (isArray(arr[x])) {
      arr[x] = resolveArray(arr[x]);
    } else if (isString(arr[x])) {
      arr[x] = createRegexp(arr[x]);
    }
  }
  return arr;
}

/**
 * function to validate filter object
 */
function validateFilter (parsedFilter) {
  for (const key in parsedFilter) {
    if (isString(parsedFilter[key])) {
      parsedFilter[key] = createRegexp(parsedFilter[key]);

      if (key === '$gte' || key === '$gt') {
        parsedFilter[key] = new Date(parsedFilter[key]);
      }

      if (key === '$lte' || key === '$lt') {
        parsedFilter[key] = new Date(parsedFilter[key]);
      }
    } else if (isArray(parsedFilter[key])) {
      parsedFilter[key] = resolveArray(parsedFilter[key]);
    } else if (isObject(parsedFilter[key])) {
      parsedFilter[key] = validateFilter(parsedFilter[key]);
    }
  }
  return parsedFilter;
}

/**
 * function to prepare the filter object.
 */
function prepareFilter (query) {
  let filter = query.filter ? query.filter : {};
  if (typeof filter === 'string') {
    try {
      filter = JSON.parse(filter);
      filter = validateFilter(filter);
    } catch (err) {
      filter = {};
    }
  }

  return filter;
}

/**
 * function to prepare the sort
 */
function prepareSort (query) {
  let sort = query.sort ? query.sort : { createdAt: -1 };
  if (typeof sort === 'string') {
    try {
      sort = JSON.parse(sort);
    } catch (err) {
      sort = { createdAt: -1 };
    }
  }

  return sort;
}

/**
 * function to prepare the sort
 */
function prepareSelect (query) {
  let select = query.select ? query.select : {};
  if (typeof select === 'string') {
    try {
      select = JSON.parse(select);
    } catch (err) {
      select = {};
    }
  }

  return select;
}

module.exports = { uniqueArray, prepareFilter, prepareSort, prepareSelect };