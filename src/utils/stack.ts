export class Stack<T> {
  private _items: T[];

  constructor(...items: T[]) {
    this._items = [];

    if (items.length > 0) {
      items.forEach((item) => this._items.push(item));
    }
  }

  public push(...items: T[]): T[] {
    items.forEach((item) => this._items.push(item));
    return this._items;
  }

  public pop(): T | undefined {
    const value = this._items.pop();
    if (value) {
      return value;
    }
    return undefined;
  }

  public peek(): T {
    return this._items[this._items.length - 1];
  }

  public size(): number {
    return this._items.length;
  }

  public isEmpty(): boolean {
    return this._items.length == 0;
  }

  public toArray(): T[] {
    return this._items;
  }
}
