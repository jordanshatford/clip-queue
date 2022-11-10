import type { Clip } from "@/interfaces/clips"

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
        const index = this._clips.findIndex((c) => c.id === clip.id)
        const submitters = this._clips[index]?.submitters ?? []
        const submitter = clip.submitter?.toLowerCase()
        if (submitter && !submitters.includes(submitter)) {
          this._clips[index].submitters = [...submitters, submitter]
        }
      } else {
        const submitter = clip.submitter?.toLowerCase()
        this._clips.push({ ...clip, submitter, submitters: submitter ? [submitter] : [] })
      }
    })
    this.sort()
    return this._clips
  }

  public remove(clip: Clip): void {
    const index = this._clips.findIndex((c) => c.id === clip.id)
    if (index > -1) {
      this.removeSubmitterFromClip(clip?.submitter?.toLowerCase() as string, index)
      this.sort()
    }
  }

  public removeBySubmitter(submitter: string): void {
    for (let i = this._clips.length - 1; i >= 0; i--) {
      this.removeSubmitterFromClip(submitter.toLowerCase(), i)
    }
    this.sort()
  }

  public includes(clip: Clip): boolean {
    return this._clips.some((c) => c.id === clip.id)
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
        // Check if submitter needs to be set from list of submitters
        if (c.submitter === submitter) {
          this._clips[index].submitter = submitters[0]
        }
      }
    }
  }

  private sort(): void {
    this._clips = this._clips.sort((a, b) => {
      return (b.submitters?.length ?? 0) - (a.submitters?.length ?? 0)
    })
  }
}
