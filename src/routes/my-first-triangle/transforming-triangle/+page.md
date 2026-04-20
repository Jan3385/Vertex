<script>
  import GLCanvas from '$lib/components/GLCanvas.svelte';
  import spinningTriangle from '$lib/sketches/spinningTriangle.ts';

  import Note from '$lib/components/Note.svelte';
  import Warning from '$lib/components/Warning.svelte';
</script>

<Note>
Before continuing to this chapter I recommend first reading about <a  href="/my-first-triangle/vectors-and-matrices/">matrices in the vectors and matrices sub-chapter</a>
</Note>

# Uniforms

When we want to send our shader a small amount of data to a shader we can use uniforms which are a quick and easy way to send data. Uniforms are usually a single `float`, `vec3`, `mat4` and similar

In the beginning we are going to be using uniforms to set the color of a triangle or to set a triangle's transform

Uniforms can also be an array of variables which can be useful for example when having multiple light sources and passing their position, color and strength to a shader

In `GLSL` uniform are used like in the following example

```glsl
uniform vec3 color;

int main()
{
    FragColor = vec4(color.x, color.y, color.z, 1.0f);
}
```

<Note>
Uniforms inside the GLSL language are read-only variables
</Note>

In `C/C++` we can set the uniform of the shader by writing

```cpp
// GLuint ShaderID = shader program we want to set the uniform for

glm::vec3 color = glm::vec3(0.8f, 0.2f, 0.3f);

GLint location = glGetUniformLocation(ShaderID, "color");

if(location == -1) {
    // error: location for "color" was not found
    return;
}

glUniform3fv(location, 1, &color[0]);
```

When setting a shader uniform each available data type has its own function. We have functions like `glUniform3fv(..)`, `glUniformMatrix4fv(..)`, `glUniform1i(..)` and so on. As you can see the macro names have a naming convention describing what are we going to send. For example `glUniform1i` means that we will be sending a single (1) integer (i)

When using a data type with several values like `glm::mat4` or `glm::vec3` we need to pass a pointe r to the first value. This means that for `glm::vec3` we will be passing `&vector[0]`

# Rotating a triangle

As seen in the *vectors and matrices* chapter we can make a 4D matrix that rotates (or otherwise transforms) vertices. We can generate one just like

```cpp
// GLuint ShaderID = shader program we want to set the uniform for

glm::vec3 trianglePosition = glm::vec3(0.5f, 0.3f, 0.2f);

glm::mat4 transform = glm::mat4(1.0f);
transform = glm::rotate(transform, glm::radians(25.0f), glm::vec3(0.1f, 1.0f, 0.4f));

GLint location = glGetUniformLocation(ShaderID, "transform");
glUniformMatrix4fv(location, 1, GL_FALSE, &transform[0][0]);
```

And our **vertex** shader will look like

```glsl
layout (location = 0) in vec3 position;
uniform mat4 transform;

void main()
{
    gl_Position = transform * vec4(position.xyz, 1.0);
}
```

<Note>
Notice how the individual vertices are transformed inside the vertex shader not in our C/C++ part of program
</Note>

The shader program will keep the transform stored inside of it. To update it we need to send a new transform to the shader program with `glUniformMatrix4fv`. We should update the uniform when the value of a uniform changes in our C/C++ program and we do not need to set it again even after rebinding shaders. However if we change the uniform for example for a different object the uniform is again rewritten and we need to send the uniform of our first object again when rendering it even if it did not change in C/C++

If we change the angle of the transform and send it repeatedly once per frame to the triangle rendering shader the result should look like

<GLCanvas sketch={spinningTriangle}/>

<Note>
In the WebGL render above we can also see the color of the triangle changing. This is another uniform used inside the fragment shader
</Note>

Later on when rendering a full object we would want to store the position, rotation and scale for all our objects and update the shader uniform for each object rendered

The transform only serves to move the triangle to its world space position. If we want to make a camera and move it more based on our camera position/rotation we use a second different transform

# Delta time

Delta time is a variable that tells us how much time was spent between the last two frames. Let's say we want to move our triangle up by a certain amount. Right now we would put something like this in our game loop that runs every frame

```cpp
glm::vec3 trianglePos = glm::vec3(2.0f, 1.0f, -3.0f);
glm::vec3 up = glm::vec3(0.0f, 1.0f, 0.0f);

while(!glfwWindowShouldClose(window)){
    trianglePos += up;

    // Other per-frame stuff
}
```

But imagine that normally we have 60FPS (frames per second). This means that the code above runs 60 times every second meaning we move by `(0, 1, 0)` 60 times so by 60 every second. Now let's say our FPS went lower or that our game is running on a slower machine and now we are only getting 20FPS. The code moving our triangle up thus only runs 20 times per second so we move by `(0, 1, 0)` 20 times meaning we move by 20 every second

