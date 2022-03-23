import { State, Store } from "./store";
export declare function useState<StateType extends State>(store: Store<StateType>): StateType;
export declare function useState<StateType extends State, StateKey extends keyof StateType>(store: Store<StateType>, ...props: StateKey[]): Pick<StateType, StateKey>;
//# sourceMappingURL=react.d.ts.map