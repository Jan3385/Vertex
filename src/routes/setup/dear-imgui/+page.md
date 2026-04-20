# What's Dear ImGui

Dear ImGui is a `C++` library (that has been ported to a lot of other languages) used to quickly render debug UI for easily rendering text, making buttons etc

For ImGui we need to set the UI elements each frame. To change a text or any different attribute all we need to do is to send a different value to the ImGui function that frame. A call to the ImGui function may look like `ImGui::Text("Favorite number: %d", favoriteNumber);`

# Including it in our project

First we need to put the new library into the `vcpkg.json`. This can be done just by adding it to the list of dependencies. As ImGui is build for many rendering engines like SDL2, OpenGL, Vulkan,... we need to specify how are we planning to use ImGui

```json
...
"dependencies": [
    "glfw3",
    "glm",
    "other packages...",
    {
      "name": "imgui",
      "features": ["glfw-binding", "opengl3-binding"]
    }
]
...
```

Then we need to modify the `CMakeLists.txt` to put Dear ImGui into the project with

```cmake
find_package(imgui CONFIG REQUIRED)
```

and modify the project link libraries command as

```cmake
target_link_libraries(PlanetGenerator
  PRIVATE
    glad
    glm::glm
    glfw
    OpenGL::GL
    ...other libraries
    imgui::imgui
)
```

# C++ part of the code

After Adding the Dear ImGui in the project we can now use the ImGui includes with

```cpp
#include <imgui.h>
#include <imgui_impl_glfw.h>
#include <imgui_impl_opengl3.h>
```

Then at the **start** of our program we initialize ImGui

```cpp
// GLFWwindow* window = ...;

IMGUI_CHECKVERSION();
ImGui::CreateContext();
ImGuiIO& io = ImGui::GetIO(); (void)io;
// ImGui::StyleColorsDark(); // <- optional dark mode

ImGui_ImplGlfw_InitForOpenGL(window, true);
ImGui_ImplOpenGL3_Init("#version 330");
```

Remember that at the **end** of our application we need to delete the ImGui context

```cpp
ImGui_ImplOpenGL3_Shutdown();
ImGui_ImplGlfw_Shutdown();
ImGui::DestroyContext();
```

## Rendering loop

As a final rendering step in our rendering pipeline, just before swapping frame buffers with `glfwSwapBuffers(window);` we should render our ImGui UI

Before we start doing anything with ImGui elements we need to set a new ImGui frame

```cpp
ImGui_ImplGlfw_NewFrame();
ImGui_ImplOpenGL3_NewFrame();
ImGui::NewFrame();
```

Now we can create an ImGui window. This is the box holding all its buttons, texts and other elements. Inside the window we can add any elements we want. ImGui supports basic buttons, texts and sliders but also more advanced stuff like texture renderers, graph elements and much more

```cpp
ImGui::Begin("My Window");
ImGui::Text("FPS: %.1f", FPS);
ImGui::Text("Camera Position: (%.1f, %.1f, %.1f)", cameraPos.x, cameraPos.y, cameraPos.z);

// Button returns true if pressed
if(ImGui::Button("Do stuff")) Stuff();

if(ImGui::DragFloat("How much stuff", &numOfStuff, 0.1f, 0.1f, 10.0f))
    std::cout << "Stuff changed with ImGui to: " << numOfStuff << std::endl;

ImGui::Checkbox("Allow doing stuff", &isDoingStuffAllowed);

ImGui::End();
```

With `ImGui::Begin("...")` and `ImGui::End()` we can create as many ImGui windows as we want

When we stop inputting any new UI elements into our ImGui that frame we have to render it with

```cpp
ImGui::Render();
ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
```

## Input loop

<Note>
Input handling will be discussed a bit later. I recommend first setting up OpenGL for basic rendering and input handling first and then coming back to this chapter
</Note>

Dear ImGui needs to know about our inputs like mouse movements and keyboard presses. It does not poll that automatically and we need to tell it to poll it at the beginning of our input management

Before we start processing the window input in our update loop we need to do the following

```cpp
// starting to process window inputs

ImGuiIO& io = ImGui::GetIO();

// Our own input manager
// ------
glfwPollEvents();

// glfwGetKey(), anything else,...
// ------
```

During our input setup we have also overridden the mouse position and scroll callbacks. Since ImGui is no longer registered for those callbacks because of us we need to fix it by calling the ImGui callback inside our callback. The code should look something like this

```cpp
void cursorPositionCallback(GLFWwindow* window, double xpos, double ypos){
    ImGui_ImplGlfw_CursorPosCallback(window, xpos, ypos);
    // ...
}
void mouseButtonCallback(GLFWwindow* window, int button, int action, int mods){
    ImGui_ImplGlfw_MouseButtonCallback(window, button, action, mods);
    // ...
} 
void scrollCallback(GLFWwindow* window, double xoffset, double yoffset){
    ImGui_ImplGlfw_ScrollCallback(window, xoffset, yoffset);
    // ...
}
// + any other callbacks written by us and registered with GLFW
```

Something we will most likely want to use is the `io.WantCaptureMouse` and `io.WantCaptureKeyboard`. When we click on an ImGui element we most likely do not want to also register a click on anything behind the ImGui panel. The same thing for when writing in an ImGui text field and registering keyboard inputs for walking etc.

We can put an if statement in our callbacks asking ImGui if ImGui wanted to capture our mouse or keyboard that frame and if it did we skip our callback

```cpp
void mouseButtonCallback(GLFWwindow* window, int button, int action, int mods){
    ImGui_ImplGlfw_MouseButtonCallback(window, button, action, mods);
    
    if(ImGui::GetIO().WantCaptureMouse) return;

    // ...
} 
```