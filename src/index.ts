import { createStore, State, Store as StateStore } from "./store";
import { useState as useLState } from "./react";
export namespace LST {
  export type Store<T extends State> = StateStore<T>;
  export const create = createStore;
  export const useState = useLState;
}
