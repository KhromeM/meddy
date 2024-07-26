import React, { useRef, useState, useContext, useEffect } from "react";
import { CursorStoreState } from "./CursorStore";
import gsap from "gsap";
import CursorShader from "./CursorShader";
import {
	CursorWrapper,
	DragCursorIcon,
	DragCursorInner,
	DragCursorText,
} from "./styles";
import { isDesktop } from "react-device-detect";

const Cursor = ({ x, y, location }) => {
	const store = useContext(CursorStoreState);
	const [, setCursorPos] = useState([0, 0]);
	const [cursorVelocity, setCursorVelocity] = useState([0, 0, 0]);
	const [circlePos, setCirclePos] = useState([0, 0]);
	const cursorRef = useRef(null);
	const mousePosRef = useRef([0, 0]);
	const cursorPosRef = useRef([0, 0]);
	const cursorVelocityRef = useRef([0, 0, 0]);
	const circlePosRef = useRef([0, 0]);
	const mouseSpeedRef = useRef(0);
	const circleSpeedRef = useRef(0);
	const circleScale = useRef({
		fillAmount: 0,
	});

	useEffect(() => {
		mousePosRef.current[0] = x;
		mousePosRef.current[1] = y;
	}, [x, y]);

	useEffect(() => {
		gsap.to(circleScale.current, {
			fillAmount: store.circleFill ? 1 : 0,
			duration: store.circleFill ? 1 : 0.5,
			ease: "power4.in",
		});
	}, [store.circleFill]);

	const limit = (x) => {
		if (x < 0.001) return 0;
		if (x > 1) return 1;
		return x;
	};

	useEffect(() => {
		let raf;

		const renderLoop = () => {
			// Calculate difference (velocity)
			cursorVelocityRef.current[0] =
				mousePosRef.current[0] - cursorPosRef.current[0];
			cursorVelocityRef.current[1] =
				mousePosRef.current[1] - cursorPosRef.current[1];

			// Lerp circle and cursor pos to mouse pos
			circlePosRef.current[0] +=
				(mousePosRef.current[0] - circlePosRef.current[0]) * 0.1;
			circlePosRef.current[1] +=
				(mousePosRef.current[1] - circlePosRef.current[1]) * 0.1;
			cursorPosRef.current[0] += cursorVelocityRef.current[0] * 0.3;
			cursorPosRef.current[1] += cursorVelocityRef.current[1] * 0.3;

			// Calculate lerped velocity for shader
			mouseSpeedRef.current = limit(
				Math.max(
					Math.abs(cursorVelocityRef.current[0] / 40),
					Math.abs(cursorVelocityRef.current[1] / 40)
				)
			);
			circleSpeedRef.current +=
				(mouseSpeedRef.current - circleSpeedRef.current) * 0.1;

			setCursorPos([cursorPosRef.current[0], cursorPosRef.current[1]]);
			setCursorVelocity([
				cursorVelocityRef.current[0],
				cursorVelocityRef.current[1],
				circleSpeedRef.current,
			]);
			setCirclePos([circlePosRef.current[0], circlePosRef.current[1]]);
			raf = window.requestAnimationFrame(renderLoop);
		};

		raf = window.requestAnimationFrame(renderLoop);

		return () => {
			window.cancelAnimationFrame(raf);
		};
	}, []);

	return (
		<>
			<CursorShader
				x={circlePos[0]}
				y={circlePos[1]}
				velocity={cursorVelocity[2]}
				fill={store.circleFill}
				fillAmount={circleScale.current.fillAmount}
				location={location}
			/>
			{/* {isDesktop && ( */}
			<CursorWrapper ref={cursorRef}>
				{/* <DragCursorIcon
					x={x}
					y={y}
					xVelocity={cursorVelocity[0]}
					yVelocity={cursorVelocity[1]}
				>
					<DragCursorInner show={store.dragCursor}></DragCursorInner>
				</DragCursorIcon> */}
			</CursorWrapper>
		</>
	);
};

export default Cursor;
