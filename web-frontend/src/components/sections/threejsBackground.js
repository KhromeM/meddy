import * as THREE from 'three';

export const setupThreeJSScene = (mountRef, hexColor = "#5555aa") => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });

  renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
  mountRef.current.appendChild(renderer.domElement);

  // Convert hex color to RGB
  const color = new THREE.Color(hexColor);

  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2() },
      baseColor: { value: new THREE.Vector3(color.r, color.g, color.b) }
    },
    vertexShader: `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec2 resolution;
      uniform vec3 baseColor;
      
      vec3 rgb2hsv(vec3 c) {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
      }
      
      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }
      
      void main() {
        vec2 st = gl_FragCoord.xy / resolution.xy;
        vec3 hsvColor = rgb2hsv(baseColor);
        
        // Shift hue based on position and time, only in positive direction
        // Increased time factor for faster animation
        float hueShift = (sin(st.x * 5.0 + time * 0.7) * sin(st.y * 5.0 - time * 0.7) * 0.5 + 0.5) * 0.1;
        hsvColor.x = mod(hsvColor.x + hueShift, 1.0);
        
        // Vary brightness based on a different pattern
        // Increased time factor for faster animation
        float brightnessShift = sin(st.x * 7.0 - time * 0.7) * sin(st.y * 7.0 - time * 0.7) * 0.1;
        hsvColor.z = clamp(hsvColor.z + brightnessShift, 0.0, 1.0);
        
        vec3 color = hsv2rgb(hsvColor);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  camera.position.z = 1;

  function animate() {
    requestAnimationFrame(animate);
    // Increased time increment for faster animation
    material.uniforms.time.value += 0.03;
    renderer.render(scene, camera);
  }

  function onWindowResize() {
    camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    material.uniforms.resolution.value.set(mountRef.current.clientWidth, mountRef.current.clientHeight);
  }

  window.addEventListener('resize', onWindowResize);
  onWindowResize(); // Set initial size
  animate();

  return () => {
    window.removeEventListener('resize', onWindowResize);
    if (mountRef.current) {
      mountRef.current.removeChild(renderer.domElement);
    }
  };
};