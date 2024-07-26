import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const CursorShader = ({ x, y, velocity, fill, fillAmount, location }) => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
		const scene = new THREE.Scene();
		const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

		const geometry = new THREE.PlaneGeometry(2, 2);
		const material = new THREE.ShaderMaterial({
			uniforms: {
				u_time: { value: 0 },
				u_resolution: { value: new THREE.Vector2() },
				u_mouse: { value: new THREE.Vector2() },
				u_velocity: { value: 0 },
				u_fill: { value: 0 },
				u_fillAmount: { value: 0 },
			},
			vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
			fragmentShader: `
			    uniform float u_time;
			    uniform vec2 u_resolution;
			    uniform vec2 u_mouse;
			    uniform float u_velocity;
			    uniform float u_fill;
			    uniform float u_fillAmount;

			    void main() {
			      vec2 st = gl_FragCoord.xy / u_resolution;
			      vec2 mouse = u_mouse;
			      float dist = distance(st, mouse);
			      float radius = 0.07 + u_fillAmount * 0.1 + u_velocity * 0.015;
			      float strength = smoothstep(radius, radius - 0.05, dist);

			      vec3 color = mix(
			        vec3(0.988, 0.694, 0.627),
			        vec3(0.718, 0.855, 0.925),
			        st.y + sin(u_time) * 0.1
			      );

			      color = mix(vec3(1.0), color, strength);
			      float alpha = strength * (1.0 - u_fill * u_fillAmount);

			      gl_FragColor = vec4(color, alpha);
			    }
			  `,
			transparent: true,
		});

		const mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);

		const resize = () => {
			renderer.setSize(window.innerWidth, window.innerHeight);
			material.uniforms.u_resolution.value.set(
				window.innerWidth,
				window.innerHeight
			);
		};
		window.addEventListener("resize", resize);
		resize();

		const animate = (time) => {
			material.uniforms.u_time.value = time * 0.001;
			material.uniforms.u_mouse.value.set(
				x / window.innerWidth,
				1 - y / window.innerHeight
			);
			material.uniforms.u_velocity.value = velocity * 3;
			material.uniforms.u_fill.value = fill ? 1 : 0;
			material.uniforms.u_fillAmount.value = fillAmount;

			renderer.render(scene, camera);
			requestAnimationFrame(animate);
		};
		animate(0);

		return () => {
			window.removeEventListener("resize", resize);
			renderer.dispose();
		};
	}, [x, y, velocity, fill, fillAmount, location]);

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				pointerEvents: "none",
				zIndex: 9998,
			}}
		/>
	);
};

export default CursorShader;
