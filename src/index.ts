import * as sync from "@ts-common/iterator"

export type Entry<T> = sync.Entry<T>

export const entry = sync.entry

export type AsyncIterableEx<T> = {
  readonly fold: <A>(func: (a: A, b: T, i: number) => A, init: A) => Promise<A>
  readonly toArray: () => Promise<ReadonlyArray<T>>
  readonly entries: () => AsyncIterableEx<Entry<T>>
  readonly map: <R>(func: (v: T, i: number) => R) => AsyncIterableEx<R>
  readonly flatMap: <R>(func: (v: T, i: number) => AsyncIterable<R>) => AsyncIterableEx<R>
} & AsyncIterable<T>

class AsyncIterableImpl<T> implements AsyncIterableEx<T> {
  public readonly [Symbol.asyncIterator]: () => AsyncIterator<T>
  constructor(createIterator: () => AsyncIterator<T>) {
    this[Symbol.asyncIterator] = createIterator
  }
  public fold<A>(func: (a: A, b: T, i: number) => A, init: A) { return fold(this, func, init) }
  public toArray() { return toArray(this) }
  public entries() { return entries(this) }
  public map<R>(func: (v: T, i: number) => R) { return map(this, func) }
  public flatMap<R>(func: (v: T, i: number) => AsyncIterable<R>) { return flatMap(this, func) }
}

export const iterable = <T>(createIterator: () => AsyncIterator<T>): AsyncIterableEx<T> =>
  new AsyncIterableImpl(createIterator)

export const fromSync = <T>(input: sync.Iterable<T>): AsyncIterableEx<T> =>
  iterable(async function *(): AsyncIterator<T> { yield *input })

export const fromSequence = <T>(...a: T[]): AsyncIterableEx<T> => fromSync(a)

export const fromPromise = <T>(p: Promise<sync.Iterable<T>>): AsyncIterableEx<T> =>
  iterable(async function *(): AsyncIterator<T> { yield *await p })

export const fold = async <T, A>(
  input: AsyncIterable<T>|undefined,
  func: (a: A, b: T, i: number) => A,
  init: A,
): Promise<A> => {
  let result: A = init
  /* tslint:disable-next-line:no-loop-statement */
  for await (const [index, value] of entries(input)) {
    /* tslint:disable-next-line:no-expression-statement */
    result = func(result, value, index)
  }
  return result
}

export const toArray = <T>(input: AsyncIterable<T>|undefined): Promise<ReadonlyArray<T>> =>
  fold(
    input,
    (a, i) => { a.push(i); return a },
    new Array<T>()
  )

export const entries = <T>(input: AsyncIterable<T>|undefined): AsyncIterableEx<Entry<T>> =>
  iterable(async function *(): AsyncIterator<sync.Entry<T>> {
    // tslint:disable-next-line:no-if-statement
    if (input === undefined) {
      return
    }
    let index = 0
    /* tslint:disable-next-line:no-loop-statement */
    for await (const value of input) {
      yield entry(index, value)
      /* tslint:disable-next-line:no-expression-statement */
      ++index
    }
  })

export const map = <T, I>(
  input: AsyncIterable<I>|undefined,
  func: (v: I, i: number) => T,
): AsyncIterableEx<T> =>
  iterable(async function *(): AsyncIterator<T> {
    /* tslint:disable-next-line:no-loop-statement */
    for await (const [index, value] of entries(input)) {
      yield func(value, index)
    }
  })

export const flatten = <T>(input: AsyncIterable<AsyncIterable<T>|undefined>|undefined): AsyncIterableEx<T> =>
  iterable(async function *(): AsyncIterator<T> {
    // tslint:disable-next-line:no-if-statement
    if (input === undefined) {
      return
    }
    /* tslint:disable-next-line:no-loop-statement */
    for await (const v of input) {
      // tslint:disable-next-line:no-if-statement
      if (v !== undefined) {
        yield *v
      }
    }
  })

export const flatMap = <T, I>(
  input: AsyncIterable<I>|undefined,
  func: (v: I, i: number) => AsyncIterable<T>,
): AsyncIterableEx<T> =>
    flatten(map(input, func))
