#include <iostream>

#include <glad/glad.h>
#include <GLFW/glfw3.h>

// The GLAD version of OpenGL in stih example is 3.3

void OnWindowResizeCallback(GLFWwindow* window, int newWidth, int newHeight){
    glViewport(0, 0, newWidth, newHeight);
}

int main(int argc, char* argv[]) {
    glfwInit();
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

    GLFWwindow* window = glfwCreateWindow(800, 600, "Showcase", nullptr, nullptr);

    if (window == nullptr) {
        std::cerr << "Failed to create GLFW window" << std::endl;
        glfwTerminate();
        return EXIT_FAILURE;
    }

    glfwMakeContextCurrent(window);

    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) {
        std::cerr << "Failed to initialize GLAD" << std::endl;
        return EXIT_FAILURE;
    }

    glViewport(0, 0, 800, 600);

    glfwSetFramebufferSizeCallback(window, OnWindowResizeCallback);

    while(!glfwWindowShouldClose(window)){
        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    glfwTerminate();

    return EXIT_SUCCESS;
}