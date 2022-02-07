import { settings } from "@/stores/settings";
import config from "@/assets/config";

const { localStorageKey, defaultValue } = config.App.Settings;

describe("settings.ts", () => {
  it("inits the settings with default value", () => {
    settings.init();
    expect(settings.current).toEqual(defaultValue);
  });

  it("inits the settings with values from local storage", () => {
    localStorage.setItem(localStorageKey, JSON.stringify({ ...defaultValue, commandPrefix: "~" }));
    settings.init();
    expect(settings.current.commandPrefix).toEqual("~");
  });

  it("updates the settings in local storage", () => {
    localStorage.clear();
    settings.init();
    expect(settings.current).toEqual(defaultValue);
    settings.update({ ...defaultValue, commandPrefix: "~", sendMsgsInChat: true });
    expect(settings.current.commandPrefix).toEqual("~");
    expect(settings.current.sendMsgsInChat).toBeTruthy();
  });
});
