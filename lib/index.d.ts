import { createStore, State, Store as StateStore } from "./store";
import { useState as useLState } from "./react";
export declare namespace LST {
    type Store<T extends State> = StateStore<T>;
    const create: typeof createStore;
    const useState: typeof useLState;
}
//# sourceMappingURL=index.d.ts.map