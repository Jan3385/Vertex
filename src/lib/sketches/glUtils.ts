export function CreateAndCompileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function CreateShaderProgram(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string) {
  const vertexShader = CreateAndCompileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = CreateAndCompileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const shaderProgram = gl.createProgram()!;
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(shaderProgram));
    gl.deleteProgram(shaderProgram);
    return null;
  }
  return shaderProgram;
}