This is obviously not ideal as that means that our camera, player and objects will move and rotate unreliably. A player on a very good computer might move so fast the game becomes unplayable and a player with a very bad computer might move so slow it also becomes unplayable

This is why we have delta time. If we have 1 FPS our delta time will equal 1 as it took 1 second between frames. Now if we have 2 FPS our delta time will be equal 0.5 as it took half a second to complete each frame and so on

Now if we use our delta time with the up vector to move up by multiplying them our results will look like

| FPS | delta time | calculation      | movement per frame | frames needed to move by `1` |
|-----|------------|------------------|--------------------|------------------------------|
|  1  |     1      |(0, 1, 0) * 1     |     (0, 1, 0)      |               1              |
|  2  |    0.5     |(0, 1, 0) * 0.5   |    (0, 0.5, 0)     |               2              |
|  60 |  0.01666   |(0, 1, 0) * 0.1666|  (0, 0.1666, 0)    |              60              |

When using delta time our movement suddenly becomes slower and we need to account for that. If we did not use delta time before our movement moved us by around 60 depending on FPS but now we always move by 1 per second which is 60 times slower. If we still want to move by 60 per second we should write our code as

```cpp
// double deltaTime = ...;

glm::vec3 trianglePos = glm::vec3(2.0f, 1.0f, -3.0f);
glm::vec3 up = glm::vec3(0.0f, 1.0f, 0.0f);

while(!glfwWindowShouldClose(window)){
    trianglePos += up * 60.0f * deltaTime;

    // Other per-frame stuff
}
```

The code above is no longer FPS dependant and will result in the same movement no matter our FPS. This is perfect for any movement, rotation or time dependant value change like a timer

FPS and delta time can be calculated from the other one as `1/FPS = delta time` and `1/delta time = FPS`

## Calculating delta time

Calculating delta time is pretty simple and only needs to be done at the start of each frame. We just take the time from the previous frame and current frame and get the difference between the two. GLFW has a function that tells us time as a double making calculating delta time easy

```cpp
double previousFrame = 0;
double deltaTime;

while(!glfwWindowShouldClose(window)){
    double currentFrame = glfwGetTime();
    deltaTime = currentFrame - previousFrame;
    previousFrame = currentFrame;

    // std::cout << "deltaTime: " << deltaTime << std::endl;
    // std::cout << "FPS: " <<  1.0f/deltaTime << std::endl;

    // Other per-frame stuff
}
```

# Making a camera

A camera consists of two matrices called **view** and **projection**. View consists of the camera position and rotation and projection has the *camera projection matrix*

## View

A view is generated similar to an object transform by generating an identity matrix and moving rotating it

Just like in real life if we move a camera to the left everything from the camera's POV moves to the right. We can do that by negating all our camera coordinates and angles. If our camera is at `x=3` the camera view will have `x=-3`

```cpp
glm::vec3 cameraPosition = glm::vec3(1.0f, 0.5f, -0.2f);

glm::mat4 view = glm::mat4(1.0f);
view = glm::translate(view, -cameraPosition); // notice the minus sign next to cameraPosition
```

Of course we want to also rotate our camera. Luckily GLM provides us `glm::lookAt(..)` with 3 argument. First argument is where is a position to where are we looking from, the second argument is where are we looking to and the third one is a direction which will work as *up* and will point directly above us

```cpp
const glm::vec3 worldUp = glm::vec3(0.0f, 0.0f, 1.0f);

glm::vec3 cameraPosition = glm::vec3(1.0f, 0.5f, -0.2f);
float yawDeg = 25.0f;
float pitchDeg = 10.0f;

// calculate radians from degrees
float yaw   = glm::radians(yawDeg);
float pitch = glm::radians(pitchDeg);

// Get forward direction using yaw and pitch
glm::vec3 forward;
forward.x = cos(yaw) * cos(pitch);
forward.y = sin(pitch);
forward.z = sin(yaw) * cos(pitch);
forward = glm::normalize(forward);

// Generate a view matrix
glm::mat4 view = glm::lookAt(cameraPosition, cameraPosition + forward, worldUp);
```

When we make our camera as above we can see that we have no limit to how much we can look up or down to the point where we can rotate so far that we start to see our world from behind. This is not what we want most of the time so we need to lock our pitch **before** calculating the forward direction

```cpp
// we can look only from -89.0 degrees to 89.0 degrees
constexpr float maxPitch = 89.0f;

if(pitch > maxPitch)  pitch = maxPitch;
if(pitch < -maxPitch) pitch = -maxPitch;
```

This is the part were we probably want to connect our <a href="/creating-a-window/input-processing/">input system</a> with the rest of our program so we can move and look around our scene. It is as simple as modifying the camera position vector based on keys pressed and setting the camera pitch and yaw based on delta mouse movement

## Projection

...