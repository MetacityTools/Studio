import { View } from "../view";

export class KeyMap {
  private keys: { [key: string]: boolean } = {};

  clone() {
    const clone = new KeyMap();
    clone.keys = { ...this.keys };
    return clone;
  }

  set(code: string, value: boolean) {
    console.log("setting", code, value);
    this.keys[code] = value;
  }

  get(code: string) {
    return this.keys[code];
  }

  get shift() {
    return this.keys["ShiftLeft"];
  }

  get alt() {
    return this.keys["AltLeft"] || this.keys["MetaLeft"];
  }

  get ctrl() {
    return this.keys["ControlLeft"];
  }

  get escape() {
    return this.keys["Escape"];
  }

  reset() {
    this.keys = {};
  }
}

interface IKeyboardEvent {
  view?: View;
  code: string;
}

export class KeyboardControls {
  readonly keyMap: KeyMap = new KeyMap();

  down(event: IKeyboardEvent) {
    const { code, view } = event;
    this.keyMap.set(code, true);
  }

  up(event: IKeyboardEvent) {
    const { code } = event;
    this.keyMap.set(code, false);
  }
}
