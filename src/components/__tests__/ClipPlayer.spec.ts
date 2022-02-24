import { shallowMount } from "@vue/test-utils"
import ClipPlayer from "@/components/ClipPlayer.vue"

describe("ClipPlayer.vue", () => {
  const wrapper = shallowMount(ClipPlayer, {
    props: {
      clip: {
        id: "test",
        title: "Test title",
        channel: "testchannel",
        game: "testgame",
        timestamp: new Date("December 17, 1995 03:24:00").toISOString(),
        url: "https://www.twitch.tv/test",
        thumbnailUrl: "test",
      },
    },
  })

  it("mounts successfully", () => {
    expect(wrapper.exists()).toEqual(true)
  })

  it("successfully shows the time ago for the clip", async () => {
    expect(wrapper.vm.timeAgo).not.toEqual("")
  })

  it("returns no time ago when it doesnt have a clip timestamp", async () => {
    wrapper.setProps({ clip: {} })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.timeAgo).toEqual("")
  })
})
