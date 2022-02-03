import { settings } from "@/stores/settings";
import config from "@/assets/config";
import { Settings } from "@/interfaces/settings";

const { localStorageKey, defaultValue } = config.App.Settings;

describe("settings.ts", () => {
  it("inits the settings with default value", () => {
    settings.init();
    expect(settings.current).toEqual(defaultValue);
  });

  it("inits the settings with values from local storage", () => {
    localStorage.setItem(localStorageKey, JSON.stringify({ ...defaultValue, chatCommandPrefix: "~" }));
    settings.init();
    expect(settings.current.chatCommandPrefix).toEqual("~");
  });

  it("updates the settings in local storage", () => {
    localStorage.clear();
    settings.init();
    expect(settings.current).toEqual(defaultValue);
    settings.update({ ...defaultValue, chatCommandPrefix: "~", sendMessagesInChat: true });
    expect(settings.current.chatCommandPrefix).toEqual("~");
    expect(settings.current.sendMessagesInChat).toBeTruthy();
  });

  it("doesnt update the settings when invalid settings are passed", () => {
    localStorage.clear();
    settings.init();
    expect(settings.current).toEqual(defaultValue);
    settings.update({} as Settings);
    expect(settings.current).toEqual(defaultValue);
  });
});
