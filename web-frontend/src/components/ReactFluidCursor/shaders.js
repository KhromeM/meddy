export const fragmentShader = `
  precision mediump float;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_velocity;
  uniform float u_fill;
  uniform float u_fillAmount;

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec2 mouse = u_mouse / u_resolution;

    float dist = distance(st, mouse);
    float radius = 0.1 + u_fill * u_fillAmount * 0.3;
    float strength = smoothstep(radius, radius - 0.05, dist);

    vec3 color = mix(
      vec3(0.988, 0.694, 0.627),
      vec3(0.718, 0.855, 0.925),
      st.y + sin(u_time) * 0.1
    );

    color = mix(vec3(1.0), color, strength);
    
    gl_FragColor = vec4(color, strength * (1.0 - u_fill * u_fillAmount));
  }
`;
