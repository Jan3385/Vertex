import * as glUtils from './glUtils';

export default function colorfulTriangle(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2')!;

  // setup
  gl.clearColor(0.1, 0.2, 0.3, 1.0);

  const size = 0.75;
  const vertices = new Float32Array([
     size, -size, 0.0, 1.0, 0.0, 0.0,
    -size, -size, 0.0, 0.0, 1.0, 0.0,
      0.0,  size, 0.0, 0.0, 0.0, 1.0
  ]);

  const vertexBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const vertexShaderSource = `#version 300 es
  in vec3 aPosition;
  in vec3 aColor;

  out vec3 vColor;

  void main() {
    gl_Position = vec4(aPosition, 1.0);
    vColor = aColor;
  }
  `;
  const fragmentShaderSource = `#version 300 es
  precision mediump float;
  out vec4 fragColor;

  in vec3 vColor;

  void main() {
    fragColor = vec4(vColor, 1.0);
  }
  `;
  const shaderProgram = glUtils.CreateShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
  if (!shaderProgram) {
    console.error('Failed to create shader program');
    return;
  }

  gl.useProgram(shaderProgram);

  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
  gl.enableVertexAttribArray(1);


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