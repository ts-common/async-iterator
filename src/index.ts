import * as sync from "@ts-common/iterator"

export type Entry<T> = sync.Entry<T>

export const entry = sync.entry

export const iterable = <T>(createIterator: () => AsyncIterator<T>): AsyncIterable<T> =>
  ({ [Symbol.asyncIterator]: createIterator })

export const fromSync = <T>(input: sync.Iterable<T>): AsyncIterable<T> =>
  iterable(async function *(): AsyncIterator<T> {
    for (const v of input) {
      yield v
    }
  })

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

export const toArray = <T>(input: AsyncIterable<T>): Promise<ReadonlyArray<T>> =>
  fold(
    input,
    (a, i) => { a.push(i); return a },
    new Array<T>()
  )

export const entries = <T>(input: AsyncIterable<T>|undefined): AsyncIterable<Entry<T>> =>
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
): AsyncIterable<T> =>
  iterable(async function *(): AsyncIterator<T> {
    /* tslint:disable-next-line:no-loop-statement */
    for await (const [index, value] of entries(input)) {
      yield func(value, index)
    }
  })
