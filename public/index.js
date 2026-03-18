/* ---
  "Magic Slider" JavaScript for StayLY
  This controls the WebGL background, animations, and pagination.
--- */
document.addEventListener("DOMContentLoaded", () => {
  // Check if all necessary components exist
  if (
    !document.getElementById("demo") ||
    !document.querySelector(".details-container") ||
    !document.querySelector(".image-container")
  ) {
    console.error("Slider components not found. Aborting.");
    return;
  }
  
  // --- WebGL Background Effect ---
  let scene, camera, renderer, plane, material;
  let mouse = new THREE.Vector2();
  let targetMouse = new THREE.Vector2();
  const textures = [];

  // Load all images from the hidden <img> tags
  const imageElements = document.querySelectorAll(".image-container img");
  if (imageElements.length === 0) {
    console.error("No images found for the slider.");
    return; // Exit if no images
  }
  
  const loader = new THREE.TextureLoader();
  imageElements.forEach((img, i) => {
    textures[i] = loader.load(img.src);
  });

  function initWebGL() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("demo").appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(8, 5); // Aspect ratio
    material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        texture1: { value: textures[0] },
        texture2: { value: textures[1] || textures[0] },
        progress: { value: 0 },
        mouse: { value: new THREE.Vector2(0.0, 0.0) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D texture1;
        uniform sampler2D texture2;
        uniform float progress;
        uniform vec2 mouse;

        void main() {
          vec2 uv = vUv;
          
          // Mouse distortion
          float dist = distance(uv, mouse);
          uv.x += (mouse.x - uv.x) * (0.1 / (dist + 0.1));
          uv.y += (mouse.y - uv.y) * (0.1 / (dist + 0.1));

          vec4 tex1 = texture2D(texture1, uv);
          vec4 tex2 = texture2D(texture2, uv);
          
          // Cross-fade transition
          gl_FragColor = mix(tex1, tex2, smoothstep(0.0, 1.0, progress));
        }
      `,
    });

    plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    animate();
  }

  function animate() {
    requestAnimationFrame(animate);
    
    // Smoothly update mouse position
    mouse.x += (targetMouse.x - mouse.x) * 0.05;
    mouse.y += (targetMouse.y - mouse.y) * 0.05;
    material.uniforms.mouse.value = mouse;
    
    renderer.render(scene, camera);
  }

  window.addEventListener("mousemove", (e) => {
    targetMouse.x = e.clientX / window.innerWidth;
    targetMouse.y = 1.0 - e.clientY / window.innerHeight;
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  initWebGL();
  
  // --- Slide Logic ---
  const slides = document.querySelectorAll(".details");
  const slideNumbers = document.getElementById("slide-numbers");
  const progressBar = document.querySelector(".progress-sub-foreground");
  const arrowLeft = document.querySelector(".arrow-left");
  const arrowRight = document.querySelector(".arrow-right");

  let currentSlide = 0;
  const totalSlides = slides.length;

  if (totalSlides === 0) return; // No slides, no logic

  function updateSlide(index, oldIndex) {
    if (index === oldIndex) return;

    // Remove active class from old slide
    if (slides[oldIndex]) {
      slides[oldIndex].classList.remove("active-slide");
    }

    // Add active class to new slide
    slides[index].classList.add("active-slide");

    // Update textures and transition progress
    material.uniforms.texture1.value = textures[oldIndex];
    material.uniforms.texture2.value = textures[index];

    // Animate the transition
    gsap.to(material.uniforms.progress, {
      duration: 1.2,
      value: 1,
      ease: "power3.inOut",
      onComplete: () => {
        material.uniforms.progress.value = 0;
        material.uniforms.texture1.value = textures[index]; // Set base texture
      },
    });

    // Update pagination
    slideNumbers.textContent = `${(index + 1)
      .toString()
      .padStart(2, "0")} / ${totalSlides.toString().padStart(2, "0")}`;
    progressBar.style.width = `${((index + 1) / totalSlides) * 100}%`;
  }

  // Go to next slide
  function nextSlide() {
    let oldSlide = currentSlide;
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlide(currentSlide, oldSlide);
  }

  // Go to previous slide
  function prevSlide() {
    let oldSlide = currentSlide;
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlide(currentSlide, oldSlide);
  }

  // Event Listeners
  arrowRight.addEventListener("click", nextSlide);
  arrowLeft.addEventListener("click", prevSlide);

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });

  // Initial setup
  updateSlide(0, 1); // Initialize first slide
  slides[0].classList.add("active-slide"); // Manually activate first slide
  
  // Need GSAP library for the animation
  // Let's create a simple fallback if GSAP isn't loaded
  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded. Using simple CSS transition.");
    // Fallback logic if you don't have GSAP
    material.uniforms.progress.value = 1;
  }
});