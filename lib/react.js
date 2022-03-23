"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useState = void 0;
const react_1 = require("react");
const isSSR = typeof window === "undefined" ||
    !window.navigator ||
    /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);
const useIsomorphicLayoutEffect = isSSR ? react_1.useEffect : react_1.useLayoutEffect;
function useState(store, ...props) {
    const [, forceUpdate] = (0, react_1.useReducer)((c) => c + 1, 0);
    const stateBeforeSubscriptionRef = (0, react_1.useRef)(store.getState());
    useIsomorphicLayoutEffect(() => {
        const listener = () => {
            forceUpdate();
        };
        const unsubscribe = store.addListener(listener, props);
        if (store.getState() !== stateBeforeSubscriptionRef.current) {
            listener(); // state has changed before subscription
        }
        return unsubscribe;
    }, []);
    return store.getState();
}
exports.useState = useState;
const testObject = { a: 1, b: { x: "test" } };
let frozen;
//# sourceMappingURL=react.js.map