export declare type State = Record<string, unknown>;
declare type SetState<StateType extends State> = (partial: Partial<StateType> | ((previousState: StateType) => Partial<StateType>), replace?: boolean) => void;
declare type GetState<StateType extends State> = () => StateType;
declare type StateListener<StateType extends State> = (state: StateType, previousState: StateType) => void;
declare type Subscribe<StateType extends State> = (listener: StateListener<StateType>, properties?: (keyof StateType)[]) => () => void;
export declare type Store<StateType extends State> = {
    setState: SetState<StateType>;
    getState: GetState<StateType>;
    addListener: Subscribe<StateType>;
    clearListeners: () => void;
};
declare type StateCreateFunction<StateType extends State> = (set: SetState<StateType>, get: GetState<StateType>, api: Store<StateType>) => StateType;
export declare function createStore<StateType extends State>(creator: StateCreateFunction<StateType>): Store<StateType>;
export {};
//# sourceMappingURL=store.d.ts.map