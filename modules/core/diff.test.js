/*eslint-env mocha*/
import expect from 'expect'
import diff from './diff'

const { shallowDiff } = diff
const deepDiff = diff.diff

let a = {
    a: 1,
    b: 2,
    c: 2
  },
  b = {
    a: 2,
    b: 1,
    c: 2
  },
  c = {
    a: 1,
    b: 2
  }

describe('shallowDiff', () => {
  it('a,b', () => {
    expect(shallowDiff(a, b)).toEqual({ a:1, b:2 })
  })

  it('b,a', () => {
    expect(shallowDiff(b,a)).toEqual({ a:2, b:1 })
  })

  it('a,c', () => {
    expect(shallowDiff(a,c)).toEqual({ c:2 })
  })

  it('c,a', () => {
    expect(shallowDiff(c,a)).toEqual({})
  })
})

describe('diff', ()=> {
  it('a,b', () => {
    expect(deepDiff(a, b)).toEqual({ a:1, b:2 })
  })

  it('b,a', () => {
    expect(deepDiff(b, a)).toEqual({ a:2, b:1 })
  })

  it('a,c', () => {
    expect(deepDiff(a, c)).toEqual({ c:2 })
  })

  it('c,a', () => {
    expect(deepDiff(c, a)).toEqual({})
  })

  it('c,a,reversible', () => {
    expect(deepDiff(c, a, true)).toEqual({ c:2 })
  })
})

let d = {
    x: 4,
    y: 2,
    z: a,
    zz: a
  },
  e = {
    x: 56,
    y: 2,
    z: a,
    zz: b
  }

describe('nested object shallowDiff', ()=> {
  it('d,e', () => {
    expect(shallowDiff(d, e)).toEqual({ x:4, zz:{ a:1, b:2, c:2 } })
  })

  it('e,d', () => {
    expect(shallowDiff(e, d)).toEqual({ x:56, zz:{ a:2, b:1, c:2 } })
  })
})

describe('nested object deepDiff', ()=> {
  it('d,e', () => {
    expect(deepDiff(d, e)).toEqual({ x:4, zz:{ a:1, b:2 } })
  })

  it('e,d', () => {
    expect(deepDiff(e, d)).toEqual({ x:56, zz:{ a:2, b:1 } })
  })
})

let f = {
    x: 4,
    y: 2,
    z: {
      a: 1,
      b: 2,
      c: 2
    },
    zz: {
      a: 1,
      b: 2,
      c: 2
    }
  },
  g = {
    x: 56,
    y: 2,
    z: {
      a: 1,
      b: 2,
      c: 2
    },
    zz: {
      a: 2,
      b: 1,
      c: 2
    }
  }

describe('double nested object shallowDiff', ()=> {
  it('f,g', () => {
    expect(shallowDiff(f, g)).toEqual({ x:4, z:{ a:1, b:2, c:2 }, zz:{ a:1, b:2, c:2 } })
  })

  it('g,f', () => {
    expect(shallowDiff(g, f)).toEqual({ x:56, z:{ a:1, b:2, c:2 }, zz:{ a:2, b:1, c:2 } })
  })
})

describe('double nested object deepDiff', ()=> {
  it('f,g', () => {
    expect(deepDiff(f, g)).toEqual({ x:4, zz:{ a:1, b:2 } })
  })

  it('g,f', () => {
    expect(deepDiff(g, f)).toEqual({ x:56, zz:{ a:2, b:1 } })
  })
})
