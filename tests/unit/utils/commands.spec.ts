import { commands } from "@/utils/commands";
import { clips } from "@/stores/clips";

describe("commands.ts", () => {
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
      const command = commands[commandName];
      if (!command) {
        expect(jest.spyOn(clips, "previous")).toHaveBeenCalledTimes(0);
        expect(jest.spyOn(clips, "next")).toHaveBeenCalledTimes(0);
        expect(jest.spyOn(clips, "open")).toHaveBeenCalledTimes(0);
        expect(jest.spyOn(clips, "close")).toHaveBeenCalledTimes(0);
      } else {
        const randomNumber = Math.floor(Math.random() * 25);
        const spy = jest.spyOn(clips, expectedFunctionCall);
        for (let i = 1; i <= randomNumber; i++) {
          command();
        }
        expect(spy).toHaveBeenCalledTimes(randomNumber);
      }
    }
  );
});
