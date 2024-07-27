import { useContext } from "react";
import { CursorStoreDispatch } from "./CursorStore";

export const useCursor = () => {
	const dispatch = useContext(CursorStoreDispatch);

	return {
		showDragCursor: () => dispatch({ type: "SHOW_DRAG_CURSOR" }),
		hideDragCursor: () => dispatch({ type: "HIDE_DRAG_CURSOR" }),
		growCircle: () => dispatch({ type: "CIRCLE_GROW" }),
		shrinkCircle: () => dispatch({ type: "CIRCLE_SHRINK" }),
	};
};
