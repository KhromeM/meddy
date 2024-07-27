import React, { useState, useEffect } from "react";
import { CursorStore } from "./CursorStore";
import Cursor from "./Cursor";

const ReactFluidCursor = () => {
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (event) => {
			setMousePos({ x: event.clientX, y: event.clientY });
		};

		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	console.log("Mouse position:", mousePos);

	return (
		<CursorStore>
			<Cursor
				x={mousePos.x}
				y={mousePos.y}
				location={window.location.pathname}
			/>
		</CursorStore>
	);
};

export default ReactFluidCursor;
