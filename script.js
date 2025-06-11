// Variables global
let audioInitialized = false;
let sections, progressBar, steps;

// Splash screen functionality
document.addEventListener("DOMContentLoaded", function () {
    // Name validation first
    const nameMapping = {
        'bobby': 'Bobby',
        'nvidia_employee': 'Nvidia Employee',
        'john_doe': 'John Doe',
        'admin': 'Administrator',
        'denis': 'Denistya Amalia'
    };

    const urlParams = new URLSearchParams(window.location.search);
    const rawName = urlParams.get('name');
    
    // Check if name is valid
    if (!rawName || !nameMapping.hasOwnProperty(rawName)) {
        // Tampilkan pesan error yang informatif
        document.body.innerHTML = `
            <div style="
                display: flex; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                font-family: Arial, sans-serif;
                background: white;
                color: #333;
                margin: 0;
                padding: 20px;
                box-sizing: border-box;
            ">
                <div style="
                    text-align: center;
                    background: #f8f9fa;
                    padding: 40px;
                    border-radius: 15px;
                    border: 1px solid #e0e0e0;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                ">
                    <h1 style="font-size: 2.5em; margin-bottom: 20px; color: #dc3545;">🚫 Access Denied</h1>
                    <p style="font-size: 1.2em; margin-bottom: 10px; color: #666;">Invalid or missing invitation code</p>
                    <p style="font-size: 1.2em; opacity: 0.7; color: #666;">Gausah diganti-ganti ya query nya</p>
                </div>
            </div>
        `;
        document.body.style.margin = '0';
        window.history.replaceState({}, '', window.location.pathname);
        return; // Stop execution here
    }

    // If we get here, name is valid - continue with normal functionality
    const splashScreen = document.getElementById("splash-screen");
    const mainContent = document.getElementById("main-content");
    const openBtn = document.getElementById("open-invitation-btn");
    const audio = document.getElementById("background-audio");
    const muteBtn = document.getElementById("mute-btn");
    const invitationTitle = document.querySelector('.invitation-title');

    // Set the validated name
    const validName = nameMapping[rawName];
    invitationTitle.textContent = `Dear ${validName}`;
    
    // Update section title
    const h2Element = document.querySelector('#section1 h2');
    // if (h2Element) {
    //     h2Element.innerHTML = `The Beginning of the Adventure ${validName}`;
    // }

    // Open invitation and start audio
    openBtn.addEventListener("click", function() {
        // Start audio when user clicks (user interaction allows autoplay)
        audio.play().then(() => {
            audioInitialized = true;
        }).catch(e => {
            console.warn("Audio autoplay failed:", e);
        });

        // Hide splash and show main content
        splashScreen.classList.add("hidden");
        setTimeout(() => {
            splashScreen.style.display = "none";
            mainContent.classList.add("visible");
            initializeStoryAnimations();
        }, 500);
    });

    // Audio controls
    muteBtn.addEventListener("click", () => {
        if (!audioInitialized) {
            audio.play().then(() => {
                audioInitialized = true;
            }).catch(e => console.warn("Play error:", e));
        }
        audio.muted = !audio.muted;
        muteBtn.textContent = audio.muted ? "🔇" : "🔊";
    });
});

// Initialize story animations after splash
function initializeStoryAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Get elements
    sections = document.querySelectorAll(".story-section");
    progressBar = document.querySelector(".progress-bar-fill");
    steps = document.querySelectorAll(".progress-step");

    if (!sections.length || !progressBar || !steps.length) {
        console.error("Required elements not found");
        return;
    }

    // Set initial states
    sections.forEach((section) => {
        const textBlock = section.querySelector(".text-block");
        const imageBlock = section.querySelector(".image-block");
        gsap.set(textBlock, { opacity: 0, y: 30 });
        gsap.set(imageBlock, { opacity: 0, x: 30 });
    });

    // Animate sections
    sections.forEach((section, index) => {
        const textBlock = section.querySelector(".text-block");
        const imageBlock = section.querySelector(".image-block");

        if (index === 0) {
            // First section animates immediately
            gsap.timeline()
                .to(textBlock, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out"
                })
                .to(imageBlock, {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    ease: "power2.out"
                }, "-=0.3");
        } else {
            // Other sections animate on scroll
            gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 60%",
                    end: "bottom 40%",
                    toggleActions: "play reverse play reverse"
                }
            })
            .fromTo(textBlock, 
                { opacity: 0, y: 30 }, 
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            )
            .fromTo(imageBlock, 
                { opacity: 0, x: 30 }, 
                { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, 
                "-=0.3"
            );
        }
    });

    // Progress bar and theme handling
    setupProgressAndThemes();
    setupModal();
}

function setupProgressAndThemes() {
    // Scroll progress
    window.addEventListener("scroll", () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (window.scrollY / docHeight) * 100;
        const progressWidth = Math.min(100, Math.max(0, scrollPercentage));
        progressBar.style.width = `${progressWidth}%`;

        const currentSection = Math.floor(scrollPercentage / (100 / sections.length));
        steps.forEach((step, i) => {
            if (i <= currentSection) {
                step.classList.add("active");
            } else {
                step.classList.remove("active");
            }
        });
    });

    // Next section buttons
    document.querySelectorAll(".next-section-btn").forEach((btn, index) => {
        btn.addEventListener("click", () => {
            if (index < sections.length - 1) {
                sections[index + 1].scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // Theme application
    function applyTheme(sectionIndex) {
        const body = document.body;
        if (sectionIndex === 0) {
            body.className = "dark-theme";
        } else if (sectionIndex === 1) {
            body.className = "dark-theme";
        } else if (sectionIndex === 2) {
            body.className = "dark-theme";
        }
    }

    // Theme triggers
    sections.forEach((section, index) => {
        ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onEnter: () => applyTheme(index),
            onEnterBack: () => applyTheme(index)
        });
    });

    // Progress step clicks
    steps.forEach((step, index) => {
        step.addEventListener("click", () => {
            sections[index].scrollIntoView({ behavior: "smooth" });
            applyTheme(index);
            steps.forEach((s, i) => {
                if (i <= index) s.classList.add("active");
                else s.classList.remove("active");
            });
        });
    });
}

function setupModal() {
    const modalOverlay = document.querySelector(".modal-overlay");
    const modalImage = document.querySelector(".modal-image");
    const modalClose = document.querySelector(".modal-close");

    document.querySelectorAll(".image-placeholder").forEach((img) => {
        img.addEventListener("click", () => {
            modalImage.src = img.src;
            modalOverlay.style.display = "flex";
            gsap.timeline()
                .to(modalOverlay, { opacity: 1, duration: 0.3, ease: "power2.out" })
                .to(modalImage, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }, "-=0.1")
                .to(modalClose, { opacity: 1, rotation: 0, duration: 0.3, ease: "power2.out" }, "-=0.3");
        });
    });

    function closeModal() {
        gsap.timeline()
            .to(modalClose, { opacity: 0, rotation: -180, duration: 0.3, ease: "power2.in" })
            .to(modalImage, { scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in" }, "-=0.2")
            .to(modalOverlay, { 
                opacity: 0, 
                duration: 0.3, 
                ease: "power2.in",
                onComplete: () => modalOverlay.style.display = "none"
            }, "-=0.2");
    }

    modalClose.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}