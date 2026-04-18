# Keyboard input

At the start of our game loop we should process our keyboard inputs. For now we are not really using them but later we might want to implement movement or interaction keys and such

To implement a basic keyboard input processing we just need to call the `glfwGetKey(...)` function every frame. For this we can make a function that handles all inputs. Such function may look like the code below

```cpp
void processKeyboardInputs(GLFWwindow *window){
    // close our window when space is pressed
    if(glfwGetKey(window, GLFW_KEY_SPACE) == GLFW_PRESS)
        glfwSetWindowShouldClose(window, true);

    // change window title when W is pressed
    if(glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS)
        glfwSetWindowTitle(window, "Window where 'W' was pressed");
}
```

Then we just call `processKeyboardInputs(...)` at the start of each frame

```cpp
while(!glfwWindowShouldClose(window)){
    glfwPollEvents();

    processKeyboardInputs(window);

    // ------
    // rendering, game logic etc.
    // ------

    glfwSwapBuffers(window);

}
```

## Keyboard callback

Instead of checking pressed keys every frame we can let GLFW run a callback for any newly pressed/released or held buttons. This is not preferred for movement or any other action that heavily works with held keys as the callback for a held key is not send every frame. This is however preferred for actions that act more like a text input or an event like interaction with key press

For a keyboard callback we need to make a function defined as

```cpp
void keyboardCallback(GLFWwindow* window, int key, int scancode, int action, int mods){
    if (key == GLFW_KEY_E && action == GLFW_PRESS)
        interact();
}
```

This function has many arguments. Below is the definition for them

**key** is for the key pressed. It starts with `GLFW_KEY_` and then the key we are checking for. The last part can be for example `ENTER`, `E`, `F3` or `4`

**scancode** is a platform specific scancode for the key pressed

**action** is either `GLFW_PRESS`, `GLFW_REPEAT` or `GLFW_RELEASE`

**mods** is short for modifier bits which are flags triggered during mouse button press like holding shift, ctrl and such. The flags are:
 - GLFW_MOD_SHIFT
 - GLFW_MOD_CONTROL
 - GLFW_MOD_ALT
 - GLFW_MOD_SUPER - super is the name for the commonly named "windows button" or any other OS equivalent name
 - GLFW_MOD_CAPS_LOCK
 - GLFW_MOD_NUM_LOCK

# Mouse input

Instead of a function that returns the mouse position/event and such we use event callbacks. GLFW offers multiple callbacks for mouse click, move, scroll,...

## Mouse movement

To set the mouse movement callback we need to make a function to link to the callback. Make sure that your function always matches the argument and return value types

```cpp
void cursorPositionCallback(GLFWwindow* window, double xpos, double ypos){
    // store or in any was use the new cursor position
}
```

And to set the callback we just need to set it with

```cpp
glfwSetCursorPosCallback(window, cursorPositionCallback);
```

### Polling mouse position

It is possible to poll the position from GLFW at any time we want however we should prefer storing the mouse position from the callback instead

```cpp
double xpos, ypos;
glfwGetCursorPos(window, &xpos, &ypos);
```

### Hiding/showing the cursor

When playing for example a 3D game we often can't see our cursor. Hiding the cursor is essential for 3D games to not feel bad but when opening a menu or an interaction requires a cursor we want to show it again for a limited time. Hiding and showing the cursor requires just a single function call

```cpp
glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);
```

The *GLFW_CURSOR_DISABLED* is one of many modes a cursor can gain. Here is a short list of usable cursor modes
 - GLFW_CURSOR_NORMAL - Normal cursor behavior
 - GLFW_CURSOR_DISABLED - Cursor is not visible and automatically centered so it cannot move offscreen
 - GLFW_CURSOR_HIDDEN - Cursor is hidden but can move anywhere even outside of the window

### Delta mouse

For things like camera control and such we do not care about the mouse position but more about how much did our mouse move from last time which is called delta movement

To implement this we just need to modify our callback a little

```cpp
glm::vec2 deltaMouse = glm::vec2(0.0f, 0.0f);
glm::vec2 mousePos = glm::vec2(0.0f, 0.0f);

void cursorPositionCallback(GLFWwindow* window, double xpos, double ypos){
    glm::vec2 newMousePos = glm::vec2(xpos, ypos);
    
    deltaMouse = newMousePos - mousePos;

    mousePos = newMousePos;
}
```

## Mouse click

For mouse button inputs we have to again create a function for the callback

```cpp
void mouseButtonCallback(GLFWwindow* window, int button, int action, int mods){
    if (button == GLFW_MOUSE_BUTTON_RIGHT && action == GLFW_PRESS)
        std::cout << "Pressed right click!" << std::endl;
} 
```

The callback gives us three values. **button**, **action** and **mods**

**button** can have the following values
 - GLFW_MOUSE_BUTTON_LEFT - left click
 - GLFW_MOUSE_BUTTON_MIDDLE - middle click
 - GLFW_MOUSE_BUTTON_RIGHT - right click
 - GLFW_MOUSE_BUTTON_X - the X can be a number between 1 and 8 (inclusive). The values 1, 2 and 3 are for the left, middle and right click and the bigger values are for things like mouse side buttons

**action** can only be *GLFW_PRESS* or *GLFW_RELEASE*

**mods** represent the same values as during keyboard callback

### Polling mouse click

Like with the mouse position we can also poll for mouse buttons and see which ones are pressed and which ones are not. It is again better to use the callback if possible

```cpp
int state = glfwGetMouseButton(window, GLFW_MOUSE_BUTTON_LEFT);
```

The `state` will be equal to either *GLFW_PRESS* or *GLFW_RELEASE*

When polling the mouse inputs there is a chance of missing the mouse input. To prevent that we should also set our mouse keys as "sticky keys" where they retain `GLFW_PRESS` even if they are not pressed anymore until we call `glfwGetMouseButton(...)` on them

```cpp
glfwSetInputMode(window, GLFW_STICKY_MOUSE_BUTTONS, GLFW_TRUE);
```

## Mousewheel scroll

The function for mouse scroll should be defined as

```cpp
void scrollCallback(GLFWwindow* window, double xoffset, double yoffset){

}
```

And to register the function to the glfw callback we just need to call

```cpp
glfwSetScrollCallback(window, scrollCallback);
```