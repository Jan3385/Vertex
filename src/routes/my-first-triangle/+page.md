<script>
  import GLCanvas from '$lib/components/GLCanvas.svelte';
  import triangle from '$lib/sketches/triangle.ts';

  import Note from '$lib/components/Note.svelte';
  import Warning from '$lib/components/Warning.svelte';
</script>

# Large portion of this page is WIP

# Theory

<hr>

## OpenGL

...

## Buffers

...

### Binding

...

## Shaders

...

### Vertex Shader

...

### Fragment Shader

...

# Rendering

<hr>

To render our first triangle we must create an array of vertices representing our shape. A simple triangle may look like the following

```cpp
float triangleVertices[] = [
//   X ,    Y ,   Z
  -0.5f, -0.5f, 0.0f,
   0.5f, -0.5f, 0.0f,
   0.0f,  0.5f, 0.0f
]
```

## Vertex Array Buffer

Vertex Array Buffer (VBO) will help us send our vertices over to the GPU memory. Generating our buffer is simple

```cpp
GLuint VBO;
glGenBuffers(1, &VBO);
```

<Note>
When generating an OpenGL resource, you may see an argument that is usually a '1', This is because OpenGL allows us to create multiple OpenGL resources with a single API call. The performance from this is negligible so we won't be using it
</Note>

To start using our buffer we need to bind it to the correct buffer slot

```cpp
glBindBuffer(GL_ARRAY_BUFFER, VBO);
```

GL_ARRAY_BUFFER represents the slot our buffer will be slotted in. Some of the other buffer types are GL_ELEMENT_ARRAY_BUFFER, GL_ELEMENT_ARRAY_BUFFER, GL_UNIFORM_BUFFER

Now we need to send our CPU data `triangleVertices` to the GPU buffer `VBO`

```cpp
glBufferData(GL_ARRAY_BUFFER, sizeof(triangleVertices), triangleVertices, GL_STATIC_DRAW);
```

GL_STATIC_DRAW has alternatives like GL_DYNAMIC_DRAW and GL_STREAM_DRAW. This will prefer to place our buffer in memory thats optimized for our amount of access
 - **GL_STATIC_DRAW** means we will be rarely or never sending any more data to the GPU buffer
 - **GL_DYNAMIC_DRAW** means we will be updating our data quite often
 - **GL_STREAM_DRAW** means we will rarely or never send any more data to the GPU buffer and our GPU will use our buffer just a few times

The arguments passed to `glBufferData(..)` basically mean we will be working with an `array buffer` and we will send `sizeof(triangleVertices)` amount of data that starts at `triangleVertices` and we won't be sending more data to the buffer anymore as it is `static draw`

<Note>
As `triangleVertices` is a C/C++ array we can also use it as a pointer to the start of our data
</Note>

Now our GPU knows about our triangle's location. All we need to do now is to set up our shaders and render it

## Shaders

Shaders allow us to use our vertex array buffer in order to render something to the viewport. We need to define two shaders, A vertex and fragment shader. We can use more shaders like the geometry shader between them but we do not have to do that for now

A shader is written using the `GLSL`

### Vertex shader

```glsl
#version 330 core
layout (location = 0) in vec3 vertexPos;

void main()
{
    gl_Position = vec4(vertexPos.x, vertexPos.y, vertexPos.z, 1.0);
}
```

In the following example we are creating a shader for the OpenGL version 3.3. Then we are declaring that we will be binding our buffer with vertices as the first input (we will be getting into how this exactly works later). The `main` function then runs for all vertices provided where it just sets the position of our vertex to the one provided

<Note>
The reason for us having to set `gl_Position` to the `vertexPos` instead of this happening automatically is that commonly we would want to position/rotate/scale our vertices based on our camera or our objects transform
</Note>

### Fragment shader

```glsl
#version 330 core
out vec4 FragColor;

void main()
{
    FragColor = vec4(1.0f, 0.5f, 0.2f, 1.0f);
} 
```

A fragment shader does not interact with the bound buffers directly. It takes in variables passed from the vertex shader and runs the `main` function for each pixel that was included during **rasterization**

It outputs `FragColor` as an RGBA value in the range (0.0, 1.0) which will be written into our frame buffer. We can rename the `FragColor` to anything we want we just need to make it the first variable that goes out. The depth buffer is calculated automatically so we do not need to worry about it

If the fragment shaders finds that the pixel is further away than the pixel that was in the depth buffer it is skipped

### Compiling

Now that we have our shaders we need to get them into our C/C++ program. To do that we can either write and store it directly in our code like

```cpp
const char* vertexShaderSource = "...";
```

or load it from a file using `std::ifstream` or similar

<Note>
When loading from a file it is possible to make a simple preprocessor for self-defined macros. For that you just need to look for a specific keyword like `#GET` or any other macro you define yourself and replace the line with anything you want. It is also possible to automatically insert the OpenGL version at the start of a loaded file so that we don't have to put it inside every shader we make
</Note>

