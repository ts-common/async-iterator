import "mocha"
import * as _ from "./index"
import assert from "assert"

describe("map", () => {
    it("array", async () => {
        const r = _.map(_.fromSync([1, 2, 3]), x => x * x)
        const result = await _.toArray(r)
        assert.deepEqual([1, 4, 9], result)
        const result2 = await _.toArray(_.map(r, i => i + 1))
        assert.deepEqual([2, 5, 10], result2)
    })
})