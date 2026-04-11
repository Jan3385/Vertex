import * as glUtils from './glUtils';
import { mat4, vec3 } from 'gl-matrix';

export default function triangle(canvas: HTMLCanvasElement) {
  let running = true;

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

  uniform mat4 uRotation;

  void main() {
    gl_Position = uRotation * vec4(aPosition, 1.0);
  }
  `;
  const fragmentShaderSource = `#version 300 es
  precision mediump float;
  out vec4 fragColor;

  uniform vec3 uColor;

  void main() {
    fragColor = vec4(uColor, 1.0);
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

  let rotationMatrix = mat4.create();
  const color = vec3.fromValues(1.0, 0.5, 0.2);
  let frameCounter = 0;
  let angle = 0;

  const uRotationLocation = gl.getUniformLocation(shaderProgram!, 'uRotation');
  const uColorLocation = gl.getUniformLocation(shaderProgram!, 'uColor');

  function render() {
    if (!running) return;

    frameCounter++;
    gl.clear(gl.COLOR_BUFFER_BIT);

    angle += 0.03;
    rotationMatrix = mat4.fromRotation(rotationMatrix, angle, [0.1, 1, 0.4]);

    gl.uniformMatrix4fv(uRotationLocation, false, rotationMatrix);

    gl.uniform3f(uColorLocation, color[0], color[1], color[2]);
    const time = frameCounter * 0.01;
    color[0] = (Math.sin(time) * 0.5 + 0.5);
    color[1] = (Math.sin(time + 2.0) * 0.5 + 0.5);
    color[2] = (Math.sin(time + 4.0) * 0.5 + 0.5);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(render);
  }

  render();

  return () => {
    running = false;

    // cleanup
    gl.deleteBuffer(vertexBuffer);
    gl.deleteProgram(shaderProgram);
  };
}