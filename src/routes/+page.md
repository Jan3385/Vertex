<script>
  import GLCanvas from '$lib/components/GLCanvas.svelte';
  import colorfulTriangle from '$lib/sketches/colorfulTriangle.ts'
  
  import Note from '$lib/components/Note.svelte';
  import Warning from '$lib/components/Warning.svelte';
</script>

# About this guide

This guide will be using **OpenGL** with **C++**, **GLFW**, **GLAD** and **GLM**. If you don't know any of the stuff its fine as we will be learning about each of them separately. This guide will help you go from knowing absolutely nothing to making your own 3D spinning cube

If you are planning to use C++ you should follow the [setup guide](/setup) to create your project

If you ever need additional resources for learning OpenGL [learnopengl.com](https://learnopengl.com) is a great place to start

During this guide you may see canvas elements such as this one:
<GLCanvas sketch={colorfulTriangle}/>
These canvas elements provide you with a live visual feedback of whats being showcased. These canvas elements use WebGL context which is really similar to OpenGL

## Do I need to use C++?

No! OpenGL has been ported over to so many languages that there is a very big chance that it will work even on your preferred language. If you do not see your preffered language in the following examples it does not mean it does not have an OpenGL port. Look up if your language allows using the OpenGL API!

### Differences

Here is a little script for creating a vertex array buffer in different languages so you can see the similarities

Notice how all OpenGL functions keep the same name across all the programming languages

#### C++
```cpp
GLfloat vertices[] = {
    -0.5f, -0.5f, 0.0f,
     0.5f, -0.5f, 0.0f,
     0.0f,  0.5f, 0.0f
};

GLuint VBO;
glGenBuffers(1, &VBO);
glBindBuffer(GL_ARRAY_BUFFER, VBO);
glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
```

#### Javascript
```javascript
const vertices = new Float32Array([
    -0.5, -0.5, 0.0,
     0.5, -0.5, 0.0,
     0.0,  0.5, 0.0
]);

const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
```

Javascript works a bit differently on the web as it uses WebGL, which runs on older OpenGL version and works with a HTML canvas instead of a window. Same principles still do apply

#### Java
```java
float[] vertices = {
    -0.5f, -0.5f, 0.0f,
     0.5f, -0.5f, 0.0f,
     0.0f,  0.5f, 0.0f
};

int vbo = GL15.glGenBuffers();
GL15.glBindBuffer(GL15.GL_ARRAY_BUFFER, vbo);
GL15.glBufferData(GL15.GL_ARRAY_BUFFER,
    BufferUtils.createFloatBuffer(vertices.length).put(vertices).flip(),
    GL15.GL_STATIC_DRAW);
```

## GLFW

GLFW is a `C` library (that also works in `C++`) but most languages have their own reimplementation like Rust's `glfw-rs` or it's build-in like in Java's `LWJGL`

This library allows us to create an OS window with an OpenGL context, handle input, timing, multiple monitors and events. We need it to talk to the OS about our window

It helps us for example create a window like:
```cpp
GLFWwindow* window = glfwCreateWindow(800, 600, "My Window", nullptr, nullptr);

// Main game/app loop...

glfwDestroyWindow(window);
window = nullptr;
```

## GLAD

GLAD is a loader generator for `C/C++` that generates us OpenGL function pointers at runtime which allows us to actually call the OpenGL API

Each language has their own implementation or has it loaded internaly by the main OpenGL library

## GLM

OpenGL Mathematics is a `C++ only` library that allows us to mirror `GLSL` types line vec3, mat4 etc. directly in C++. Other languages have their own math libraries that fill the same role such as Java's `JOML` or Javascript's `gl-matrix`

It allows us to do things like:
```cpp
glm::vec3 up       = glm::vec3(0.0f, 1.0f, 0.0f);
glm::vec3 position = glm::vec3(0.0f, 0.0f, 3.0f);

// moved up by 5
position = position * (up * 5.0f)

float distance = glm::distance(position, glm::vec3(3.0f, 2.0f, -2.0f))
```