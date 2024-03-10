import { type Clip, type ClipProvider, toUUID } from '@/providers'

export class ClipList {
  private _clips: Clip[]

  constructor(...clips: Clip[]) {
    this._clips = []
    if (clips.length > 0) {
      clips.forEach((clip) => this.add(clip))
    }
  }

  public add(...clips: Clip[]): Clip[] {
    clips.forEach((clip) => {
      if (this.includes(clip)) {
        const index = this._clips.findIndex((c) => toUUID(c) === toUUID(clip))
        const submitters = this._clips[index]?.submitters ?? []
        const submitter = clip.submitters[0]?.toLowerCase()
        if (submitter && !submitters.includes(submitter)) {
          this._clips[index].submitters = [...submitters, submitter]
        }
      } else {
        this._clips.push(clip)
      }
    })
    this.sort()
    return this._clips
  }

  public remove(clip: Clip): void {
    const index = this._clips.findIndex((c) => toUUID(c) === toUUID(clip))
    if (index > -1) {
      this.removeSubmitterFromClip(clip?.submitters[0]?.toLowerCase(), index)
      this.sort()
    }
  }

  public removeBySubmitter(submitter: string): void {
    for (let i = this._clips.length - 1; i >= 0; i--) {
      this.removeSubmitterFromClip(submitter.toLowerCase(), i)
    }
    this.sort()
  }

  public removeByChannel(channel: string): void {
    this._clips = this._clips.filter((c) => c.channel?.toLowerCase() !== channel.toLowerCase())
  }

  public removeByProvider(provider: ClipProvider): void {
    this._clips = this._clips.filter((c) => c.provider.toLowerCase() !== provider.toLowerCase())
  }

  public includes(clip: Clip): boolean {
    return this._clips.some((c) => toUUID(c) === toUUID(clip))
  }

  public pop(): Clip | undefined {
    return this._clips.pop()
  }

  public shift(): Clip | undefined {
    return this._clips.shift()
  }

  public unshift(clip: Clip): number {
    return this._clips.unshift(clip)
  }

  public size(): number {
    return this._clips.length
  }

  public clear(): void {
    this._clips = []
  }

  public empty(): boolean {
    return this._clips.length === 0
  }

  public toArray(): Clip[] {
    return this._clips
  }

  private removeSubmitterFromClip(submitter: string, index: number): void {
    const c = this._clips[index]
    if (c.submitters?.includes(submitter)) {
      const submittersLength = c.submitters?.length ?? 0
      if (submittersLength === 1) {
        // Remove the clip from the list
        this._clips.splice(index, 1)
      } else if (submittersLength > 1) {
        // Remove only the submitter
        const submitters = c.submitters?.filter((s) => !(s === submitter))
        this._clips[index].submitters = submitters
      }
    }
  }

  private sort(): void {
    this._clips = this._clips.sort((a, b) => {
      return (b.submitters?.length ?? 0) - (a.submitters?.length ?? 0)
    })
  }
}