or any other way to get it into the `const char*` or `std::string` in our program memory

<Note>
Technically we **need** just `const char*` but we can still use `std::string` thanks to the `std::string` member function `.c_str()`
</Note>

Now that the shader is stored in a variable in program memory we can start the compilation process

To compile the shaders we first need to make an OpenGL object that hold the compiled shader

```cpp
// Already loaded GLSL code
// const char* vertexShaderSource = "...";
// const char* fragmentShaderSource = "...";

GLuint myVertexShader;
myShader = glCreateShader(GL_VERTEX_SHADER);
glShaderSource(myVertexShader, 1, &vertexShaderSource, nullptr);
glCompileShader(myVertexShader);

GLuint myFragmentShader;
myShader = glCreateShader(GL_FRAGMENT_SHADER);
glShaderSource(myVertexShader, 1, &vertexShaderSource, nullptr);
glCompileShader(myVertexShader);
```

<Note>
the `nullptr` inside `glShaderSource` is for a specified length of our string. It is not needed as the string will contain an null terminator
</Note>

After compiling each of our shaders we may want to look for any compilation errors. There is an OpenGL function called `glGetShaderiv(...)` exactly for this purpose

```cpp
// myShader will be for myVertexShader and myFragmentShader in this example

constexpr unsigned int MAX_MSG_ERROR_LEN = 512;

GLint compilationSuccessful;
glGetShaderiv(myShader, GL_COMPILE_STATUS, &success);
if(!success){
  char errorMessage[MAX_MSG_ERROR_LEN];
  glGetShaderInfoLog(myShader, MAX_MSG_ERROR_LEN, NULL, errorMessage);
  std::cout << "OpenGL Compilation error: " << errorMessage << std::endl;
}
```

After compiling both (or more) shaders we need to create a **shader program**. Shader program combines the shaders together and allows us to use them

```cpp
GLuint shaderProgram;
shaderProgram = glCreateProgram();
```

After creating the shader program we need to link the vertex and fragment shader to it

```cpp
glAttachShader(shaderProgram, myVertexShader);
glAttachShader(shaderProgram, myFragmentShader);
glLinkProgram(shaderProgram);

// We can again check for any errors during linking with
// glGetShaderiv(shaderProgram, GL_LINK_STATUS, &success);
// the rest is the same
```

Now after linking the shaders to a shader program, we do not need the shaders anymore. To free up some space and prevent memory leaks we should delete them with

```cpp
glDeleteShader(myVertexShader);
glDeleteShader(myFragmentShader);  
```

Right now we have the buffer and shader program ready. The last step is telling OpenGL how the buffer should interact with the shader program

## Putting it all together

### Telling our buffer how to put data to our shader

To store the information on how to use our buffer we need to create a Vertex array object. It is possible with

```cpp
unsigned int VAO;
glGenVertexArrays(1, &VAO);  
```

To setup the VAO we do

```cpp
// We are now saying our VAO how to bind our buffer and its attributes
glBindVertexArray(VAO);

// Our VAO is using VBO array buffer
glBindBuffer(GL_ARRAY_BUFFER, VBO);

glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
glEnableVertexAttribArray(0);
```

Now lets talk about what the specific arguments mean

In the first macro the following arguments are
 - Vertex attribute we are modifying (it is the (location = 0) from our vertex shader)
 - The **size** of our attribute. We are using Vec3 for the position of a vertex which is composed from 3 floats
 - What **data type** is the attribute. A Vec3 is made from 3 **floats** so we use `GL_FLOAT`
 - If we want our data to be normalized (meaning transformed into (0; 1) or (-1; 1)). We do not want that for our position data so we set it to `GL_FALSE`
 - Defines the **stride**. Stride means how many bytes we want to skip for the next position data. We want to skip 3 floats (one Vec3 argument) to get the new one
 - Defines the **offset** as a `void*` argument. The vertex data starts right at the start of our buffer so we are not setting any offset (thus (void*)0)

The `glEnableVertexAttribArray` tells OpenGL that we will need (layout = 0) enabled and to make it accessible

## Putting a triangle on the screen

We have a shader program and VAO. These are the two primitives needed for rendering

Shader program says how are we going to render the object

VAO tells us how the vertices are stored, where they are stored and how to send it to the shader program

```cpp
glUseProgram(shaderProgram);
glBindVertexArray(VAO);
glDrawArrays(GL_TRIANGLES, 0, 3);
```

`glDrawArrays` tells OpenGL to use the currently bound VAO and shader program to draw on the currently bound frame buffer (default is our window). We are telling OpenGL to draw a triangle that should start from the beginning (0) and read 3 Vec3 values (3)

Running the code above in the rendering loop will show us a triangle on the screen. Your screen should look like the rendered element below

<GLCanvas sketch={triangle}/>