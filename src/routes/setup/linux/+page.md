<script>
  import Warning from '$lib/components/Warning.svelte';
</script>

# Linux CMakeLists.txt

On Linux there are multiple types of window protocols. We need to provide our GLFW the libraries that are needed to run on our specific window protocol

To do that we need to check if our system has wayland or X11 installed and if so, fetch their libraries. This can be done by inserting the following example after `add_executable(MyProject ...)` and before `target_link_libraries(MyProject ...)`

```cmake
# Only run this code on Linux
if(UNIX AND NOT APPLE)
    # Try to find Wayland and X11
    find_package(PkgConfig REQUIRED)
    pkg_check_modules(WAYLAND wayland-client wayland-egl)
    find_package(X11)

    # Link Wayland if found
    if(WAYLAND_FOUND)
        target_include_directories(MyProject PRIVATE ${WAYLAND_INCLUDE_DIRS})
        target_link_libraries(MyProject PRIVATE ${WAYLAND_LIBRARIES})
    endif()

    # Link X11 if found
    if(X11_FOUND)
        target_link_libraries(MyProject PRIVATE ${X11_LIBRARIES})
    endif()

    target_link_libraries(MyProject PRIVATE dl pthread)
endif()
```

<Warning>
This will make the executable run on your specific system. To ensure that it runs on any Linux desktop instance you need to have both X11 and Wayland packages
</Warning>