(function () {
    const layers = Array.from(document.querySelectorAll('.parallax__layer'));
    if (!layers.length) return;

    let ticking = false;

    // Начальные параметры из data-атрибутов
    const conf = layers.map(el => {
        const speed = parseFloat(el.dataset.speed || '0.3'); // множитель скорости по оси Y
        const z = parseFloat(el.dataset.z || '0');           // «глубина» в px (отрицательная — дальше)
        // Масштаб под компенсацию перспективы, чтобы не появлялись края при translateZ
        const scale = 1 + Math.abs(z) / 1000;
        return { el, speed, z, scale };
    });

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    }

    function update() {
        const y = window.pageYOffset || document.documentElement.scrollTop || 0;

        // Смещение каждого слоя. translate3d — для GPU-акселерации.
        for (const { el, speed, z, scale } of conf) {
            const offsetY = Math.round(y * speed);
            el.style.transform = `translate3d(0, ${offsetY}px, ${z}px) scale(${scale})`;
        }

        ticking = false;
    }

    // Стартовое положение
    update();

    // Подписки
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Опционально: лёгкий наклон по движению мыши для «3D-ощущения»
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    window.addEventListener('mousemove', (e) => {
        const rx = ((e.clientY - cy) / cy) * -2; // угол X
        const ry = ((e.clientX - cx) / cx) * 2;  // угол Y
        document.querySelector('.parallax').style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
})();
