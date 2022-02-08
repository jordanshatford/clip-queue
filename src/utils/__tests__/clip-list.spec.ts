import { ClipList } from "@/utils/clip-list"

describe("clip-list.ts", () => {
  let clipList: ClipList
  let randomNumber: number
  const startNumber = 1

  beforeEach(() => {
    clipList = new ClipList()
    randomNumber = Math.floor(Math.random() * 25) + 5
    for (let i = startNumber; i <= randomNumber; i++) {
      clipList.add({ id: `test-id-${i}` })
    }
  })

  it("can be constructed with clips", () => {
    const clipList2 = new ClipList({ id: "1" }, { id: "2" })
    expect(clipList2.size()).toEqual(2)
    expect(clipList2.shift()?.id).toEqual("1")
    expect(clipList2.shift()?.id).toEqual("2")
  })

  it("can have clips added to it", () => {
    expect(clipList.size()).toEqual(randomNumber)
    clipList.add({ id: "test-id-push" })
    expect(clipList.size()).toEqual(randomNumber + 1)
    expect(clipList.pop()).toEqual({ id: "test-id-push" })
  })

  it("can have clips unshifted to it", () => {
    expect(clipList.size()).toEqual(randomNumber)
    clipList.unshift({ id: "test-id-push" })
    expect(clipList.size()).toEqual(randomNumber + 1)
    expect(clipList.shift()).toEqual({ id: "test-id-push" })
  })

  it("can have clips popped from it", () => {
    expect(clipList.pop()).toEqual({ id: `test-id-${randomNumber}` })
    expect(clipList.size()).toEqual(randomNumber - 1)
  })

  it("can have clips shifted from it", () => {
    expect(clipList.shift()).toEqual({ id: `test-id-${startNumber}` })
    expect(clipList.size()).toEqual(randomNumber - 1)
  })

  it("can have clips removed from it", () => {
    expect(clipList.includes({ id: `test-id-${startNumber}` })).toEqual(true)
    clipList.remove({ id: `test-id-${startNumber}` })
    expect(clipList.includes({ id: `test-id-${startNumber}` })).toEqual(false)
  })

  it("can have clips removed from it based on submitter", () => {
    const clipWithSubmitter = { id: "withuser", submitter: "jordan" }
    expect(clipList.includes(clipWithSubmitter)).toEqual(false)
    clipList.add(clipWithSubmitter)
    expect(clipList.includes(clipWithSubmitter)).toEqual(true)
    clipList.removeBySubmitter("jordan")
    expect(clipList.includes(clipWithSubmitter)).toEqual(false)
  })

  it("can return if it has a clip", () => {
    expect(clipList.includes({ id: `test-id-${startNumber}` })).toEqual(true)
  })

  it("return undefined when no value can be popped from it", () => {
    const clipList2 = new ClipList()
    expect(clipList2.empty()).toBeTruthy()
    expect(clipList2.pop()).toEqual(undefined)
  })

  it("return undefined when no value can be shifted from it", () => {
    const clipList2 = new ClipList()
    expect(clipList2.empty()).toBeTruthy()
    expect(clipList2.shift()).toEqual(undefined)
  })

  it("can check the size of the clip list", () => {
    expect(clipList.size()).toEqual(randomNumber)
    const testClipList = new ClipList()
    expect(testClipList.size()).toEqual(0)
    const randomNumber2 = Math.floor(Math.random() * 25) + 5
    for (let i = 1; i <= randomNumber2; i++) {
      testClipList.add({ id: `${i}` })
      expect(testClipList.size()).toEqual(i)
    }
    expect(testClipList.size()).toEqual(randomNumber2)
  })

  it("can check if the clip list is empty", () => {
    expect(clipList.empty()).toBeFalsy()
    const testClipList = new ClipList()
    expect(testClipList.empty()).toBeTruthy()
  })

  it("can convert the clip list to an array", () => {
    const clipListArray = clipList.toArray()
    expect(clipListArray.length).toEqual(clipList.size())
    clipListArray.every((clip) => expect(typeof clip).toEqual("object"))
  })
})
