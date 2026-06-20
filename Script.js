const PixelBG = (() => {
    const CONFIG = {
        pixelSize: 28,
        gap: 2,
        burstMin: 2,
        burstMax: 7,
        intervalMs: 130,
        fadeOutMin: 500,
        fadeOutMax: 2000,
        // Warna disesuaikan dengan tema hitam-putih CSS kamu
        colors: ["#000000", "#222222", "#444444", "#888888", "#bbbbbb"],
        opacityMin: 0.05,
        opacityMax: 0.25,
    };

    let canvas,
        pixels = [];

    function randomColor() {
        return CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
    }

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function flashPixel() {
        if (!pixels.length) return;
        const px = pixels[Math.floor(Math.random() * pixels.length)];
        px.style.backgroundColor = randomColor();
        px.style.opacity = rand(CONFIG.opacityMin, CONFIG.opacityMax).toFixed(2);

        setTimeout(
            () => {
                px.style.opacity = "0";
            },
            rand(CONFIG.fadeOutMin, CONFIG.fadeOutMax),
        );
    }

    function tick() {
        const burst = Math.floor(rand(CONFIG.burstMin, CONFIG.burstMax));
        for (let i = 0; i < burst; i++) flashPixel();
    }

    function buildGrid() {
        const step = CONFIG.pixelSize + CONFIG.gap;
        const cols = Math.ceil(window.innerWidth / step);
        const rows = Math.ceil(window.innerHeight / step);

        canvas.style.gridTemplateColumns = `repeat(${cols}, ${CONFIG.pixelSize}px)`;
        canvas.style.gridTemplateRows = `repeat(${rows}, ${CONFIG.pixelSize}px)`;

        canvas.innerHTML = "";
        pixels = [];

        const fragment = document.createDocumentFragment();
        for (let i = 0; i < cols * rows; i++) {
            const el = document.createElement("div");
            el.classList.add("pixel");
            fragment.appendChild(el);
            pixels.push(el);
        }
        canvas.appendChild(fragment);
    }

    function init() {
        canvas = document.getElementById("pixel-canvas");
        if (!canvas) return;

        buildGrid();
        setInterval(tick, CONFIG.intervalMs);

        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(buildGrid, 200);
        });
    }

    return { init };
})();

document.addEventListener("DOMContentLoaded", () => {
    PixelBG.init();

    // Scroll-linked marquee
    const marquees = document.querySelectorAll('.marquee-content-img');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        marquees.forEach(marquee => {
            // Kita kalikan posisi scroll dengan faktor kecepatan (0.05)
            // vw unit dipakai agar responsif terhadap layar
            if (marquee.classList.contains('reverse')) {
                // Yang reverse mulai dari -200vw dan bergerak ke arah kanan
                marquee.style.transform = `translateX(${-200 + (scrollPosition * 0.05)}vw)`;
            } else {
                // Yang normal mulai dari 0 dan bergerak ke arah kiri
                marquee.style.transform = `translateX(${-scrollPosition * 0.05}vw)`;
            }
        });
    });

    // Scroll Reveal Animation for project cards
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target); // Hanya animasi sekali
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));
});
