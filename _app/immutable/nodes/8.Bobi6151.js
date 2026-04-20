import"../chunks/DsnmJJEf.js";import{m as e,f as F,g as n,j as h,n as l,o as p}from"../chunks/D3xeQSz7.js";import{N as c}from"../chunks/CEjJC-fu.js";import{W as u}from"../chunks/DYpsAN01.js";var C=h(`<h1 id="setting-up-a-c-project-with-cmake">Setting up a C++ project with CMAKE</h1> <!> <p>Linux CMakeLists.txt setup is shown in <a href="/setup/linux/">this linux setup guide</a></p> <p><a href="https://github.com/Jan3385/Vertex/tree/main/example-project" rel="nofollow">There is an example project</a> in the github for these docs which you can download to have the project already set up. If you plan to just download the template I do still recommend to read this chapter as some apps need to be configured outside of the project</p> <h2 id="glad">GLAD</h2> <p>Setting up glad is more work than any other libraries we are gonna be using. Since GLAD needs to have a different structure for every version, with every added extension and specification we need to generate ourselves a GLAD library that fits us. This can be done easily thanks to the <a href="https://glad.dav1d.de" rel="nofollow">GLAD web service</a></p> <p>To generate our library using the website we just need to set the OpenGL version to 3.3 or higher (going lower may break things in this tutorial, higher will not as of April 2026). You also need the option for <em>Generate a loader</em> to be ON. You can ignore the extensions as we do not need any of them</p> <p>The CMakeLists.txt below expects you to place the generated files as following</p> <ul><li>Make a folder in the root of the project as <code>external/glad/</code></li> <li>inside the folder place the <code>include</code> and <code>src</code> as <code>external/glad/include</code> and <code>external/glad/src</code></li></ul> <p>The <code>glad.zip</code> provided contains the <code>include</code> and <code>src</code> in one zip</p> <h2 id="vcpkg">VCPKG</h2> <p>VCPKG is a package manager for <code>C</code> and <code>C++</code> that lets us easily manage, download and include any packages it has in its database. If you already used VCPKG before you can skip setting up VCPKG until we get to the vcpkg.json</p> <p>First thing we need to do is to download the vcpkg</p> <p>Windows:</p> <div class="code-wrapper"><div class="code-label">bash</div><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#B392F0">git</span><span style="color:#9ECBFF"> clone</span><span style="color:#9ECBFF"> https://github.com/microsoft/vcpkg.git</span><span style="color:#9ECBFF"> C:</span><span style="color:#79B8FF">\\d</span><span style="color:#9ECBFF">ev</span><span style="color:#79B8FF">\\v</span><span style="color:#9ECBFF">cpkg</span></span>
<span class="line"><span style="color:#79B8FF">cd</span><span style="color:#9ECBFF"> C:</span><span style="color:#79B8FF">\\d</span><span style="color:#9ECBFF">ev</span><span style="color:#79B8FF">\\v</span><span style="color:#9ECBFF">cpkg</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF">.</span><span style="color:#E1E4E8">\\</span><span style="color:#9ECBFF">bootstrap-vcpkg.bat</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">setx</span><span style="color:#9ECBFF"> VCPKG_ROOT</span><span style="color:#9ECBFF"> "C:\\dev\\vcpkg"</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># You can also do this to integrate it for Visual Studio (!VS not VS Code!)</span></span>
<span class="line"><span style="color:#79B8FF">.</span><span style="color:#E1E4E8">\\</span><span style="color:#9ECBFF">vcpkg</span><span style="color:#9ECBFF"> integrate</span><span style="color:#9ECBFF"> install</span></span></code></pre></div> <p>Linux:</p> <div class="code-wrapper"><div class="code-label">bash</div><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#B392F0">git</span><span style="color:#9ECBFF"> clone</span><span style="color:#9ECBFF"> https://github.com/microsoft/vcpkg.git</span><span style="color:#9ECBFF"> ~/vcpkg</span></span>
<span class="line"><span style="color:#79B8FF">cd</span><span style="color:#9ECBFF"> ~/vcpkg</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">./bootstrap-vcpkg.sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># if using bash use:</span></span>
<span class="line"><span style="color:#79B8FF">echo</span><span style="color:#9ECBFF"> 'export VCPKG_ROOT=~/vcpkg'</span><span style="color:#F97583"> >></span><span style="color:#9ECBFF"> ~/.bashrc</span></span>
<span class="line"><span style="color:#6A737D"># the main thing is you want to run \`export VCPKG_ROOT=~/vcpkg\` so VCPKG_ROOT becomes an environment variable</span></span></code></pre></div> <h3 id="vcpkgjson">vcpkg.json</h3> <p>vcpkg.json tells the vcpkg and CMake which packages we will be using from vcpkg. The general template will look like this</p> <div class="code-wrapper"><div class="code-label">json</div><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">&#123;</span></span>
<span class="line"><span style="color:#79B8FF">  "name"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"my-project"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">  "version"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"0.1.0"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">  "description"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"My first OpenGL project!"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">  "dependencies"</span><span style="color:#E1E4E8">: [</span></span>
<span class="line"><span style="color:#9ECBFF">    "glfw3"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">    "glm"</span></span>
<span class="line"><span style="color:#E1E4E8">  ],</span></span>
<span class="line"><span style="color:#79B8FF">  "builtin-baseline"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"b91c3336aee7f32412508f7dd351ae2cabdb8819"</span></span>
<span class="line"><span style="color:#E1E4E8">&#125;</span></span></code></pre></div> <p>The <strong>builtin-baseline</strong> may look scary at first but what it means is <em>“I only want packages that are not older than this date”</em>. This helps our project to not break in the future where packages may change. You can find your own builtin-baseline or just use the one provided in this example</p> <p>Place the <code>vcpkg.json</code> inside the root project folder</p> <h2 id="cmake">CMake</h2> <p>CMake is a build system for <code>C</code> and <code>C++</code> that makes adding libraries and compilation so much easier</p> <p>There is a lot we can do with CMake but for this tutorial we are just gonna go for the basics</p> <h3 id="cmakepresetsjson">CMakePresets.json</h3> <p><code>CMakePresets.json</code> lets us quickly change between different compilation presets. For example we may want to have a <em>release</em> and <em>debug</em> preset that can help us either make our project run fast and optimized or make it easier for our debugger to debug</p> <p>Here is an example of how <code>CMakePresets.json</code> may look like</p> <div class="code-wrapper"><div class="code-label">json</div><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">&#123;</span></span>
<span class="line"><span style="color:#79B8FF">    "version"</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">3</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">    "configurePresets"</span><span style="color:#E1E4E8">: [</span></span>
<span class="line"><span style="color:#E1E4E8">        &#123;</span></span>
<span class="line"><span style="color:#79B8FF">            "name"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"base"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">            "hidden"</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">true</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">            "generator"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"Ninja"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">            "binaryDir"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"$&#123;sourceDir&#125;/build"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">            "cacheVariables"</span><span style="color:#E1E4E8">: &#123;</span></span>
<span class="line"><span style="color:#79B8FF">                "CMAKE_EXPORT_COMPILE_COMMANDS"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"YES"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">                "CMAKE_CXX_FLAGS"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"-Wall -Wextra -Wpedantic -Wno-unused-parameter"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">                "CMAKE_CXX_FLAGS_DEBUG"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"-g -fno-omit-frame-pointer"</span></span>
<span class="line"><span style="color:#E1E4E8">            &#125;</span></span>
<span class="line"><span style="color:#E1E4E8">        &#125;,</span></span>
<span class="line"><span style="color:#E1E4E8">        &#123;</span></span>
<span class="line"><span style="color:#79B8FF">            "name"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"debug-windows"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">            "inherits"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"base"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">            "hidden"</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">false</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">            "description"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"Debug configuration - Windows"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">            "cacheVariables"</span><span style="color:#E1E4E8">: &#123;</span></span>
<span class="line"><span style="color:#79B8FF">                "CMAKE_BUILD_TYPE"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"Debug"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">                "CMAKE_VERBOSE_MAKEFILE"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"ON"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">                "VCPKG_TARGET_TRIPLET"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"x64-mingw-static"</span></span>
<span class="line"><span style="color:#E1E4E8">            &#125;</span></span>
<span class="line"><span style="color:#E1E4E8">        &#125;,</span></span>
<span class="line"><span style="color:#E1E4E8">        &#123;</span></span>
<span class="line"><span style="color:#79B8FF">            "name"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"release-windows"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">            "inherits"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"base"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">            "hidden"</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">false</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">            "description"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"Release configuration - Windows"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">            "cacheVariables"</span><span style="color:#E1E4E8">: &#123;</span></span>
<span class="line"><span style="color:#79B8FF">                "CMAKE_BUILD_TYPE"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"Release"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">                "VCPKG_TARGET_TRIPLET"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"x64-mingw-static"</span></span>
<span class="line"><span style="color:#E1E4E8">            &#125;</span></span>
<span class="line"><span style="color:#E1E4E8">        &#125;,</span></span>
<span class="line"><span style="color:#E1E4E8">        &#123;</span></span>
<span class="line"><span style="color:#79B8FF">            "name"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"release-linux"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">            "inherits"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"base"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">            "hidden"</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">false</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">            "description"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"Release configuration - Linux"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">            "cacheVariables"</span><span style="color:#E1E4E8">: &#123;</span></span>
<span class="line"><span style="color:#79B8FF">                "CMAKE_BUILD_TYPE"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"Release"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">                "VCPKG_TARGET_TRIPLET"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"x64-linux"</span></span>
<span class="line"><span style="color:#E1E4E8">            &#125;</span></span>
<span class="line"><span style="color:#E1E4E8">        &#125;,</span></span>
<span class="line"><span style="color:#E1E4E8">        &#123;</span></span>
<span class="line"><span style="color:#79B8FF">            "name"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"debug-linux"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">            "inherits"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"base"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">            "hidden"</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">false</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">            "description"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"Debug configuration - Linux"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">            "cacheVariables"</span><span style="color:#E1E4E8">: &#123;</span></span>
<span class="line"><span style="color:#79B8FF">                "CMAKE_BUILD_TYPE"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"Debug"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">                "CMAKE_VERBOSE_MAKEFILE"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"ON"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">                "VCPKG_TARGET_TRIPLET"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"x64-linux"</span></span>
<span class="line"><span style="color:#E1E4E8">            &#125;</span></span>
<span class="line"><span style="color:#E1E4E8">        &#125;</span></span>
<span class="line"><span style="color:#E1E4E8">    ]</span></span>
<span class="line"><span style="color:#E1E4E8">&#125;</span></span></code></pre></div> <!> <p>Place the <code>CMakePresets.json</code> inside your root project folder</p> <h3 id="cmakeliststxt">CMakeLists.txt</h3> <p>In the heart of every CMake project is a file in project root called <code>CMakeLists.txt</code> which contains the instructions on how to build your project. I could make a whole guide just for working with CMake but for the sake of simplicity I will provide a template with comments so it makes sense</p> <div class="code-wrapper"><div class="code-label">cmake</div><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">cmake_minimum_required</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">VERSION</span><span style="color:#E1E4E8"> 3.10)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Setting up our compiler to always use the same standard and tools</span></span>
<span class="line"><span style="color:#F97583">set</span><span style="color:#E1E4E8">(CMAKE_CXX_STANDARD 20)</span></span>
<span class="line"><span style="color:#F97583">set</span><span style="color:#E1E4E8">(CMAKE_CXX_STANDARD_REQUIRED </span><span style="color:#F97583">ON</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">set</span><span style="color:#E1E4E8">(CMAKE_CXX_EXTENSIONS </span><span style="color:#F97583">OFF</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Setting up VCPKG</span></span>
<span class="line"><span style="color:#F97583">if</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">DEFINED</span><span style="color:#E1E4E8"> ENV&#123;VCPKG_ROOT&#125; </span><span style="color:#F97583">AND</span><span style="color:#F97583"> NOT</span><span style="color:#F97583"> DEFINED</span><span style="color:#E1E4E8"> CMAKE_TOOLCHAIN_FILE)</span></span>
<span class="line"><span style="color:#F97583">  set</span><span style="color:#E1E4E8">(CMAKE_TOOLCHAIN_FILE </span><span style="color:#9ECBFF">"$ENV&#123;VCPKG_ROOT&#125;/scripts/buildsystems/vcpkg.cmake"</span><span style="color:#F97583"> CACHE</span><span style="color:#F97583"> STRING</span><span style="color:#9ECBFF"> ""</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">endif</span><span style="color:#E1E4E8">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">if</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">NOT</span><span style="color:#F97583"> DEFINED</span><span style="color:#E1E4E8"> CMAKE_TOOLCHAIN_FILE)</span></span>
<span class="line"><span style="color:#F97583">  message</span><span style="color:#E1E4E8">(FATAL_ERROR </span><span style="color:#9ECBFF">"CMAKE_TOOLCHAIN_FILE is not defined. Make sure you specify it with -DCMAKE_TOOLCHAIN_FILE or set it as environment variable"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">endif</span><span style="color:#E1E4E8">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Create our project</span></span>
<span class="line"><span style="color:#F97583">project</span><span style="color:#E1E4E8">(MyProject LANGUAGES C CXX)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># We can use these messages to quickly verify we are using the correct tools</span></span>
<span class="line"><span style="color:#F97583">message</span><span style="color:#E1E4E8">(STATUS </span><span style="color:#9ECBFF">"triplet: $&#123;VCPKG_TARGET_TRIPLET&#125;"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">message</span><span style="color:#E1E4E8">(STATUS </span><span style="color:#9ECBFF">"Using generator: $&#123;CMAKE_GENERATOR&#125;"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">message</span><span style="color:#E1E4E8">(STATUS </span><span style="color:#9ECBFF">"Using VCPKG toolchain file: $&#123;CMAKE_TOOLCHAIN_FILE&#125;"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">message</span><span style="color:#E1E4E8">(STATUS </span><span style="color:#9ECBFF">"Preset build type: $&#123;CMAKE_BUILD_TYPE&#125;"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Add GLAD to our project</span></span>
<span class="line"><span style="color:#F97583">add_library</span><span style="color:#E1E4E8">(glad STATIC</span></span>
<span class="line"><span style="color:#E1E4E8">    external/glad/src/glad.c</span></span>
<span class="line"><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">target_include_directories</span><span style="color:#E1E4E8">(</span></span>
<span class="line"><span style="color:#E1E4E8">  glad</span></span>
<span class="line"><span style="color:#B392F0">  PUBLIC</span></span>
<span class="line"><span style="color:#E1E4E8">  external/glad/include</span></span>
<span class="line"><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Add everything inside /source/ to our project</span></span>
<span class="line"><span style="color:#F97583">file</span><span style="color:#E1E4E8">(GLOB_RECURSE PROJECT_SOURCES CONFIGURE_DEPENDS </span><span style="color:#9ECBFF">"$&#123;CMAKE_CURRENT_SOURCE_DIR&#125;/source/*.cpp"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Create the executable</span></span>
<span class="line"><span style="color:#F97583">add_executable</span><span style="color:#E1E4E8">(MyProject</span></span>
<span class="line"><span style="color:#F97583">    $&#123;PROJECT_SOURCES&#125;</span></span>
<span class="line"><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Add the ability to use multiple header files and include them using #include "name.h"</span></span>
<span class="line"><span style="color:#F97583">target_include_directories</span><span style="color:#E1E4E8">(MyProject</span></span>
<span class="line"><span style="color:#B392F0">    PRIVATE</span></span>
<span class="line"><span style="color:#F97583">    $&#123;CMAKE_CURRENT_LIST_DIR&#125;</span><span style="color:#E1E4E8">/source</span></span>
<span class="line"><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># force VCPKG to find the following packages</span></span>
<span class="line"><span style="color:#F97583">find_package</span><span style="color:#E1E4E8">(glm CONFIG REQUIRED)</span></span>
<span class="line"><span style="color:#F97583">find_package</span><span style="color:#E1E4E8">(OpenGL REQUIRED)</span></span>
<span class="line"><span style="color:#F97583">find_package</span><span style="color:#E1E4E8">(glfw3 CONFIG REQUIRED)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D"># Put packages into our project</span></span>
<span class="line"><span style="color:#F97583">target_link_libraries</span><span style="color:#E1E4E8">(MyProject</span></span>
<span class="line"><span style="color:#B392F0">  PRIVATE</span></span>
<span class="line"><span style="color:#E1E4E8">    glad</span></span>
<span class="line"><span style="color:#E1E4E8">    glm::glm</span></span>
<span class="line"><span style="color:#E1E4E8">    glfw</span></span>
<span class="line"><span style="color:#E1E4E8">    OpenGL::GL</span></span>
<span class="line"><span style="color:#E1E4E8">)</span></span></code></pre></div> <p>later on you will need to copy some assets from your project to your build folder. This can be done by appending the following at the end of your CMakeLists.txt</p> <div class="code-wrapper"><div class="code-label">cmake</div><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">set</span><span style="color:#E1E4E8">(SHADERS_FOLDER </span><span style="color:#9ECBFF">"$&#123;CMAKE_SOURCE_DIR&#125;/Shaders"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">add_custom_target</span><span style="color:#E1E4E8">(copy_assets ALL</span></span>
<span class="line"><span style="color:#F97583">  COMMAND</span><span style="color:#F97583"> $&#123;CMAKE_COMMAND&#125;</span><span style="color:#E1E4E8"> -E rm -rf </span><span style="color:#F97583">$&#123;CMAKE_BINARY_DIR&#125;</span><span style="color:#E1E4E8">/Shaders</span></span>
<span class="line"><span style="color:#F97583">  COMMAND</span><span style="color:#F97583"> $&#123;CMAKE_COMMAND&#125;</span><span style="color:#E1E4E8"> -E copy_directory </span><span style="color:#F97583">$&#123;SHADERS_FOLDER&#125;</span><span style="color:#F97583"> $&#123;CMAKE_BINARY_DIR&#125;</span><span style="color:#E1E4E8">/Shaders</span></span>
<span class="line"><span style="color:#E1E4E8">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">add_dependencies</span><span style="color:#E1E4E8">(MyProject copy_assets)</span></span></code></pre></div> <h2 id="hello-world">Hello World!</h2> <p>After all this setup we have a project ready to render OpenGL on Windows or Linux. Last thing we need to do is to create our main function and compile it</p> <p>In our <code>source/</code> folder we create <code>main.cpp</code> which can for now look like the following</p> <div class="code-wrapper"><div class="code-label">cpp</div><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">#include</span><span style="color:#9ECBFF"> &#x3C;iostream></span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">int</span><span style="color:#B392F0"> main</span><span style="color:#E1E4E8">(</span><span style="color:#F97583">int</span><span style="color:#FFAB70"> argc</span><span style="color:#E1E4E8">, </span><span style="color:#F97583">char*</span><span style="color:#FFAB70"> argv</span><span style="color:#E1E4E8">[]) &#123;</span></span>
<span class="line"><span style="color:#B392F0">    std</span><span style="color:#E1E4E8">::cout </span><span style="color:#F97583">&#x3C;&#x3C;</span><span style="color:#9ECBFF"> "Hello, world!"</span><span style="color:#F97583"> &#x3C;&#x3C;</span><span style="color:#B392F0"> std</span><span style="color:#E1E4E8">::endl;</span></span>
<span class="line"><span style="color:#F97583">    return</span><span style="color:#E1E4E8"> EXIT_SUCCESS;</span></span>
<span class="line"><span style="color:#E1E4E8">&#125;</span></span></code></pre></div> <p>Remember to run all the following commands inside the project root folder</p> <p>Then we need to tell CMake what preset we are gonna be using with</p> <div class="code-wrapper"><div class="code-label">bash</div><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#6A737D"># instead of release-windows you can use any preset</span></span>
<span class="line"><span style="color:#B392F0">cmake</span><span style="color:#79B8FF"> -S</span><span style="color:#9ECBFF"> .</span><span style="color:#79B8FF"> --preset</span><span style="color:#9ECBFF"> release-windows</span></span></code></pre></div> <!> <p>And as the last command you just need to run</p> <div class="code-wrapper"><div class="code-label">bash</div><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#B392F0">cmake</span><span style="color:#79B8FF"> --build</span><span style="color:#9ECBFF"> build</span></span></code></pre></div> <p>Now in your generated <code>build/</code> directory you will see an executable called <code>MyProject.exe</code> or <code>MyProject</code>. Running it from inside the build folder will run your project</p> <!>`,1);function k(y){var t=C(),r=e(F(t),2);c(r,{children:(s,o)=>{l();var a=p("on Linux you may have some issues if using wayland/X11 as it does not like the default glfw library. You would have to modify the CMakeLists.txt a bit for it to work");n(s,a)}});var E=e(r,56);u(E,{children:(s,o)=>{l();var a=p("this example expects you to have a mingw compiler installed on windows!");n(s,a)}});var i=e(E,28);c(i,{children:(s,o)=>{l();var a=p('If you have not set VCPKG as your environment variable you will also need to add an argument like `-DCMAKE_TOOLCHAIN_FILE="/PATH/TO/VCPKG/CMAKE/vcpkg.cmake"`');n(s,a)}});var d=e(i,8);c(d,{children:(s,o)=>{l();var a=p("Editors like VS Code have packages that can manage commands like building and selecting a preset or execution of code for you");n(s,a)}}),n(y,t)}export{k as component};
