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