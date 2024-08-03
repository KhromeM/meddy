import * as THREE from "three";

export const setupThreeJSScene = (mountRef, hexColor = "#5555aa") => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    mountRef.current.clientWidth / mountRef.current.clientHeight,
    0.1,
    1000
  );
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
      baseColor: { value: new THREE.Vector3(color.r, color.g, color.b) },
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

      // Perlin noise function
      vec2 permute(vec2 x) {
        return mod(((x*34.0)+1.0)*x, 289.0);
      }

      float noise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                            -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);

        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);

        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;

        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                        + i.x + vec3(0.0, i1.x, 1.0 ));

        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;

        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;

        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;

        return 130.0 * dot(m, g);
      }

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

        // Shift hue based on position and time
        float hueShift = (noise(st * 3.0 + time * 0.1) - 0.5) * 0.1;
        hsvColor.x = mod(hsvColor.x + hueShift, 1.0);

        // Vary brightness based on noise
        float brightnessShift = noise(st * 3.0 - time * 0.1) * 0.1;
        hsvColor.z = clamp(hsvColor.z + brightnessShift, 0.0, 1.0);

        vec3 color = hsv2rgb(hsvColor);

        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  camera.position.z = 1;

  function animate() {
    requestAnimationFrame(animate);
    material.uniforms.time.value += 0.01; // Adjust the speed of the animation
    renderer.render(scene, camera);
  }

  function onWindowResize() {
    camera.aspect =
      mountRef.current.clientWidth / mountRef.current.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    material.uniforms.resolution.value.set(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
  }

  window.addEventListener("resize", onWindowResize);
  onWindowResize(); // Set initial size
  animate();

  return () => {
    window.removeEventListener("resize", onWindowResize);
    if (mountRef.current) {
      mountRef.current.removeChild(renderer.domElement);
    }
  };
};
