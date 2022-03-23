"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStore = void 0;
function createStore(creator) {
    let state;
    const listeners = new Map();
    const getState = () => state;
    const setState = (partialOrSetter) => {
        const nextPartialState = typeof partialOrSetter === "function"
            ? partialOrSetter(state)
            : partialOrSetter;
        if (nextPartialState !== state) {
            const previousState = state;
            let hasDiff = false;
            const stateDiff = Object.fromEntries(Object.entries(nextPartialState).filter(([k, v]) => {
                const isDiff = !Object.is(v, previousState[k]);
                if (isDiff)
                    hasDiff = true;
                return isDiff;
            }));
            if (hasDiff) {
                state = Object.assign({}, state, stateDiff);
                listeners.forEach((listener) => {
                    var _a;
                    (_a = listener(stateDiff)) === null || _a === void 0 ? void 0 : _a(state, previousState);
                });
            }
        }
    };
    const addListener = (listener, props) => {
        if (props === null || props === void 0 ? void 0 : props.length) {
            const propListener = (partialUpdate) => {
                for (const p of props) {
                    if (p in partialUpdate)
                        return listener;
                }
            };
            listeners.set(listener, propListener);
        }
        else {
            listeners.set(listener, () => listener);
        }
        return () => listeners.delete(listener);
    };
    const clearListeners = () => listeners.clear();
    const api = { setState, getState, addListener, clearListeners };
    state = creator(setState, getState, api);
    return api;
}
exports.createStore = createStore;
//# sourceMappingURL=store.js.map