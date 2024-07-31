// ThreeJSBackground.js
import * as THREE from 'three';

export const setupThreeJSScene = (mountRef) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  mountRef.current.appendChild(renderer.domElement);

  scene.background = null;

  camera.position.z = 0.5;

  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      colorA: { value: new THREE.Color(0xFBD9FF) },
      colorB: { value: new THREE.Color(0xD8D9FF) },

      circleCenter: { value: new THREE.Vector2(0.0, 0.5) },
      targetPosition: { value: new THREE.Vector2(0.5, 1.0) },
      isHovering: { value: 0 },
      circleRadius: { value: 0.1 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 colorA;
      uniform vec3 colorB;
      uniform vec2 circleCenter;
      uniform float isHovering;
      uniform float circleRadius;
      varying vec2 vUv;
      void main() {
        float dist = distance(vUv, circleCenter);
    float circle = smoothstep(circleRadius, circleRadius - 0.1, dist);
    vec3 color = mix(colorB, colorA, circle);
    float alpha = circle * 0.5; // Adjust the 0.5 to control overall opacity
    gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true
  });
  const square = new THREE.Mesh(geometry, material);
  scene.add(square);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const handleMouseMove = (event) => {
    const rect = mountRef.current.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(square);
  
    if (intersects.length > 0) {
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      material.uniforms.targetPosition.value.set(x, y);
      material.uniforms.isHovering.value = 1.0;
    } else {
      material.uniforms.isHovering.value = 0.0;
    }
  
    renderer.render(scene, camera);
  };

  const handleMouseLeave = () => {
    material.uniforms.isHovering.value = 0.0;
    renderer.render(scene, camera);
  };

  const lerpFactor = 0.04;
  const animate = () => {
    if (material.uniforms.isHovering.value > 0.5) {
      const currentX = material.uniforms.circleCenter.value.x;
      const currentY = material.uniforms.circleCenter.value.y;
      const targetX = material.uniforms.targetPosition.value.x;
      const targetY = material.uniforms.targetPosition.value.y;
  
      const newX = currentX + (targetX - currentX) * lerpFactor;
      const newY = currentY + (targetY - currentY) * lerpFactor;
  
      material.uniforms.circleCenter.value.set(newX, newY);
    }

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  animate();

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('mousemove', handleMouseMove);
  mountRef.current.addEventListener('mouseleave', handleMouseLeave);
  window.addEventListener('resize', handleResize);

  return () => {
    mountRef.current.removeChild(renderer.domElement);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('mousemove', handleMouseMove);
    mountRef.current.removeEventListener('mouseleave', handleMouseLeave);
  };
};