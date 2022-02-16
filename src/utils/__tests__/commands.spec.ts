import { setActivePinia, createPinia } from "pinia"
import commands from "@/utils/commands"
import { useQueue } from "@/stores/queue"

describe("commands.ts", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  /* eslint-disable @typescript-eslint/no-explicit-any*/
  it.each([
    // ["unknown", undefined],
    // ["", undefined],
    ["prev", "previous"],
    ["next", "next"],
    ["open", "open"],
    ["close", "close"],
  ])(
    "calls the proper clip queue function when a command is issued (%s, %s)",
    (commandName: string, expectedFunctionCall: any) => {
      const queue = useQueue()
      const randomNumber = Math.floor(Math.random() * 25)
      const spy = vi.spyOn(queue, expectedFunctionCall)
      for (let i = 1; i <= randomNumber; i++) {
        commands.handleCommand(commandName)
      }
      expect(spy).toHaveBeenCalledTimes(randomNumber)
    }
  )

  /* eslint-disable @typescript-eslint/no-explicit-any*/
  it.each([["unknown"], [""]])("calls nothing when an invalid command is issued (%s, %s)", (commandName: string) => {
    const queue = useQueue()
    commands.handleCommand(commandName)
    expect(vi.spyOn(queue, "previous")).toHaveBeenCalledTimes(0)
    expect(vi.spyOn(queue, "next")).toHaveBeenCalledTimes(0)
    expect(vi.spyOn(queue, "open")).toHaveBeenCalledTimes(0)
    expect(vi.spyOn(queue, "close")).toHaveBeenCalledTimes(0)
  })

  it("returns help information for commands", () => {
    expect(commands.help).toBeDefined()
  })
})
