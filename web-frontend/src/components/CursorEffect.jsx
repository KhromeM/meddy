import React, { useRef, useEffect, useContext } from "react";
import * as THREE from "three";
import { StoreState } from "../StoreState.jsx";
import { fragmentShaderCursor } from "./CursorShader/fragmentShader.js";

const CursorEffect = () => {
	const canvasRef = useRef(null);
	const rendererRef = useRef(null);
	const sceneRef = useRef(null);
	const cameraRef = useRef(null);
	const bufferSceneRef = useRef(null);
	const bufferMaterialRef = useRef(null);
	const finalMaterialRef = useRef(null);
	const textureARef = useRef(null);
	const textureBRef = useRef(null);
	const mouseRef = useRef({ x: 0, y: 0 });
	const store = useContext(StoreState);

	useEffect(() => {
		const canvas = canvasRef.current;
		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
		rendererRef.current = renderer;

		const scene = new THREE.Scene();
		sceneRef.current = scene;

		const bufferScene = new THREE.Scene();
		bufferSceneRef.current = bufferScene;

		const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
		cameraRef.current = camera;

		const geometry = new THREE.PlaneGeometry(2, 2);

		const bufferMaterial = new THREE.ShaderMaterial({
			uniforms: {
				u_time: { value: 0 },
				u_res: { value: new THREE.Vector2() },
				u_scrollable: { value: 0 },
				u_bufferTexture: { value: null },
				u_mousePos: { value: new THREE.Vector2() },
				u_circleColorStart: { value: new THREE.Vector3(0.988, 0.694, 0.627) },
				u_circleColorMiddle: { value: new THREE.Vector3(0.933, 0.765, 0.949) },
				u_circleColorEnd: { value: new THREE.Vector3(0.718, 0.855, 0.925) },
				u_filled: { value: 0 },
				u_speed: { value: 0 },
				u_pagePos: { value: 0 },
				u_scrollPos: { value: 0 },
			},
			vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
			fragmentShader: fragmentShaderCursor,
			transparent: true,
		});
		bufferMaterialRef.current = bufferMaterial;

		const bufferMesh = new THREE.Mesh(geometry, bufferMaterial);
		bufferScene.add(bufferMesh);

		const finalMaterial = new THREE.MeshBasicMaterial({ transparent: true });
		finalMaterialRef.current = finalMaterial;

		const finalMesh = new THREE.Mesh(geometry, finalMaterial);
		scene.add(finalMesh);

		const createRenderTarget = () => {
			return new THREE.WebGLRenderTarget(
				window.innerWidth,
				window.innerHeight,
				{
					minFilter: THREE.LinearFilter,
					magFilter: THREE.NearestFilter,
					format: THREE.RGBAFormat,
					type: THREE.FloatType,
				}
			);
		};

		textureARef.current = createRenderTarget();
		textureBRef.current = createRenderTarget();

		const handleResize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			renderer.setSize(width, height);
			bufferMaterial.uniforms.u_res.value.set(width, height);
			textureARef.current.setSize(width, height);
			textureBRef.current.setSize(width, height);
		};

		const handleMouseMove = (event) => {
			mouseRef.current.x = event.clientX;
			mouseRef.current.y = event.clientY;
		};

		window.addEventListener("resize", handleResize);
		window.addEventListener("mousemove", handleMouseMove);

		handleResize();

		// Initialize the buffer texture with a background color
		const initTexture = () => {
			const data = new Float32Array(4 * window.innerWidth * window.innerHeight);
			for (let i = 0; i < data.length; i += 4) {
				data[i] = 0.992; // R
				data[i + 1] = 0.961; // G
				data[i + 2] = 0.929; // B
				data[i + 3] = 1; // A
			}
			const texture = new THREE.DataTexture(
				data,
				window.innerWidth,
				window.innerHeight,
				THREE.RGBAFormat,
				THREE.FloatType
			);
			texture.needsUpdate = true;
			return texture;
		};

		bufferMaterial.uniforms.u_bufferTexture.value = initTexture();

		return () => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("mousemove", handleMouseMove);
			renderer.dispose();
			geometry.dispose();
			bufferMaterial.dispose();
			finalMaterial.dispose();
			textureARef.current.dispose();
			textureBRef.current.dispose();
		};
	}, []);

	useEffect(() => {
		let animationFrameId;
		const animate = () => {
			const bufferMaterial = bufferMaterialRef.current;
			const finalMaterial = finalMaterialRef.current;
			const renderer = rendererRef.current;
			const scene = sceneRef.current;
			const bufferScene = bufferSceneRef.current;
			const camera = cameraRef.current;

			if (
				bufferMaterial &&
				finalMaterial &&
				renderer &&
				scene &&
				bufferScene &&
				camera
			) {
				bufferMaterial.uniforms.u_time.value += 0.05;
				bufferMaterial.uniforms.u_mousePos.value.set(
					mouseRef.current.x,
					mouseRef.current.y // No need to invert Y here
				);
				bufferMaterial.uniforms.u_filled.value = store.circleFill ? 1 : 0;

				bufferMaterial.uniforms.u_scrollable.value =
					document.documentElement.scrollHeight - window.innerHeight;
				bufferMaterial.uniforms.u_pagePos.value =
					window.scrollY /
					(document.documentElement.scrollHeight - window.innerHeight);
				bufferMaterial.uniforms.u_scrollPos.value = window.scrollY;

				// Render to texture B
				renderer.setRenderTarget(textureBRef.current);
				renderer.render(bufferScene, camera);

				// Use texture B as input for next frame
				bufferMaterial.uniforms.u_bufferTexture.value =
					textureBRef.current.texture;

				// Swap textures
				const temp = textureARef.current;
				textureARef.current = textureBRef.current;
				textureBRef.current = temp;

				// Render to screen
				finalMaterial.map = textureARef.current.texture;
				renderer.setRenderTarget(null);
				renderer.render(scene, camera);
			}
			animationFrameId = requestAnimationFrame(animate);
		};
		animate();

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [store.circleFill]);

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				pointerEvents: "none",
				zIndex: 9999,
			}}
		/>
	);
};

export default CursorEffect;
