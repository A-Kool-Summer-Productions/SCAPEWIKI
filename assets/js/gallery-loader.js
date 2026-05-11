class GalleryLoader {
    static async init(gridSelector, section) {
        const grid = document.querySelector(gridSelector);
        if (!grid) return;

        let manifest;
        try {
            const res = await fetch(`assets/data/gallery-manifest.json`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            manifest = await res.json();
        } catch (err) {
            console.error('Failed to load gallery manifest:', err);
            return;
        }

        const images = manifest[section];
        if (!images || !images.length) return;

        images.forEach(filename => {
            const name = filename.replace(/\.[^.]+$/, '');
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
                <img src="assets/images/${section}/${filename}" alt="${name}">
                <div class="gallery-caption">${name}</div>
            `;
            item.addEventListener('click', () => GalleryLoader.openLightbox(item));
            grid.appendChild(item);
        });
    }

    static openLightbox(item) {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption');
        document.getElementById('lightbox-img').src = img.src;
        document.getElementById('lightbox-img').alt = img.alt;
        document.getElementById('lightbox-caption').textContent = caption.textContent;
        document.getElementById('lightbox').classList.add('active');
    }

    static closeLightbox() {
        document.getElementById('lightbox').classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await GalleryLoader.init('#concept-art .gallery-grid', 'ConceptArt');

    document.getElementById('lightbox')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget || e.target.id === 'lightbox-img') {
            GalleryLoader.closeLightbox();
        }
    });

    document.querySelector('.lightbox-close')?.addEventListener('click', () => {
        GalleryLoader.closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') GalleryLoader.closeLightbox();
    });
});
