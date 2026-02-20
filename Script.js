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

document.addEventListener("DOMContentLoaded", () => PixelBG.init());
