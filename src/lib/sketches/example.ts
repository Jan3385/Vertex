export default function test(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2')!;

  // setup
  gl.clearColor(0.1, 0.2, 0.3, 1.0);

  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // repeating code

    requestAnimationFrame(render);
  }

  render();

  return () => {
    // cleanup
  };
}