# Setting up a C++ project with CMAKE

Note that on Linux you may have some issues if using hyprland as it does not like the default glfw library. You would have to modify the CMakeLists.txt a bit for it to work

[There is an example project](https://github.com/Jan3385/Vertex/tree/main/example-project) in the github for these docs which you can download to have the project already set up. If you plan to just download the template I do still recommend to read this chapter as some apps need to be configured outside of the project

## GLAD

Setting up glad is more work than any other libraries we are gonna be using. Since GLAD needs to have a different structure for every version, with every added extension and specification we need to generate ourselfes a GLAD library that fits us. This can be done easily thanks to the [GLAD web service](https://glad.dav1d.de)

To generate our library using the website we just need to set the OpenGL version to 3.3 or higher (going lower may break things in this tutorial, higher will not as of April 2026). You also need the option for *Generate a loader* to be ON. You can ingore the extensions as we do not need any of them

The CMakeLists.txt below expects you to place the generated files as following
 - Make a folder in the root of the project that `external/glad/`
 - inside the folder place the `include` and `src` as `external/glad/include` and `external/glad/src`

The `glad.zip` provided contains the `include` and `src` in one zip

## VCPKG

VCPKG is a package manager for `C` and `C++` that lets us easily manage, download and include any packages it has in its database. If you already used VCPKG before you can skip setting up VCPKG until we get to the vcpkg.json

First thing we need to do is to download the vcpkg

Windows:
```bash
git clone https://github.com/microsoft/vcpkg.git C:\dev\vcpkg

cd C:\dev\vcpkg

.\bootstrap-vcpkg.bat

setx VCPKG_ROOT "C:\dev\vcpkg"

# You can also do this to integrate it for Visual Studio (!VS not VS Code!)
.\vcpkg integrate install
```

Linux:
```bash
git clone https://github.com/microsoft/vcpkg.git ~/vcpkg
cd ~/vcpkg

./bootstrap-vcpkg.sh

# if using bash use:
echo 'export VCPKG_ROOT=~/vcpkg' >> ~/.bashrc
# the main thing is you want to run `export VCPKG_ROOT=~/vcpkg` so VCPKG_ROOT becomes an enviroment variable
```

### vcpkg.json

vcpkg.json tells the vcpkg and CMake what packages we will be using from vcpkg. The general template will look like this

```json
{
  "name": "my-project",
  "version": "0.1.0",
  "description": "My first OpenGL project!",
  "dependencies": [
    "glfw3",
    "glm"
  ],
  "builtin-baseline": "b91c3336aee7f32412508f7dd351ae2cabdb8819"
}
```

The **buildin-baselide** may look scary at first but what it means is "I only want packages that are not older than this date". This helps our project to not break in the future where packages may change. You can find your own buildin-baseline or just use the one provided in this example 

Place the `vcpkg.json` inside the root project folder

## CMake

CMake is a building system for `C` and `C++` that makes adding libraries and compilation so much easier

There is a lot we can do with CMake but for this tutorial we are just gonna go for the basics

### CMakePresets.json

`CMakePresets.json` lets us quickly change between different compilation presets. For example we may want to have a *release* and *debug* preset that can help us either make our project run fast and optimized or make it easier for our debugger to debug

Here is an example of how `CmakePresets.json` may look like

```json
{
    "version": 3,
    "configurePresets": [
        {
            "name": "base",
            "hidden": true,
            "generator": "Ninja",
            "binaryDir": "${sourceDir}/build",
            "cacheVariables": {
                "CMAKE_EXPORT_COMPILE_COMMANDS": "YES",
                "CMAKE_CXX_FLAGS": "-Wall -Wextra -Wpedantic -Wno-unused-parameter",
                "CMAKE_CXX_FLAGS_DEBUG": "-g -fno-omit-frame-pointer"
            }
        },
        {
            "name": "debug-windows",
            "inherits": "base",
            "hidden": false,
            "description": "Debug configuration - Windows",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Debug",
                "CMAKE_VERBOSE_MAKEFILE": "ON",
                "VCPKG_TARGET_TRIPLET": "x64-mingw-static"
            }
        },
        {
            "name": "release-windows",
            "inherits": "base",
            "hidden": false,
            "description": "Release configuration - Windows",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Release",
                "VCPKG_TARGET_TRIPLET": "x64-mingw-static"
            }
        },
        {
            "name": "release-linux",
            "inherits": "base",
            "hidden": false,
            "description": "Release configuration - Linux",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Release",
                "VCPKG_TARGET_TRIPLET": "x64-linux"
            }
        },
        {
            "name": "debug-linux",
            "inherits": "base",
            "hidden": false,
            "description": "Debug configuration - Linux",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Debug",
                "CMAKE_VERBOSE_MAKEFILE": "ON",
                "VCPKG_TARGET_TRIPLET": "x64-linux"
            }
        }
    ]
}
```

Note that this example expects you to have a mingw compiler installed on windows!

Place the `CmakePresets.json` inside your root project folder

### CMakeLists.txt

In the heart of every CMake project is a file in project root called `CMakeLists.txt` which contains the instructions on how to build your project. I could make a whole guide just for working with CMake but for the sake of simplicity I will provide a template with comments so it makes sense

```cmake
cmake_minimum_required(VERSION 3.10)

# Setting up our compiler to always use the same standard and tools
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Setting up VCPKG
if(DEFINED ENV{VCPKG_ROOT} AND NOT DEFINED CMAKE_TOOLCHAIN_FILE)
  set(CMAKE_TOOLCHAIN_FILE "$ENV{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake" CACHE STRING "")
endif()

if(NOT DEFINED CMAKE_TOOLCHAIN_FILE)
  message(FATAL_ERROR "CMAKE_TOOLCHAIN_FILE is not defined. Make sure you specify it with -DCMAKE_TOOLCHAIN_FILE or set it as enviroment variable")
endif()

# Create our project
project(MyProject LANGUAGES C CXX)

# We can use these messages to quickly verify we are using the correct tools
message(STATUS "triplet: ${VCPKG_TARGET_TRIPLET}")
message(STATUS "Using generator: ${CMAKE_GENERATOR}")
message(STATUS "Using VCPKG toolchain file: ${CMAKE_TOOLCHAIN_FILE}")
message(STATUS "Preset build type: ${CMAKE_BUILD_TYPE}")

# Add GLAD to our project
add_library(glad STATIC
    external/glad/src/glad.c
)
target_include_directories(
  glad
  PUBLIC
  external/glad/include
)

# Add everything inside /source/ to our project
file(GLOB_RECURSE PROJECT_SOURCES CONFIGURE_DEPENDS "${CMAKE_CURRENT_SOURCE_DIR}/source/*.cpp")

# Create the executable
add_executable(MyProject
    ${PROJECT_SOURCES}
)

# Add the ability to use multiple header files and include them using #include "name.h"
target_include_directories(MyProject
    PRIVATE
    ${CMAKE_CURRENT_LIST_DIR}/source
)

# force VCPKG to find the following packages
find_package(glm CONFIG REQUIRED)
find_package(OpenGL REQUIRED)
find_package(glfw3 CONFIG REQUIRED)

# Put packages into our project
target_link_libraries(MyProject
  PRIVATE
    glad
    glm::glm
    glfw
    OpenGL::GL
)
```

later on you will need to copy some assets from your project to your build folder. This can be done by appending the following at the end of your CMakeLists.txt

```cmake
set(SHADERS_FOLDER "${CMAKE_SOURCE_DIR}/Shaders")
add_custom_target(copy_assets ALL
  COMMAND ${CMAKE_COMMAND} -E rm -rf ${CMAKE_BINARY_DIR}/Shaders
  COMMAND ${CMAKE_COMMAND} -E copy_directory ${SHADERS_FOLDER} ${CMAKE_BINARY_DIR}/Shaders
)

add_dependencies(MyProject copy_assets)
```

## Hello World!

After all this setup we have a project ready to render OpenGL on Windows or Linux. Last thing we need to do is to create our main function and compile it

In our `source/` folder we create `main.cpp` which can for now look like the following

```cpp
#include <iostream>

int main(int argc, char* argv[]) {
    std::cout << "Hello, world!" << std::endl;
    return EXIT_SUCCESS;
}
```

Remember to run all the following commands inside the project root folder

Then we need to tell CMake what preset we are gonna be using with
```bash
# instead of release-windows you can use any preset
cmake -S . --preset release-windows
```
Note that is you have not set VCPKG as your enviroment variable you will also need to add an argument like `-DCMAKE_TOOLCHAIN_FILE="/PATH/TO/VCPKG/CMAKE/vcpkg.cmake"`

And as the last command you just need to run
```bash
cmake --build build
```

Now in your generated `build/` directory you will see an executable called `MyProject.exe` or `MyProject`. Running it from inside the build folder will run your project

Note that editors like VS Code have packages that can manage the commands like building and selection a preset or execution of code for you