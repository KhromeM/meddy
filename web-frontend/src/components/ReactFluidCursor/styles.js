import styled from "styled-components";

const colors = {
	dark: "#353535",
	light: "#FDF5ED",
	orange: "#FFC783",
	pink: "#FBABA7",
	purple: "#EEC3F2",
	blue: "#B7D2EC",
	turquoise: "#B7E9EC",
};

const font = {
	primary: {
		family: "Nib",
		weight: {
			regular: 400,
		},
	},
	secondary: {
		family: "Fellix",
		weight: {
			medium: 500,
			semibold: 600,
		},
	},
	fallback: {
		family: "sans-serif",
	},
};

const easings = {
	in: {
		cubic: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
		circ: "cubic-bezier(0.6, 0.04, 0.98, 0.335)",
		expo: "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
		quart: "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
		sine: "cubic-bezier(0.47, 0, 0.745, 0.715)",
		back: "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
		quad: "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
		quint: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
	},
	out: {
		cubic: "cubic-bezier(0.215, 0.61, 0.355, 1)",
		circ: "cubic-bezier(0.075, 0.82, 0.165, 1)",
		expo: "cubic-bezier(0.19, 1, 0.22, 1)",
		quart: "cubic-bezier(0.165, 0.84, 0.44, 1)",
		sine: "cubic-bezier(0.39, 0.575, 0.565, 1)",
		back: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
		quad: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
		quint: "cubic-bezier(0.23, 1, 0.32, 1)",
	},
	inOut: {
		default: "cubic-bezier(0.52, 0.01, 0, 1)",
		cubic: "cubic-bezier(0.645, 0.045, 0.355, 1)",
		circ: "cubic-bezier(0.785, 0.135, 0.15, 0.86)",
		expo: "cubic-bezier(1, 0, 0, 1)",
		quart: "cubic-bezier(0.77, 0, 0.175, 1)",
		sine: "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
		back: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
		quad: "cubic-bezier(0.49, 0, 0.195, 1)",
		quint: "cubic-bezier(0.86, 0, 0.07, 1)",
	},
	modal: {
		default: "cubic-bezier(0.70, 0.00, 0.30, 1.00)",
	},
	drag: {
		default: "cubic-bezier(0.33, 0.00, 0.67, 1.00)",
	},
};
export const CursorWrapper = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	pointer-events: none;
	z-index: 999;
`;

export const CursorIcon = styled.div.attrs(
	({ x, y, xVelocity, yVelocity }) => ({
		style: {
			transform: `translateX(${x}px) translateY(${y}px) rotateZ(${
				xVelocity / 5
			}deg) rotateZ(${yVelocity / 5}deg)`,
		},
	})
)`
	height: 2.2rem;
	position: absolute;
	top: 0;
	left: 0;
	width: 1.9rem;
	transition: opacity 0.5s ${easings.modal.default};
	z-index: 2;

	${({ show }) => {
		return show === false
			? `
opacity: 1;
transition - delay: .25 s;
`
			: `
opacity: 0;
transition - delay: 0 s;
`;
	}}
`;

export const DragCursorIcon = styled.div.attrs(
	({ x, y, xVelocity, yVelocity }) => ({
		style: {
			transform: `translateX(calc(${x}px - 3.7rem)) translateY(calc(${y}px - 3.7rem)) rotateZ(0)`,
		},
	})
)`
	display: inline-block;
	height: 7.4rem;
	width: 7.4rem;
`;
export const DragCursorInner = styled.div`
	background: ${colors.light};
	border: 0.1rem solid ${colors.dark};
	border-radius: 50%;
	transform-origin: center;
	transition: transform 0.25s ${easings.modal.default};
	height: 7.4rem;
	width: 7.4rem;

	${({ show }) => {
		return show === true
			? `
transform: scale(1);

$ {
    DragCursorText
} {
    opacity: 1;
    transition - delay: .05 s;
}
`
			: `
transform: scale(0);
transition - delay: .05 s;

$ {
    DragCursorText
} {
    opacity: 0;transition - delay: 0 s;
}
`;
	}}
`;
export const DragCursorText = styled.span`
	color: ${colors.dark};
	display: inline-block;
	font-family: ${font.secondary.family};
	left: 50%;
	position: absolute;
	top: 50%;
	transform: translateX(-50%) translateY(-50%);
	transition: opacity 0.25s ${easings.modal.default};
`;
