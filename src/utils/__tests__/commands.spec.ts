import { setActivePinia, createPinia } from "pinia"
import { commands } from "@/utils/commands"
import { useQueue } from "@/stores/queue"

describe("commands.ts", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  /* eslint-disable @typescript-eslint/no-explicit-any*/
  it.each([
    ["unknown", undefined],
    ["", undefined],
    ["queueprev", "previous"],
    ["queuenext", "next"],
    ["queueopen", "open"],
    ["queueclose", "close"],
  ])(
    "calls the proper clip queue function when a command is issued (%s, %s)",
    (commandName: string, expectedFunctionCall: any) => {
      const queue = useQueue()
      const command = commands[commandName]
      if (!command) {
        expect(vi.spyOn(queue, "previous")).toHaveBeenCalledTimes(0)
        expect(vi.spyOn(queue, "next")).toHaveBeenCalledTimes(0)
        expect(vi.spyOn(queue, "open")).toHaveBeenCalledTimes(0)
        expect(vi.spyOn(queue, "close")).toHaveBeenCalledTimes(0)
      } else {
        const randomNumber = Math.floor(Math.random() * 25)
        const spy = vi.spyOn(queue, expectedFunctionCall)
        for (let i = 1; i <= randomNumber; i++) {
          command()
        }
        expect(spy).toHaveBeenCalledTimes(randomNumber)
      }
    }
  )
})
