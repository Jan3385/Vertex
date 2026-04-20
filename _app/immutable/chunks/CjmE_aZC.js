import{C as h}from"./Bhpopd0P.js";var d=1e-6,u=typeof Float32Array<"u"?Float32Array:Array;function F(){var r=new u(16);return u!=Float32Array&&(r[1]=0,r[2]=0,r[3]=0,r[4]=0,r[6]=0,r[7]=0,r[8]=0,r[9]=0,r[11]=0,r[12]=0,r[13]=0,r[14]=0),r[0]=1,r[5]=1,r[10]=1,r[15]=1,r}function C(r,o,e){var n=e[0],a=e[1],c=e[2],l=Math.sqrt(n*n+a*a+c*c),t,f,i;return l<d?null:(l=1/l,n*=l,a*=l,c*=l,t=Math.sin(o),f=Math.cos(o),i=1-f,r[0]=n*n*i+f,r[1]=a*n*i+c*t,r[2]=c*n*i-a*t,r[3]=0,r[4]=n*a*i-c*t,r[5]=a*a*i+f,r[6]=c*a*i+n*t,r[7]=0,r[8]=n*c*i+a*t,r[9]=a*c*i-n*t,r[10]=c*c*i+f,r[11]=0,r[12]=0,r[13]=0,r[14]=0,r[15]=1,r)}function S(){var r=new u(3);return u!=Float32Array&&(r[0]=0,r[1]=0,r[2]=0),r}function y(r,o,e){var n=new u(3);return n[0]=r,n[1]=o,n[2]=e,n}(function(){var r=S();return function(o,e,n,a,c,l){var t,f;for(e||(e=3),n||(n=0),a?f=Math.min(a*e+n,o.length):f=o.length,t=n;t<f;t+=e)r[0]=o[t],r[1]=o[t+1],r[2]=o[t+2],c(r,r,l),o[t]=r[0],o[t+1]=r[1],o[t+2]=r[2];return o}})();function M(r){let o=!0;const e=r.getContext("webgl2");e.clearColor(.1,.2,.3,1);const n=new Float32Array([-.5,-.5,0,.5,-.5,0,0,.5,0]),a=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,a),e.bufferData(e.ARRAY_BUFFER,n,e.STATIC_DRAW);const t=h(e,`#version 300 es
  in vec3 aPosition;

  uniform mat4 uRotation;

  void main() {
    gl_Position = uRotation * vec4(aPosition, 1.0);
  }
  `,`#version 300 es
  precision mediump float;
  out vec4 fragColor;

  uniform vec3 uColor;

  void main() {
    fragColor = vec4(uColor, 1.0);
  }
  `);if(!t){console.error("Failed to create shader program");return}e.useProgram(t),e.vertexAttribPointer(0,3,e.FLOAT,!1,0,0),e.enableVertexAttribArray(0);let f=F();const i=y(1,.5,.2);let m=0,v=0;const g=e.getUniformLocation(t,"uRotation"),R=e.getUniformLocation(t,"uColor");function A(){if(!o)return;m++,e.clear(e.COLOR_BUFFER_BIT),v+=.03,f=C(f,v,[.1,1,.4]),e.uniformMatrix4fv(g,!1,f),e.uniform3f(R,i[0],i[1],i[2]);const s=m*.01;i[0]=Math.sin(s)*.5+.5,i[1]=Math.sin(s+2)*.5+.5,i[2]=Math.sin(s+4)*.5+.5,e.drawArrays(e.TRIANGLES,0,3),requestAnimationFrame(A)}return A(),()=>{o=!1,e.deleteBuffer(a),e.deleteProgram(t)}}export{C as a,F as c,y as f,M as t};
