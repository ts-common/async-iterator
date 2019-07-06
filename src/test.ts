// tslint:disable:no-expression-statement no-magic-numbers
import * as _ from "./index"

describe("entries", () => {
    it("undefined", async () => {
        const r = _.entries(undefined)
        const result = await r.toArray()
        expect(result)
            .toEqual([])
    })
    it("array", async () => {
        const r = _.fromSync(["a", "b", "c"])
            .entries()
        const result = await r.toArray()
        expect(result)
            .toEqual([[0, "a"], [1, "b"], [2, "c"]])
    })
})

describe("map", () => {
    it("array", async () => {
        const r = _.fromSync([1, 2, 3])
            .map(x => x * x)
        const result = await _.toArray(r)
        expect(result)
            .toEqual([1, 4, 9])
        const result2 = await r.map(i => i + 1)
            .toArray()
        expect(result2)
            .toEqual([2, 5, 10])
    })
    it("promise", async () => {
        const r = _.fromSync([1, 2, 3])
            .map(x => Promise.resolve(x * x))
        const result = await _.toArray(r)
        expect(result)
            .toEqual([1, 4, 9])
        const result2 = await r.map(i => i + 1)
            .toArray()
        expect(result2)
            .toEqual([2, 5, 10])
    })
})

describe("flatten", () => {
    it("undefined", async () => {
        const r = _.flatten(undefined)
        const result = await r.toArray()
        expect(result)
            .toEqual([])
    })
    it("with undefined", async () => {
        const r = _.flatten(_.fromSync([_.fromSync([6]), _.fromSync([7, 8]), undefined]))
        const result = await r.toArray()
        expect(result)
            .toEqual([6, 7, 8])
    })
})

describe("flatMap", () => {
    it("array", async () => {
        const r = _.fromSync([1, 2, 3])
            .flatMap(x => _.fromSync([x, x * 2]))
        const result = await r.toArray()
        expect(result)
            .toEqual([1, 2, 2, 4, 3, 6])
        const result2 = await r.map(i => i + 1)
            .toArray()
        expect(result2)
            .toEqual([2, 3, 3, 5, 4, 7])
    })
})

describe("fold", () => {
    it("array", async () => {
        const r = _.fromSync(["a", "b", "c"])
            .fold((a, b) => a + b, "[")
        const result = await r
        expect(result)
            .toEqual("[abc")
    })
})

describe("fromSequence", () => {
    it("array", async () => {
        const r = _.fromSequence(1, 2, 3)
        const result = await r.toArray()
        expect(result)
            .toEqual([1, 2, 3])
        const result2 = await r.map(i => i + 1)
            .toArray()
        expect(result2)
            .toEqual([2, 3, 4])
    })
})

describe("fromPromise", () => {
    it("array", async () => {
        const r = _.fromPromise(Promise.resolve([1, 2, 3]))
        const result = await r.toArray()
        expect(result)
            .toEqual([1, 2, 3])
        const result2 = await r.map(i => i + 1)
            .toArray()
        expect(result2)
            .toEqual([2, 3, 4])
    })
})

describe("empty", () => {
    it("nothing", async () => {
        const x = _.empty<number>()
            .toArray()
        expect(await x)
            .toEqual([])
    })
})

describe("filter", () => {
    it("some", async () => {
        const x = await _.fromSequence(1, 2, 3)
            .filter(v => v % 2 !== 0)
            .toArray()
        expect(x)
            .toEqual([1, 3])
    })
    it("promise", async () => {
        const x = await _.fromSequence(1, 2, 3)
            .filter(v => Promise.resolve(v % 2 !== 0))
            .toArray()
        expect(x)
            .toEqual([1, 3])
    })
})
