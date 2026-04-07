import"../chunks/DsnmJJEf.js";import{m as d,f as v,g,j as u,w as A}from"../chunks/D_9WaUQ2.js";import{G as R}from"../chunks/4OgS6P2e.js";import{C as h}from"../chunks/e2xLE808.js";var p=1e-6,l=typeof Float32Array<"u"?Float32Array:Array;function F(){var r=new l(16);return l!=Float32Array&&(r[1]=0,r[2]=0,r[3]=0,r[4]=0,r[6]=0,r[7]=0,r[8]=0,r[9]=0,r[11]=0,r[12]=0,r[13]=0,r[14]=0),r[0]=1,r[5]=1,r[10]=1,r[15]=1,r}function S(r,e,f){var a=f[0],o=f[1],n=f[2],i=Math.sqrt(a*a+o*o+n*n),s,c,t;return i<p?null:(i=1/i,a*=i,o*=i,n*=i,s=Math.sin(e),c=Math.cos(e),t=1-c,r[0]=a*a*t+c,r[1]=o*a*t+n*s,r[2]=n*a*t-o*s,r[3]=0,r[4]=a*o*t-n*s,r[5]=o*o*t+c,r[6]=n*o*t+a*s,r[7]=0,r[8]=a*n*t+o*s,r[9]=o*n*t-a*s,r[10]=n*n*t+c,r[11]=0,r[12]=0,r[13]=0,r[14]=0,r[15]=1,r)}function _(r){const e=r.getContext("webgl2");e.clearColor(.1,.2,.3,1);const f=new Float32Array([-.5,-.5,0,.5,-.5,0,0,.5,0]),a=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,a),e.bufferData(e.ARRAY_BUFFER,f,e.STATIC_DRAW);const i=h(e,`#version 300 es
  in vec3 aPosition;

  uniform mat4 uRotation;

  void main() {
    gl_Position = uRotation * vec4(aPosition, 1.0);
  }
  `,`#version 300 es
  precision mediump float;
  out vec4 fragColor;

  void main() {
    fragColor = vec4(1.0, 0.5, 0.2, 1.0);
  }
  `);if(!i){console.error("Failed to create shader program");return}e.useProgram(i),e.vertexAttribPointer(0,3,e.FLOAT,!1,0,0),e.enableVertexAttribArray(0);let s=F(),c=0;function t(){e.clear(e.COLOR_BUFFER_BIT),c+=.03,s=S(s,c,[0,1,.4]);const m=e.getUniformLocation(i,"uRotation");e.uniformMatrix4fv(m,!1,s),e.drawArrays(e.TRIANGLES,0,3),requestAnimationFrame(t)}return t(),()=>{e.deleteBuffer(a),e.deleteProgram(i)}}var P=u('<h1 id="under-construction">Under construction</h1> <!> <p>More guides will be released soon</p>',1);function B(r){var e=P(),f=d(v(e),2);R(f,{get sketch(){return _}}),A(2),g(r,e)}export{B as component};
