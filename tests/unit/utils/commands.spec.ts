import { commands } from "@/utils/commands";
import { clipQueue } from "@/stores/queue";

describe("commands.ts", () => {
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
      const command = commands[commandName];
      if (!command) {
        expect(jest.spyOn(clipQueue, "previous")).toHaveBeenCalledTimes(0);
        expect(jest.spyOn(clipQueue, "next")).toHaveBeenCalledTimes(0);
        expect(jest.spyOn(clipQueue, "open")).toHaveBeenCalledTimes(0);
        expect(jest.spyOn(clipQueue, "close")).toHaveBeenCalledTimes(0);
      } else {
        const randomNumber = Math.floor(Math.random() * 25);
        const spy = jest.spyOn(clipQueue, expectedFunctionCall);
        for (let i = 1; i <= randomNumber; i++) {
          command();
        }
        expect(spy).toHaveBeenCalledTimes(randomNumber);
      }
    }
  );
});
