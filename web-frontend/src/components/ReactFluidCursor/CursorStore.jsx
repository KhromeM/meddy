import React, { createContext, useReducer } from "react";

export const CursorStoreState = createContext();
export const CursorStoreDispatch = createContext();

const initialState = {
	circleFill: false,
	dragCursor: true,
};

const reducer = (state, action) => {
	switch (action.type) {
		case "CIRCLE_GROW":
			return { ...state, circleFill: true };
		case "CIRCLE_SHRINK":
			return { ...state, circleFill: false };
		case "SHOW_DRAG_CURSOR":
			return { ...state, dragCursor: true };
		case "HIDE_DRAG_CURSOR":
			return { ...state, dragCursor: false };
		default:
			return state;
	}
};

export const CursorStore = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<CursorStoreState.Provider value={state}>
			<CursorStoreDispatch.Provider value={dispatch}>
				{children}
			</CursorStoreDispatch.Provider>
		</CursorStoreState.Provider>
	);
};
