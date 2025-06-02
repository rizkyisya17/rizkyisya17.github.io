gsap.registerPlugin(ScrollTrigger);

// 1) Sélection des éléments
const sections = document.querySelectorAll(".story-section");
const progressBar = document.querySelector(".progress-bar-fill");
const steps = document.querySelectorAll(".progress-step");

// 2) Position de départ : opacity:0, hors champ pour chaque textBlock et imageBlock
sections.forEach((section) => {
	const textBlock = section.querySelector(".text-block");
	const imageBlock = section.querySelector(".image-block");
	gsap.set(textBlock, { opacity: 0, y: 30 });
	gsap.set(imageBlock, { opacity: 0, x: 30 });
});

// 3) Fonction de mise à jour de la progress bar + steps
function updateProgress(index, progress) {
	// Calcul : on peut moduler selon le nombre de sections
	const progressWidth = (index + progress) * (100 / (sections.length - 1));
	progressBar.style.width = `${progressWidth}%`;

	steps.forEach((step, i) => {
		if (i <= index) {
			step.classList.add("active");
		} else {
			step.classList.remove("active");
		}
	});
}

// 4) Animation de chaque section
sections.forEach((section, index) => {
	const textBlock = section.querySelector(".text-block");
	const imageBlock = section.querySelector(".image-block");

	// Pour la première section, on la joue immédiatement
	if (index === 0) {
		gsap
			.timeline()
			.to(section, {
				// Optionnel si on veut animer le conteneur
				opacity: 1,
				duration: 0.5,
				ease: "power2.out"
			})
			.to(
				textBlock,
				{
					opacity: 1,
					y: 0,
					duration: 0.5,
					ease: "power2.out"
				},
				"-=0.3"
			)
			.to(
				imageBlock,
				{
					opacity: 1,
					x: 0,
					duration: 0.5,
					ease: "power2.out"
				},
				"-=0.3"
			);

		// Les suivantes, via ScrollTrigger
	} else {
		gsap
			.timeline({
				scrollTrigger: {
					trigger: section,
					start: "top 60%",
					end: "bottom 40%",
					toggleActions: "play reverse play reverse"
					// ou "play none none none" si tu ne veux pas de reverse
				}
			})
			.fromTo(
				section,
				{ opacity: 0 },
				{
					opacity: 1,
					duration: 0.5,
					ease: "power2.out"
				}
			)
			.fromTo(
				textBlock,
				{ opacity: 0, y: 30 },
				{
					opacity: 1,
					y: 0,
					duration: 0.5,
					ease: "power2.out"
				},
				"-=0.3"
			)
			.fromTo(
				imageBlock,
				{ opacity: 0, x: 30 },
				{
					opacity: 1,
					x: 0,
					duration: 0.5,
					ease: "power2.out"
				},
				"-=0.3"
			);
	}
});

// 5) Gestion du scroll global (pour la progress bar)
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

	// Sauvegarder la position pendant le défilement
	saveScrollPosition();
});

// 6) Boutons "suivant" (pour défiler aux sections suivantes)
document.querySelectorAll(".next-section-btn").forEach((btn, index) => {
	btn.addEventListener("click", () => {
		if (index < sections.length - 1) {
			sections[index + 1].scrollIntoView({ behavior: "smooth" });
		}
	});
});

// 7) Gestion des thèmes / background
function applyTheme(sectionIndex) {
	const body = document.body;
	if (sectionIndex === 0) {
		body.classList.add("light-theme");
		body.classList.remove("dark-theme", "sunset-theme");
	} else if (sectionIndex === 1) {
		body.classList.add("sunset-theme");
		body.classList.remove("light-theme", "dark-theme");
	} else if (sectionIndex === 2) {
		body.classList.add("dark-theme");
		body.classList.remove("light-theme", "sunset-theme");
	}
}

document.addEventListener("DOMContentLoaded", function () {
	applyTheme(0);
});

sections.forEach((section, index) => {
	ScrollTrigger.create({
		trigger: section,
		start: "top center",
		end: "bottom center",
		onEnter: () => applyTheme(index),
		onEnterBack: () => applyTheme(index)
	});
});

// 8) Progress steps (click) => navigation + thème
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

// 9) Modal (zoom image)
const modalOverlay = document.querySelector(".modal-overlay");
const modalImage = document.querySelector(".modal-image");
const modalClose = document.querySelector(".modal-close");

document.querySelectorAll(".image-placeholder").forEach((img) => {
	img.addEventListener("click", () => {
		modalImage.src = img.src;
		modalOverlay.style.display = "flex";
		gsap
			.timeline()
			.to(modalOverlay, {
				opacity: 1,
				duration: 0.3,
				ease: "power2.out"
			})
			.to(
				modalImage,
				{
					scale: 1,
					opacity: 1,
					duration: 0.5,
					ease: "back.out(1.7)"
				},
				"-=0.1"
			)
			.to(
				modalClose,
				{
					opacity: 1,
					rotation: 0,
					duration: 0.3,
					ease: "power2.out"
				},
				"-=0.3"
			);
	});
});

function closeModal() {
	gsap
		.timeline()
		.to(modalClose, {
			opacity: 0,
			rotation: -180,
			duration: 0.3,
			ease: "power2.in"
		})
		.to(
			modalImage,
			{
				scale: 0.8,
				opacity: 0,
				duration: 0.3,
				ease: "power2.in"
			},
			"-=0.2"
		)
		.to(
			modalOverlay,
			{
				opacity: 0,
				duration: 0.3,
				ease: "power2.in",
				onComplete: () => {
					modalOverlay.style.display = "none";
				}
			},
			"-=0.2"
		);
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
	if (e.target === modalOverlay) {
		closeModal();
	}
});

// 10) Sauvegarde / restauration de la position de scroll
function saveScrollPosition() {
	localStorage.setItem("scrollPosition", window.scrollY);
	const currentSection = Math.floor(
		(window.scrollY /
			(document.documentElement.scrollHeight - window.innerHeight)) *
			sections.length
	);
	localStorage.setItem("currentSection", currentSection);
}

function restoreScrollPosition() {
	const savedPosition = localStorage.getItem("scrollPosition");
	const savedSection = localStorage.getItem("currentSection");
	if (savedPosition !== null) {
		window.scrollTo(0, parseInt(savedPosition));
		if (savedSection !== null) {
			applyTheme(parseInt(savedSection));
		}
	}
}

// Sauvegarder la position avant rechargement
window.addEventListener("beforeunload", saveScrollPosition);

// Restaurer la position après chargement
document.addEventListener("DOMContentLoaded", function () {
	restoreScrollPosition();

	// Mise à jour initiale de la barre de progression
	const docHeight = document.documentElement.scrollHeight - window.innerHeight;
	const scrollPercentage = (window.scrollY / docHeight) * 100;
	const progressWidth = Math.min(100, Math.max(0, scrollPercentage));
	progressBar.style.width = `${progressWidth}%`;

	// Mise à jour des boutons actifs
	const currentSection = Math.floor(scrollPercentage / (100 / sections.length));
	steps.forEach((step, i) => {
		if (i <= currentSection) {
			step.classList.add("active");
		} else {
			step.classList.remove("active");
		}
	});
});
