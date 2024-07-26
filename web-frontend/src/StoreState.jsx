// Store/index.js
import React, { createContext, useReducer } from "react";

export const StoreState = createContext();
export const StoreDispatch = createContext();

const initialState = {
	circleFill: false,
};

const reducer = (state, action) => {
	switch (action.type) {
		case "CIRCLE_GROW":
			return { ...state, circleFill: true };
		case "CIRCLE_SHRINK":
			return { ...state, circleFill: false };
		default:
			return state;
	}
};

export const StoreProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<StoreState.Provider value={state}>
			<StoreDispatch.Provider value={dispatch}>
				{children}
			</StoreDispatch.Provider>
		</StoreState.Provider>
	);
};
