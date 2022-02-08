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
      if (!this.includes(clip)) {
        this._clips.push(clip)
      }
    })
    return this._clips
  }

  public remove(clip: Clip): void {
    this._clips = this._clips.filter((c) => !(c.id === clip.id))
  }

  public removeBySubmitter(submitter: string): void {
    this._clips = this._clips.filter((c) => !(c.submitter === submitter))
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
}
