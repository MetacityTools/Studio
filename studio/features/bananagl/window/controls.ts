import { View } from "@bananagl/window/view";
import { Window } from "@bananagl/window/window";

import { KeyboardControls } from "./controls/keyboard";
import { MouseControls } from "./controls/mouse";

type LocalViewCoords = {
  view: View;
  x: number;
  y: number;
  lx: number;
  ly: number;
};

export class WindowControls {
  //last focused view
  public view?: View;
  readonly mouse = new MouseControls();
  readonly keyboard = new KeyboardControls();

  constructor(private window: Window) {}

  pointerDown(event: PointerEvent) {
    const localView = this.window.getViewAndPosition(event);
    if (!localView) return;
    this.view = localView.view;
    this.mouse.down(this.getEvent(localView, event));
    //deactivate any active keyboard shortcut
    event.preventDefault();
  }

  pointerMove(event: PointerEvent) {
    const localView = this.window.getViewAndPosition(event);
    if (!localView) return;
    if (!this.view) return;
    this.mouse.move(this.getEvent(localView, event));
    event.preventDefault();
  }

  pointerUp(event: PointerEvent) {
    const localView = this.window.getViewAndPosition(event);
    if (!localView) return;
    if (!this.view) return;
    event.preventDefault();
    return this.mouse.up(this.getEvent(localView, event), false);
  }

  pointerHover(event: PointerEvent) {
    const localView = this.window.getViewAndPosition(event);
    if (!localView) return;
    if (!this.view) return;
    event.preventDefault();
    return this.mouse.hover(this.getEvent(localView, event), false);
  }

  pointerOut(event: PointerEvent) {
    this.mouse.out();
    event.preventDefault();
  }

  lostFocus() {
    this.mouse.lostFocus();
  }

  wheel(event: WheelEvent) {
    const localView = this.window.getViewAndPosition(event);
    if (!localView) return;
    this.view = localView.view;
    this.mouse.wheel({
      view: this.view,
      delta: event.deltaY,
      x: localView.x,
      y: localView.y,
    });
  }

  contextMenu(event: MouseEvent) {
    event.preventDefault();
  }

  keydown(event: KeyboardEvent) {
    this.keyboard.down({
      view: this.view,
      code: event.code,
    });
  }

  keyup(event: KeyboardEvent) {
    this.keyboard.up({
      view: this.view,
      code: event.code,
    });
  }

  private getEvent(
    localView: LocalViewCoords,
    event: PointerEvent,
    useLocalView: boolean = false,
  ) {
    if (!this.view)
      throw new Error(
        "No view, check before calling getEvent() in WindowControls",
      );
    return {
      view: useLocalView ? localView.view : this.view, //assign the original view because when dragging out of its boundries, we want to keep transforming the original view
      x: localView.x,
      y: localView.y,
      button: event.button,
      keyMap: this.keyboard.keyMap,
    };
  }
}
