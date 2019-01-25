import "mocha"
import * as _ from "./index"
import assert from "assert"

describe("entries", () => {
    it("undefined", async () => {
        const r = _.entries(undefined)
        const result = await _.toArray(r)
        assert.deepEqual([], result)
    })
})

describe("map", () => {
    it("array", async () => {
        const r = _.map(_.fromSync([1, 2, 3]), x => x * x)
        const result = await _.toArray(r)
        assert.deepEqual([1, 4, 9], result)
        const result2 = await _.toArray(_.map(r, i => i + 1))
        assert.deepEqual([2, 5, 10], result2)
    })
})

describe("flatten", () => {
    it("undefined", async () => {
        const r = _.flatten(undefined)
        const result = await _.toArray(r)
        assert.deepEqual([], result)
    })
    it("with undefined", async () => {
        const r = _.flatten(_.fromSync([_.fromSync([6]), _.fromSync([7, 8]), undefined]))
        const result = await _.toArray(r)
        assert.deepEqual([6, 7, 8], result)
    })
})

describe("flatMap", () => {
    it("array", async () => {
        const r = _.flatMap(_.fromSync([1, 2, 3]), x => _.fromSync([x, x * 2]))
        const result = await _.toArray(r)
        assert.deepEqual([1, 2, 2, 4, 3, 6], result)
        const result2 = await _.toArray(_.map(r, i => i + 1))
        assert.deepEqual([2, 3, 3, 5, 4, 7], result2)
    })
})

describe("fromSequence", () => {
    it("array", async () => {
        const r = _.fromSequence(1, 2, 3)
        const result = await _.toArray(r)
        assert.deepEqual([1, 2, 3], result)
        const result2 = await _.toArray(_.map(r, i => i + 1))
        assert.deepEqual([2, 3, 4], result2)
    })
})

describe("fromPromise", () => {
    it("array", async () => {
        const r = _.fromPromise(Promise.resolve([1, 2, 3]))
        const result = await _.toArray(r)
        assert.deepEqual([1, 2, 3], result)
        const result2 = await _.toArray(_.map(r, i => i + 1))
        assert.deepEqual([2, 3, 4], result2)
    })
})
