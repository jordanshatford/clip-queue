import type { Clip, ClipProvider } from './types'
import { toClipUUID } from './utils'

/**
 * A basic list of clips. Clips are not sorted.
 */
export class BasicClipList {
  protected _clips: Clip[]

  constructor(...clips: Clip[]) {
    this._clips = []
    this.add(...clips)
  }

  /**
   * Add clips to the list.
   * @param clips - The clips to add.
   * @returns The clips.
   */
  public add(...clips: Clip[]): Clip[] {
    clips.forEach((clip) => {
      if (this.includes(clip)) {
        const index = this._clips.findIndex((c) => toClipUUID(c) === toClipUUID(clip))
        const submitters = this._clips[index]?.submitters ?? []
        const submitter = clip.submitters[0]?.toLowerCase()
        const c = this._clips[index]
        if (submitter && !submitters.includes(submitter) && c !== undefined) {
          c.submitters = [...submitters, submitter]
          this._clips[index] = c
        }
      } else {
        this._clips.push(clip)
      }
    })
    return this._clips
  }

  /**
   * Remove a clip from the list.
   * @param clip - The clip to remove.
   */
  public remove(clip: Clip): void {
    const index = this._clips.findIndex((c) => toClipUUID(c) === toClipUUID(clip))
    if (index > -1) {
      this._clips.splice(index, 1)
    }
  }

  /**
   * Check if the list includes a clip.
   * @param clip - The clip to check.
   * @returns Whether the list includes the clip.
   */
  public includes(clip: Clip): boolean {
    return this._clips.some((c) => toClipUUID(c) === toClipUUID(clip))
  }

  /**
   * Get the first clip in the list.
   * @returns The first clip.
   */
  public pop(): Clip | undefined {
    return this._clips.pop()
  }

  /**
   * Get the last clip in the list.
   * @returns The last clip.
   */
  public shift(): Clip | undefined {
    return this._clips.shift()
  }

  /**
   * Add a clip to the end of the list.
   * @param clip - The clip to add.
   * @returns The new length of the list.
   */
  public unshift(clip: Clip): number {
    return this._clips.unshift(clip)
  }

  /**
   * Get the size of the list.
   * @returns The size of the list.
   */
  public size(): number {
    return this._clips.length
  }

  /**
   * Clear the list.
   */
  public clear(): void {
    this._clips = []
  }

  /**
   * Check if the list is empty.
   * @returns Whether the list is empty.
   */
  public empty(): boolean {
    return this._clips.length === 0
  }

  /**
   * Get the clips as an array.
   * @returns The clips as an array.
   */
  public toArray(): Clip[] {
    return this._clips
  }
}

/**
 * A list of clips. Clips are sorted by the number of submitters.
 */
export class ClipList extends BasicClipList {
  /**
   * Add clips to the list.
   * @param clips - The clips to add.
   * @returns The clips.
   */
  public override add(...clips: Clip[]): Clip[] {
    super.add(...clips)
    this.sort()
    return this._clips
  }

  /**
   * Remove submitters from a clip. If the clip has no other submitters it will be
   * removed completely.
   * @param clip - The clip to remove.
   */
  public override remove(clip: Clip): void {
    const index = this._clips.findIndex((c) => toClipUUID(c) === toClipUUID(clip))
    const submitter = clip.submitters[0]?.toLowerCase()
    if (index > -1 && submitter) {
      this.removeSubmitterFromClip(submitter, index)
      this.sort()
    }
  }

  /**
   * Remove all clips submitted by a submitter.
   * @param submitter - The submitter to remove.
   */
  public removeBySubmitter(submitter: string): void {
    for (let i = this._clips.length - 1; i >= 0; i--) {
      this.removeSubmitterFromClip(submitter.toLowerCase(), i)
    }
    this.sort()
  }

  /**
   * Remove all clips by a provider.
   * @param provider - The provider to remove.
   */
  public removeByProvider(provider: ClipProvider): void {
    this._clips = this._clips.filter((c) => c.provider.toLowerCase() !== provider.toLowerCase())
  }

  /**
   * Remove a submitter from a clip.
   * @param submitter - The submitter to remove.
   * @param index - The index of the clip.
   */
  private removeSubmitterFromClip(submitter: string, index: number): void {
    const c = this._clips[index]
    if (c?.submitters.includes(submitter)) {
      if (c.submitters.length === 1) {
        // Remove the clip from the list
        this._clips.splice(index, 1)
      } else if (c.submitters.length > 1) {
        // Remove only the submitter
        const submitters = c.submitters.filter((s) => !(s === submitter))
        c.submitters = submitters
        this._clips[index] = c
      }
    }
  }

  /**
   * Sort the clips by the number of submitters.
   */
  private sort(): void {
    this._clips = this._clips.sort((a, b) => {
      return b.submitters.length - a.submitters.length
    })
  }
}
