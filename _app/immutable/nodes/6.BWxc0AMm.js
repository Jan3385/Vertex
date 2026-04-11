import"../chunks/DsnmJJEf.js";import{m as p,f as t,g as a,j as r,n as c,x as i}from"../chunks/BcfqlZqL.js";import{W as y}from"../chunks/K0r7yi7G.js";var E=r(`<h1 id="linux-cmakeliststxt">Linux CMakeLists.txt</h1> <p>On Linux there are multiple types of window protocols. We need to provide our GLFW the libraries that are needed to run on our specific window protocol</p> <p>To do that we need to check if our system has wayland or X11 installed and if so, fetch their libraries. This can be done by inserting the following example after <code>add_executable(MyProject ...)</code> and before <code>target_link_libraries(MyProject ...)</code></p> <pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#6A737D"># Only run this code on Linux</span></span>
<span class="line"><span style="color:#F97583">if</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">UNIX</span><span style="color:#F97583"> AND</span><span style="color:#F97583"> NOT</span><span style="color:#79B8FF"> APPLE</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#6A737D">    # Try to find Wayland and X11</span></span>
<span class="line"><span style="color:#F97583">    find_package</span><span style="color:#E1E4E8">(PkgConfig REQUIRED)</span></span>
<span class="line"><span style="color:#E1E4E8">    pkg_check_modules(WAYLAND wayland-client wayland-egl)</span></span>
<span class="line"><span style="color:#F97583">    find_package</span><span style="color:#E1E4E8">(X11)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    # Link Wayland if found</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8">(WAYLAND_FOUND)</span></span>
<span class="line"><span style="color:#F97583">        target_include_directories</span><span style="color:#E1E4E8">(MyProject </span><span style="color:#B392F0">PRIVATE</span><span style="color:#F97583"> $&#123;WAYLAND_INCLUDE_DIRS&#125;</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">        target_link_libraries</span><span style="color:#E1E4E8">(MyProject </span><span style="color:#B392F0">PRIVATE</span><span style="color:#F97583"> $&#123;WAYLAND_LIBRARIES&#125;</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">    endif</span><span style="color:#E1E4E8">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">    # Link X11 if found</span></span>
<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8">(X11_FOUND)</span></span>
<span class="line"><span style="color:#F97583">        target_link_libraries</span><span style="color:#E1E4E8">(MyProject </span><span style="color:#B392F0">PRIVATE</span><span style="color:#F97583"> $&#123;X11_LIBRARIES&#125;</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#F97583">    endif</span><span style="color:#E1E4E8">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">    target_link_libraries</span><span style="color:#E1E4E8">(MyProject </span><span style="color:#B392F0">PRIVATE</span><span style="color:#E1E4E8"> dl pthread)</span></span>
<span class="line"><span style="color:#F97583">endif</span><span style="color:#E1E4E8">()</span></span></code></pre> <!>`,1);function u(n){var s=E(),l=p(t(s),8);y(l,{children:(e,d)=>{c();var o=i("This will make the executable run on your specific system. To ensure that it runs on any Linux desktop instance you need to have both X11 and Wayland packages");a(e,o)}}),a(n,s)}export{u as component};
