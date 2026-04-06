import * as glUtils from './glUtils';

export default function triangle(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2')!;

  // setup
  gl.clearColor(0.1, 0.2, 0.3, 1.0);

  const vertices = new Float32Array([
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
    0.0, 0.5, 0.0
  ]);

  const vertexBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const vertexShaderSource = `#version 300 es
  in vec3 aPosition;

  void main() {
    gl_Position = vec4(aPosition, 1.0);
  }
  `;
  const fragmentShaderSource = `#version 300 es
  precision mediump float;
  out vec4 fragColor;

  void main() {
    fragColor = vec4(1.0, 0.5, 0.2, 1.0);
  }
  `;
  const shaderProgram = glUtils.CreateShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
  if (!shaderProgram) {
    console.error('Failed to create shader program');
    return;
  }

  gl.useProgram(shaderProgram);

  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);


  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(render);
  }

  render();

  return () => {
    // cleanup
  };
}