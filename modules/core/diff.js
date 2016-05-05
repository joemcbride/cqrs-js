import each from 'lodash/each'
import isObject from 'lodash/isObject'
import omitBy from 'lodash/omitBy'

function isEmpty(obj) {
  if (obj == null) return true

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) return false
  if (obj.length === 0) return true

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (let key in obj) {
    if (hasOwnProperty.call(obj, key)) return false
  }

  return true
}

function shallowDiff(a, b) {
  return omitBy(a, function (v, k) {
    return b[k] === v
  })
}

function deepDiff(a, b, r, reversible) {
  each(a, function (v, k) {
    if (r.hasOwnProperty(k) || b[k] === v) return
    let result = isObject(v) ? diff(v, b[k], reversible) : v
    r[k] = result
  })
}

function diff(a, b, reversible) {
  let r = {}
  deepDiff(a, b, r, reversible)
  if(reversible) deepDiff(b, a, r, reversible)

  for (let key in r) {
    if(isObject(r[key]) && isEmpty(r[key])) {
      delete r[key]
    }
  }

  return r
}

export default {
  diff,
  shallowDiff
}
