import { State, Store } from "./store";
import { useEffect, useLayoutEffect, useReducer, useRef } from "react";

const isSSR =
  typeof window === "undefined" ||
  !window.navigator ||
  /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);

const useIsomorphicLayoutEffect = isSSR ? useEffect : useLayoutEffect;

type Frozen<T> = T extends (...args: any[]) => any
  ? T
  : T extends Promise<infer V>
  ? Frozen<V>
  : { readonly [K in keyof T]: Frozen<T[K]> };

export function useState<StateType extends State>(
  store: Store<StateType>
): StateType;
export function useState<
  StateType extends State,
  StateKey extends keyof StateType
>(store: Store<StateType>, ...props: StateKey[]): Pick<StateType, StateKey>;
export function useState<StateType extends State>(
  store: Store<StateType>,
  ...props: (keyof StateType)[]
) {
  const [, forceUpdate] = useReducer((c) => c + 1, 0);

  const stateBeforeSubscriptionRef = useRef(store.getState());
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

const testObject = { a: 1, b: { x: "test" } };
let frozen: Frozen<typeof testObject>;
