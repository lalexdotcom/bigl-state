export type State = Record<string, unknown>;

type SetState<StateType extends State> = (
  partial:
    | Partial<StateType>
    | ((previousState: StateType) => Partial<StateType>),
  replace?: boolean
) => void;

type GetState<StateType extends State> = () => StateType;

type StateListener<StateType extends State> = (
  state: StateType,
  previousState: StateType
) => void;

type Subscribe<StateType extends State> = (
  listener: StateListener<StateType>,
  properties?: (keyof StateType)[]
) => () => void;

export type Store<StateType extends State> = {
  setState: SetState<StateType>;
  getState: GetState<StateType>;
  addListener: Subscribe<StateType>;
  clearListeners: () => void;
};

type StateCreateFunction<StateType extends State> = (
  set: SetState<StateType>,
  get: GetState<StateType>,
  api: Store<StateType>
) => StateType;

export function createStore<StateType extends State>(
  creator: StateCreateFunction<StateType>
): Store<StateType> {
  let state: StateType;

  const listeners: Map<
    StateListener<StateType>,
    (partial: Partial<StateType>) => StateListener<StateType> | undefined
  > = new Map();

  const getState = () => state;

  const setState = (
    partialOrSetter:
      | Partial<StateType>
      | ((previousState: StateType) => Partial<StateType>)
  ) => {
    const nextPartialState =
      typeof partialOrSetter === "function"
        ? partialOrSetter(state)
        : partialOrSetter;
    if (nextPartialState !== state) {
      const previousState = state;
      let hasDiff = false;
      const stateDiff = Object.fromEntries(
        Object.entries(nextPartialState).filter(([k, v]) => {
          const isDiff = !Object.is(v, previousState[k]);
          if (isDiff) hasDiff = true;
          return isDiff;
        })
      ) as Partial<StateType>;

      if (hasDiff) {
        state = Object.assign({}, state, stateDiff);
        listeners.forEach((listener) => {
          listener(stateDiff)?.(state, previousState);
        });
      }
    }
  };

  const addListener = (
    listener: StateListener<StateType>,
    props?: (keyof StateType)[]
  ) => {
    if (props?.length) {
      const propListener = (partialUpdate: Partial<StateType>) => {
        for (const p of props) {
          if (p in partialUpdate) return listener;
        }
      };
      listeners.set(listener, propListener);
    } else {
      listeners.set(listener, () => listener);
    }
    return () => listeners.delete(listener);
  };

  const clearListeners = () => listeners.clear();

  const api = { setState, getState, addListener, clearListeners };
  state = creator(setState, getState, api);
  return api;
}
