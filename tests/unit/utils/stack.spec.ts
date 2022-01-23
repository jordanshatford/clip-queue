import { Stack } from "@/utils/stack";

describe("stack.ts", () => {
  let stringStack: Stack<string>;
  let numberStack: Stack<number>;
  let objectStack: Stack<{ id: string }>;
  let randomNumber: number;

  beforeEach(() => {
    stringStack = new Stack<string>();
    numberStack = new Stack<number>();
    objectStack = new Stack<{ id: string }>();
    expect(stringStack.isEmpty()).toBeTruthy();
    expect(stringStack.peek()).toEqual(undefined);
    expect(numberStack.isEmpty()).toBeTruthy();
    expect(numberStack.peek()).toEqual(undefined);
    expect(objectStack.isEmpty()).toBeTruthy();
    expect(objectStack.peek()).toEqual(undefined);
    randomNumber = Math.floor(Math.random() * 25) + 5;
    for (let i = 1; i <= randomNumber; i++) {
      stringStack.push(`test-string-${i}`);
      numberStack.push(randomNumber);
      objectStack.push({ id: `test-id-${i}` });
    }
  });

  it("can be constructed with values", () => {
    const stringStack2 = new Stack<string>("test", "test2", "test3");
    expect(stringStack2.size()).toEqual(3);
    expect(stringStack2.peek()).toEqual("test3");
    const numberStack2 = new Stack<number>(1, 2, 3);
    expect(numberStack2.size()).toEqual(3);
    expect(numberStack2.peek()).toEqual(3);
    const objectStack2 = new Stack<{ id: string }>({ id: "1" }, { id: "2" }, { id: "3" });
    expect(objectStack2.size()).toEqual(3);
    expect(objectStack2.peek()).toEqual({ id: "3" });
  });

  it("can have values pushed to it", () => {
    expect(stringStack.size()).toEqual(randomNumber);
    stringStack.push("test-string-push");
    expect(stringStack.size()).toEqual(randomNumber + 1);
    expect(stringStack.peek()).toEqual("test-string-push");
    expect(numberStack.size()).toEqual(randomNumber);
    numberStack.push(999);
    expect(numberStack.size()).toEqual(randomNumber + 1);
    expect(numberStack.peek()).toEqual(999);
    expect(objectStack.size()).toEqual(randomNumber);
    objectStack.push({ id: "test-id-push" });
    expect(objectStack.size()).toEqual(randomNumber + 1);
    expect(objectStack.peek()).toEqual({ id: "test-id-push" });
  });

  it("can have values popped from it", () => {
    expect(stringStack.pop()).toEqual(`test-string-${randomNumber}`);
    expect(stringStack.size()).toEqual(randomNumber - 1);
    expect(numberStack.pop()).toEqual(randomNumber);
    expect(numberStack.size()).toEqual(randomNumber - 1);
    expect(objectStack.pop()).toEqual({ id: `test-id-${randomNumber}` });
    expect(objectStack.size()).toEqual(randomNumber - 1);
  });

  it("return undefined when no value can be popped from it", () => {
    const stringStack2 = new Stack<string>();
    expect(stringStack2.isEmpty()).toBeTruthy();
    expect(stringStack2.pop()).toEqual(undefined);
    const numberStack2 = new Stack<number>();
    expect(numberStack2.isEmpty()).toBeTruthy();
    expect(numberStack2.pop()).toEqual(undefined);
    const objectStack2 = new Stack<{ id: string }>();
    expect(objectStack2.isEmpty()).toBeTruthy();
    expect(objectStack2.pop()).toEqual(undefined);
  });

  it("can have values peeked from it", () => {
    expect(stringStack.size()).toEqual(randomNumber);
    expect(stringStack.peek()).toEqual(`test-string-${randomNumber}`);
    expect(stringStack.size()).toEqual(randomNumber);
    expect(numberStack.size()).toEqual(randomNumber);
    expect(numberStack.peek()).toEqual(randomNumber);
    expect(numberStack.size()).toEqual(randomNumber);
    expect(objectStack.size()).toEqual(randomNumber);
    expect(objectStack.peek()).toEqual({ id: `test-id-${randomNumber}` });
    expect(objectStack.size()).toEqual(randomNumber);
  });

  it("can check the size of the stack", () => {
    expect(stringStack.size()).toEqual(randomNumber);
    expect(numberStack.size()).toEqual(randomNumber);
    expect(objectStack.size()).toEqual(randomNumber);
    const testStackSize = new Stack<number>();
    expect(testStackSize.size()).toEqual(0);
    const randomNumber2 = Math.floor(Math.random() * 25) + 5;
    for (let i = 1; i <= randomNumber2; i++) {
      testStackSize.push(i);
      expect(testStackSize.size()).toEqual(i);
    }
    expect(testStackSize.size()).toEqual(randomNumber2);
  });

  it("can check if the stack is empty", () => {
    expect(stringStack.isEmpty()).toBeFalsy();
    expect(numberStack.isEmpty()).toBeFalsy();
    expect(objectStack.isEmpty()).toBeFalsy();
    const testStackEmpty = new Stack<number>();
    expect(testStackEmpty.isEmpty()).toBeTruthy();
  });

  it("can convert the stack to an array", () => {
    const stringArray = stringStack.toArray();
    expect(stringArray.length).toEqual(stringStack.size());
    stringArray.every((item) => expect(typeof item).toEqual("string"));
    const numberArray = numberStack.toArray();
    expect(numberArray.length).toEqual(numberStack.size());
    numberArray.every((item) => expect(typeof item).toEqual("number"));
    const objectArray = objectStack.toArray();
    expect(objectArray.length).toEqual(objectStack.size());
    objectArray.every((item) => expect(typeof item).toEqual("object"));
  });
});
