const timelineElement = document.getElementById('timeline');

// --- НАСТРОЙКИ ТАЙМЛАЙНА ---
const pixelsPerYear = 1500; // Масштаб года
const startPadding = 200;  // Отступ слева
const minDistance = 200;   // Минимальное расстояние между точками

function getYearFraction(dateValue) {
    if (!dateValue) return 0;
    const strVal = String(dateValue);
    const parts = strVal.split('.');
    const year = parseInt(parts[0], 10);
    let month = 1;
    if (parts.length > 1) {
        month = parseInt(parts[1], 10);
    }
    month = Math.max(1, Math.min(month, 12));
    return year + (month - 1) / 12;
}

// --- СПИСОК ВСЕХ ЛОКАЛЬНЫХ ГОЛОВ ДЛЯ РАНДОМА ---
const fallbackHeads = [
    "images/heads/head1.webp", "images/heads/head2.webp", "images/heads/head3.webp",
    "images/heads/head4.webp", "images/heads/head5.webp", "images/heads/head6.webp",
    "images/heads/head7.webp", "images/heads/head8.webp", "images/heads/head9.webp",
    "images/heads/head10.webp", "images/heads/head11.webp", "images/heads/head12.webp",
    "images/heads/head13.webp", "images/heads/head14.webp", "images/heads/head15.webp",
    "images/heads/head16.webp", "images/heads/head17.webp", "images/heads/head18.webp",
    "images/heads/head19.webp", "images/heads/head20.webp", "images/heads/head21.webp",
    "images/heads/head22.webp", "images/heads/head23.webp", "images/heads/head24.webp",
    "images/heads/head25.webp", "images/heads/head26.webp", "images/heads/head27.webp",
    "images/heads/head28.webp", "images/heads/head29.webp", "images/heads/head30.webp",
    "images/heads/head31.webp", "images/heads/head32.webp", "images/heads/head33.webp",
    "images/heads/head34.webp", "images/heads/head35.webp", "images/heads/head36.webp",
    "images/heads/head37.webp", "images/heads/head38.webp", "images/heads/head39.webp",
    "images/heads/head40.webp", "images/heads/head41.webp", "images/heads/head42.webp",
    "images/heads/head43.webp", "images/heads/head44.webp", "images/heads/head45.webp",
    "images/heads/head46.webp", "images/heads/head47.webp", "images/heads/head48.webp",
    "images/heads/head49.webp", "images/heads/head50.webp", "images/heads/head51.webp",
    "images/heads/head52.webp", "images/heads/head53.webp", "images/heads/head54.webp",
    "images/heads/head55.webp", "images/heads/head56.webp", "images/heads/head57.webp",
    "images/heads/head58.webp", "images/heads/head59.webp", "images/heads/head60.webp",
    "images/heads/head61.webp", "images/heads/head62.webp", "images/heads/head63.webp",
    "images/heads/head64.webp", "images/heads/head65.webp", "images/heads/head66.webp",
    "images/heads/head67.webp", "images/heads/head68.webp", "images/heads/head69.webp",
    "images/heads/head70.webp"
];

function getRandomFallbackHead() {
    if (fallbackHeads.length === 0) return "";
    const randomIndex = Math.floor(Math.random() * fallbackHeads.length);
    return fallbackHeads[randomIndex];
}

// --- ОТРИСОВКА ТОЧЕК ТАЙМЛАЙНА ---
if (typeof seasons !== 'undefined' && seasons.length > 0) {
    const firstTimeVal = seasons[0].dateValue !== undefined ? getYearFraction(seasons[0].dateValue) : 2023;
    
    let previousLeft = -9999;
    let maxLeft = 0;

    timelineElement.style.position = 'relative';

    seasons.forEach((season) => {
        const node = document.createElement('div');
        node.className = 'season-node';
        
        const seasonVal = season.dateValue !== undefined ? getYearFraction(season.dateValue) : (firstTimeVal + 0.5);
        const timeOffset = seasonVal - firstTimeVal;
        
        let idealLeft = startPadding + (timeOffset * pixelsPerYear);
        let minAllowedLeft = previousLeft + minDistance;
        let finalLeft = Math.max(idealLeft, minAllowedLeft);
        
        node.style.position = 'absolute';
        node.style.left = `${finalLeft}px`;
        
        previousLeft = finalLeft;
        maxLeft = finalLeft;

        const hoverContainer = document.createElement('div');
        hoverContainer.className = 'hover-image-container';
        
        const hoverImg = document.createElement('img');
        hoverImg.style.cursor = 'pointer';
        hoverImg.title = "Нажмите, чтобы открыть сезон";

        if (season.randomImages && season.randomImages.length > 0) {
            hoverImg.src = season.randomImages[0];
        }

        hoverImg.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(season);
        });

        hoverContainer.appendChild(hoverImg);

        const dot = document.createElement('div');
        dot.className = 'dot';

        const dateLabel = document.createElement('div');
        dateLabel.className = 'date';
        dateLabel.innerHTML = `<strong>${season.title}</strong><br>${season.date}`;

        node.appendChild(hoverContainer);
        node.appendChild(dot);
        node.appendChild(dateLabel);

        node.addEventListener('mouseenter', () => {
            if (season.randomImages && season.randomImages.length > 0) {
                const randomPic = season.randomImages[Math.floor(Math.random() * season.randomImages.length)];
                hoverImg.src = randomPic;
            }
        });

        node.addEventListener('click', () => openModal(season));
        timelineElement.appendChild(node);
    });

    timelineElement.style.width = `${Math.max(maxLeft + 2000, window.innerWidth)}px`;
}

// --- ПРОКРУТКА КОЛЕСИКОМ МЫШИ ---
const scrollContainer = document.getElementById('scroll-container');

let targetScroll = 0;
let currentScroll = 0;
let isScrolling = false;

function smoothScrollLoop() {
    if (!scrollContainer) return;

    // Снижаем коэффициент с 0.22 до 0.08, чтобы перемещение стало более тягучим и мягким
    currentScroll += (targetScroll - currentScroll) * 0.08;
    scrollContainer.scrollLeft = currentScroll;

    if (typeof updateScrollIndicators === 'function') updateScrollIndicators();
    if (typeof updateProgressBar === 'function') updateProgressBar();

    if (Math.abs(targetScroll - currentScroll) < 0.5) {
        scrollContainer.scrollLeft = targetScroll;
        isScrolling = false;
    } else {
        requestAnimationFrame(smoothScrollLoop);
    }
}

if (scrollContainer) {
    scrollContainer.addEventListener('wheel', (evt) => {
        evt.preventDefault();

        if (!isScrolling) {
            currentScroll = scrollContainer.scrollLeft;
            targetScroll = currentScroll;
        }

        // Уменьшаем множитель с 1.5 до 0.9, чтобы за один скролл шкала не улетала слишком далеко
        targetScroll += evt.deltaY * 0.9;

        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

        if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(smoothScrollLoop);
        }
    }, { passive: false });
}

// --- ПЕРЕТАСКИВАНИЕ ТАЙМЛАЙНА МЫШЬЮ (DRAG-TO-SCROLL С ПЛАВНОСТЬЮ) ---
// --- ПЕРЕТАСКИВАНИЕ ТАЙМЛАЙНА МЫШЬЮ (DRAG-TO-SCROLL С ПЛАВНОСТЬЮ) ---
let isDown = false;
let startX;
let startDragScrollLeft; 

if (scrollContainer) {
    scrollContainer.addEventListener('mousedown', (e) => {
        // Блокируем перетаскивание при клике на ноду или вне хитбокса
        if (e.target.closest('.season-node')) return;
        if (!e.target.closest('.timeline-drag-area')) return;

        isDown = true;
        scrollContainer.classList.add('dragging');
        
        // Жесткая сцепка: останавливаем предыдущую инерцию, если схватили шкалу на ходу
        isScrolling = false;
        targetScroll = scrollContainer.scrollLeft;
        currentScroll = scrollContainer.scrollLeft;
        
        // Запоминаем стартовые точки
        startX = e.pageX - scrollContainer.offsetLeft;
        startDragScrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('mouseleave', () => {
        isDown = false;
        scrollContainer.classList.remove('dragging');
    });

    scrollContainer.addEventListener('mouseup', () => {
        isDown = false;
        scrollContainer.classList.remove('dragging');
    });

    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 1.5;
        
        // ВМЕСТО РЕЗКОГО СДВИГА ЗАДАЕМ ЦЕЛЬ ДЛЯ ПЛАВНОЙ АНИМАЦИИ
        targetScroll = startDragScrollLeft - walk;

        // Ограничиваем вылет за границы контейнера
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

        // Запускаем цикл плавного довода, если он не работает
        if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(smoothScrollLoop);
        }
    });
}

// --- КРАЕВЫЕ ИНДИКАТОРЫ ---
const indicatorLeft = document.getElementById('scroll-indicator-left');
const indicatorRight = document.getElementById('scroll-indicator-right');

function updateScrollIndicators() {
    if (!scrollContainer) return;
    const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    
    if (indicatorLeft) {
        if (scrollContainer.scrollLeft > 50) {
            indicatorLeft.classList.add('show');
        } else {
            indicatorLeft.classList.remove('show');
        }
    }

    if (indicatorRight) {
        if (scrollContainer.scrollLeft < maxScrollLeft - 50) {
            indicatorRight.classList.add('show');
        } else {
            indicatorRight.classList.remove('show');
        }
    }
}

if (scrollContainer) {
    scrollContainer.addEventListener('scroll', updateScrollIndicators);
    window.addEventListener('resize', updateScrollIndicators);
}

if (indicatorLeft && scrollContainer) {
    indicatorLeft.addEventListener('click', () => {
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
    });
}

if (indicatorRight && scrollContainer) {
    indicatorRight.addEventListener('click', () => {
        scrollContainer.scrollTo({ left: scrollContainer.scrollWidth, behavior: 'smooth' });
    });
}

// --- ЛАЙТБОКС С ЗУМОМ И ПЕРЕТАСКИВАНИЕМ ---
let scale = 1;
let pointX = 0;
let pointY = 0;
let panning = false;
let startXLightbox = 0;
let startYLightbox = 0;
let hasMoved = false;

function setTransform() {
    const lightboxImg = document.getElementById('lightbox-img');
    if (!lightboxImg) return;
    lightboxImg.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
}

function updateCursor() {
    const lightboxImg = document.getElementById('lightbox-img');
    if (!lightboxImg) return;
    if (scale > 1) {
        lightboxImg.style.cursor = panning ? 'grabbing' : 'grab';
    } else {
        lightboxImg.style.cursor = 'zoom-in';
    }
}

function openLightbox(imgSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (!lightbox || !lightboxImg) return;
    
    scale = 1;
    pointX = 0;
    pointY = 0;
    hasMoved = false;
    setTransform();
    updateCursor();
    
    lightboxImg.src = imgSrc;
    lightbox.style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    if (!lightbox || !lightboxImg) return;

    lightbox.addEventListener('click', (e) => {
        if (e.target.id === 'lightbox') {
            lightbox.style.display = 'none';
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            lightbox.style.display = 'none';
        }
    });

    lightboxImg.addEventListener('dragstart', (e) => e.preventDefault());

    lightboxImg.addEventListener('click', (e) => {
        e.stopPropagation();
        if (hasMoved) {
            hasMoved = false;
            return;
        }

        if (scale === 1) {
            scale = 2.5;
        } else {
            scale = 1;
            pointX = 0;
            pointY = 0;
        }
        setTransform();
        updateCursor();
    });

    lightboxImg.addEventListener('wheel', (e) => {
        e.preventDefault();
        const oldScale = scale;
        const delta = e.deltaY < 0 ? 1.15 : 0.85;
        const newScale = Math.max(1, Math.min(oldScale * delta, 10));
        
        if (newScale === 1) {
            scale = 1;
            pointX = 0;
            pointY = 0;
        } else {
            const mx = e.clientX - window.innerWidth / 2;
            const my = e.clientY - window.innerHeight / 2;
            pointX = mx - (mx - pointX) * (newScale / oldScale);
            pointY = my - (my - pointY) * (newScale / oldScale);
            scale = newScale;
        }
        setTransform();
        updateCursor();
    });

    lightboxImg.addEventListener('mousedown', (e) => {
        if (scale > 1) {
            e.preventDefault();
            panning = true;
            hasMoved = false;
            startXLightbox = e.clientX - pointX;
            startYLightbox = e.clientY - pointY;
            updateCursor();
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!panning) return;
        e.preventDefault();
        hasMoved = true;
        pointX = e.clientX - startXLightbox;
        pointY = e.clientY - startYLightbox;
        setTransform();
    });

    window.addEventListener('mouseup', () => {
        if (panning) {
            panning = false;
            updateCursor();
        }
    });
});

// --- ОТРИСОВКА БЛОКА ИГРОКОВ ---
function renderPlayersBlock(item, container) {
    const wrapper = document.createElement("div");
    wrapper.className = "players-container";

    if (item.title) {
        const title = document.createElement("h4");
        title.className = "players-title";
        title.innerText = item.title;
        wrapper.appendChild(title);
    }

    const grid = document.createElement("div");
    grid.className = "players-grid";

    item.list.forEach(playerName => {
        const card = document.createElement("div");
        card.className = "player-card";

        const img = document.createElement("img");
        img.className = "player-head";
        
        const nameSpan = document.createElement("span");
        nameSpan.className = "player-name";
        nameSpan.innerText = playerName;

        let playerInfo = typeof playersDatabase !== 'undefined' ? playersDatabase[playerName] : null;

        if (playerInfo) {
            img.src = playerInfo.head || getRandomFallbackHead();
            img.alt = playerName;

            if (playerInfo.altNames && Array.isArray(playerInfo.altNames) && playerInfo.altNames.length > 0) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => {
                    let availableNames = playerInfo.altNames.filter(n => n !== nameSpan.innerText);
                    if (availableNames.length === 0) availableNames = playerInfo.altNames; 
                    const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
                    nameSpan.innerText = randomName;
                });
            } else {
                card.style.cursor = 'default';
            }
        } else {
            img.src = `https://minotar.net/helm/${playerName}/32.png`;
            img.alt = playerName;
            card.style.cursor = 'default';

            img.onerror = function() {
                this.onerror = null; 
                this.src = getRandomFallbackHead();
            };
        }

        card.appendChild(img);
        card.appendChild(nameSpan);
        grid.appendChild(card);
    });

    wrapper.appendChild(grid);
    container.appendChild(wrapper);
}

// --- ЛОГИКА МОДАЛЬНОГО ОКНА ---
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('close-modal');

function openModal(season) {
    if (!modal) return;
    document.getElementById('modal-title').innerText = season.title;
    document.getElementById('modal-version').innerText = season.version || "";
    
    const downloadBtn = document.getElementById('modal-download');
    if (downloadBtn) {
        if (season.worldLink && season.worldLink.trim() !== "") {
            downloadBtn.href = season.worldLink;
            downloadBtn.innerText = "Скачать мир";
            downloadBtn.classList.remove('disabled');
            downloadBtn.setAttribute('target', '_blank');
            downloadBtn.style.display = "inline-block";
        } else {
            downloadBtn.href = "#";
            downloadBtn.innerText = "Сохранение мира не найдено";
            downloadBtn.classList.add('disabled');
            downloadBtn.removeAttribute('target');
            downloadBtn.style.display = "inline-block";
        }
    }

    const bodyContent = document.getElementById('modal-body-content');
    bodyContent.innerHTML = '';
    
    const usedImages = new Set();

    if (season.content) {
        season.content.forEach(item => {
            if (item.type === "text") {
                const p = document.createElement('p');
                p.style.lineHeight = "1.6";
                p.style.fontSize = "1.1rem";
                p.style.margin = "15px 0";
                p.innerText = item.value;
                bodyContent.appendChild(p);
            } else if (item.type === "image") {
                const imgContainer = document.createElement('div');
                imgContainer.style.margin = "20px 0";
                imgContainer.style.textAlign = "center";
                
                // Поддерживаем как одиночную картинку (item.url), так и массив картинок (item.urls)
                let imagesToDisplay = [];
                if (item.urls && Array.isArray(item.urls)) {
                    imagesToDisplay = item.urls;
                } else if (item.url) {
                    imagesToDisplay = [item.url];
                }

                // Создаем контейнер для размещения картинок
                const imagesWrapper = document.createElement('div');
                imagesWrapper.style.display = "flex";
                imagesWrapper.style.justifyContent = "center";
                imagesWrapper.style.gap = "10px";
                imagesWrapper.style.flexWrap = "wrap";

                imagesToDisplay.forEach(imgUrl => {
                    const img = document.createElement('img');
                    img.src = imgUrl;
                    
                    // ЕСЛИ КАРТИНОК БОЛЬШЕ ОДНОЙ - они будут вставать в 2 колонки.
                    // Если картинка одна - она просто не будет гигантской.
                    img.style.maxWidth = imagesToDisplay.length > 1 ? "calc(50% - 10px)" : "100%"; //
                    img.style.maxHeight = "280px"; // Уменьшили высоту, чтобы больше контента лезло на экран[cite: 3]
                    
                    img.style.borderRadius = "6px";
                    img.style.objectFit = "cover";
                    img.style.cursor = "pointer";
                    
                    // Клик открывает картинку в полноэкранном лайтбоксе[cite: 1, 3]
                    img.addEventListener('click', () => openLightbox(img.src));
                    
                    imagesWrapper.appendChild(img);
                    usedImages.add(imgUrl); // Запоминаем, что картинка уже использована[cite: 1]
                });

                imgContainer.appendChild(imagesWrapper);
                
                // Подпись к блоку картинок (если указана)[cite: 1]
                if (item.caption) {
                    const caption = document.createElement('div');
                    caption.style.fontSize = "0.95rem";
                    caption.style.color = "#aaa";
                    caption.style.marginTop = "8px";
                    caption.innerText = item.caption;
                    imgContainer.appendChild(caption);
                }
                
                bodyContent.appendChild(imgContainer);
            }
        });
    }

    if (season.allImages) {
        const remainingImages = season.allImages.filter(imgUrl => !usedImages.has(imgUrl));
        if (remainingImages.length > 0) {
            const extraHeader = document.createElement('h3');
            extraHeader.innerText = "Остальные скриншоты сезона:";
            extraHeader.style.marginTop = "30px";
            bodyContent.appendChild(extraHeader);

            const gallery = document.createElement('div');
            gallery.className = 'gallery-grid';
            
            // --- ИСПРАВЛЕНИЕ СЕТКИ ---
            gallery.style.display = "grid"; // Меняем flex на grid
            gallery.style.gridTemplateColumns = "repeat(3, minmax(0, 1fr))"; // Строго 3 равные колонки
            gallery.style.gap = "12px";
            gallery.style.marginTop = "15px";

            remainingImages.forEach(imgUrl => {
                const img = document.createElement('img');
                img.src = imgUrl;
                
                img.style.width = "100%"; // Заставляем картинку заполнить всю ширину своей колонки
                img.style.height = "160px"; // Чуть увеличили высоту (было 150)
                img.style.borderRadius = "4px";
                img.style.objectFit = "cover"; // Обрезаем излишки без сплющивания изображения
                img.style.cursor = "pointer";
                
                img.addEventListener('click', () => openLightbox(img.src));
                gallery.appendChild(img);
            });
            bodyContent.appendChild(gallery);
        }
    }

    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeModalWindow() {
    if (!modal) return;
    modal.classList.remove('show');
    setTimeout(() => { 
        modal.style.display = 'none'; 
    }, 300);
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModalWindow);
}

window.addEventListener('click', (evt) => { 
    if (evt.target === modal) closeModalWindow();
});

// --- СЛУЧАЙНЫЙ ФОН С ТАЙМЕРОМ СМЕНЫ ---
const backgroundImages = [
    "images/backgrounds/14-01-2024-converted.webp",
    "images/backgrounds/16-02-2024-converted.webp",
    "images/backgrounds/468-converted.webp",
    "images/backgrounds/2023-08-26_20.01.22 (1)-converted.webp",
    "images/backgrounds/2023-08-31_21.25.29-converted.webp",
    "images/backgrounds/2023-08-31_21.26.04-converted.webp",
    "images/backgrounds/2023-08-31_21.26.25-converted.webp",
    "images/backgrounds/2023-09-01_20-21-55-converted.webp",
    "images/backgrounds/2023-10-13_18-15-31-converted.webp",
    "images/backgrounds/2024-01-15_20.44.12-converted.webp",
    "images/backgrounds/2025-02-17_16.07.07-converted.webp",
    "images/backgrounds/2025-02-20_20.08.35-converted.webp",
    "images/backgrounds/2025-02-22_11.17.23-converted.webp",
    "images/backgrounds/2025-03-01_23.57.55-converted.webp",
    "images/backgrounds/2025-03-01_23.58.37-converted.webp",
    "images/backgrounds/2025-03-02_00.13.22-converted.webp",
    "images/backgrounds/2026-07-20_01.42.48-converted.webp",
    "images/backgrounds/Base_Profile_Screenshot_2024.02.08_-_15.24.00.25-converted.webp"
];

let lastSelectedImage = "";

function setRandomBackground() {
    const bgElement = document.getElementById("bg-element");
    if (backgroundImages.length > 0 && bgElement) {
        if (backgroundImages.length === 1) {
            bgElement.style.backgroundImage = `url('${backgroundImages[0]}')`;
            return;
        }

        let randomIndex;
        let selectedImage;

        do {
            randomIndex = Math.floor(Math.random() * backgroundImages.length);
            selectedImage = backgroundImages[randomIndex];
        } while (selectedImage === lastSelectedImage);

        lastSelectedImage = selectedImage;
        bgElement.style.backgroundImage = `url('${selectedImage}')`;
    }
}

// --- ВСПЛЫВАЮЩАЯ ПОЛОСА ПРОГРЕССА ---
const progressContainer = document.getElementById('bottom-progress-container');
const progressBar = document.getElementById('bottom-progress-bar');

let hideProgressTimeout = null;
let isDraggingProgress = false;
const HIDE_DELAY = 800;

function scheduleProgressHide() {
    clearTimeout(hideProgressTimeout);
    if (isDraggingProgress) return;

    hideProgressTimeout = setTimeout(() => {
        if (progressContainer) {
            progressContainer.classList.remove('active');
        }
    }, HIDE_DELAY);
}

function updateProgressBar() {
    if (!scrollContainer || !progressBar || !progressContainer) return;

    const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    if (maxScrollLeft > 0) {
        const percentage = (scrollContainer.scrollLeft / maxScrollLeft) * 100;
        progressBar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    }

    progressContainer.classList.add('active');
    scheduleProgressHide();
}

if (scrollContainer) {
    scrollContainer.addEventListener('scroll', () => {
        updateScrollIndicators();
        updateProgressBar();
    });
}

function seekTimelineByMouse(e) {
    if (!progressContainer || !scrollContainer) return;

    const rect = progressContainer.getBoundingClientRect();
    
    // Ограничиваем координаты строго внутри полосы (чтобы не улетало за края экрана)
    let clickX = e.clientX - rect.left;
    clickX = Math.max(0, Math.min(clickX, rect.width)); 
    
    const ratio = clickX / rect.width;
    const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    
    // Задаем ЦЕЛЬ для плавной прокрутки, а не дергаем экран мгновенно
    targetScroll = ratio * maxScrollLeft;

    // Запускаем цикл плавного скролла, если он спал
    if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(smoothScrollLoop);
    }
}

if (progressContainer && scrollContainer) {
    progressContainer.addEventListener('mousedown', (e) => {
        isDraggingProgress = true;
        progressContainer.classList.add('active');
        clearTimeout(hideProgressTimeout);
        seekTimelineByMouse(e);
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (isDraggingProgress) seekTimelineByMouse(e);
    });

    window.addEventListener('mouseup', () => {
        if (isDraggingProgress) {
            isDraggingProgress = false;
            scheduleProgressHide();
        }
    });

    progressContainer.addEventListener('touchstart', (e) => {
        isDraggingProgress = true;
        progressContainer.classList.add('active');
        clearTimeout(hideProgressTimeout);
        if (e.touches.length > 0) seekTimelineByMouse(e.touches[0]);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (isDraggingProgress && e.touches.length > 0) {
            seekTimelineByMouse(e.touches[0]);
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        if (isDraggingProgress) {
            isDraggingProgress = false;
            scheduleProgressHide();
        }
    });
}

// --- ЛОГИКА СЕЗОННЫХ ЭФФЕКТОВ И ФИЛЬТРОВ ---
let areEffectsEnabled = true;
let currentForcedSeason = null;

function getCurrentSeason() {
    const month = new Date().getMonth();
    
    if (month === 11 || month === 0 || month === 1) return 'winter';
    if (month === 2 || month === 3) return 'spring';
    if (month === 4) return 'may';
    if (month >= 5 && month <= 7) return 'summer';
    return 'autumn'; // Осень (сентябрь - ноябрь)
}

function clearEffects() {
    const activeContainers = document.querySelectorAll(
        '#snow-container, #autumn-leaves-container, #spring-rain-container, #may-fireflies-container, #summer-glares-container'
    );

    activeContainers.forEach(container => {
        // Добавляем класс с анимацией исчезновения
        container.classList.add('weather-fade-out');
        
        // Удаляем элемент из DOM через 500мс (время совпадает с длительностью анимации в CSS)
        setTimeout(() => {
            container.remove();
        }, 500);
    });
}

function createSnowflakes() {
    clearEffects();
    const container = document.createElement('div');
    container.id = 'snow-container';
    document.body.appendChild(container);

    const count = 50;
    for (let i = 0; i < count; i++) {
        const snow = document.createElement('div');
        snow.className = 'snowflake';
        snow.style.left = ((Math.random() * 120) - 10) + 'vw';
        const size = Math.random() * 4 + 5;
        snow.style.width = size + 'px';
        snow.style.height = size + 'px';
        snow.style.opacity = Math.random() * 0.4 + 0.5;
        const duration = Math.random() * 5 + 7;
        const delay = -Math.random() * 12;
        snow.style.animation = `snowFall ${duration}s linear ${delay}s infinite`;
        container.appendChild(snow);
    }
}

function createAutumnLeaves() {
    clearEffects();
    const container = document.createElement('div');
    container.id = 'autumn-leaves-container';
    document.body.appendChild(container);

    const colors = ['#ff9800', '#ffb300', '#f57c00', '#e65100', '#d84315']; 
    const count = 32; 

    for (let i = 0; i < count; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'autumn-leaf';
        leaf.style.left = ((Math.random() * 120) - 10) + 'vw';
        leaf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 14 + 16;
        leaf.style.width = size + 'px';
        leaf.style.height = size + 'px';
        leaf.style.setProperty('--max-opacity', Math.random() * 0.4 + 0.4);
        leaf.style.setProperty('--wind-drift', (Math.random() * 40 - 20) + 'vw');
        leaf.style.setProperty('--rot-x-start', (Math.random() * 50 - 25) + 'deg');
        leaf.style.setProperty('--rot-x-end', (Math.random() * 50 - 25) + 'deg');
        leaf.style.setProperty('--rot-y-start', (Math.random() * 50 - 25) + 'deg');
        leaf.style.setProperty('--rot-y-end', (Math.random() * 50 - 25) + 'deg');

        const duration = Math.random() * 6 + 7;
        const delay = -Math.random() * 12; 
        leaf.style.animation = `fallAndRotateSafe ${duration}s linear ${delay}s infinite`;
        container.appendChild(leaf);
    }
}

function createSpringRain() {
    clearEffects(); // Очищаем старые эффекты, если они были
    
    // Создаем контейнер заново, так как clearEffects удаляет его из DOM
    const container = document.createElement('div');
    container.id = 'spring-rain-container';
    document.body.appendChild(container);

    // Уменьшили количество капель с 60 до 45
    const dropCount = 35; 

    for (let i = 0; i < dropCount; i++) {
        createRainDrop(container);
    }
}

function createRainDrop(container) {
    const drop = document.createElement('div');
    drop.classList.add('spring-raindrop');

    // Случайные параметры для каждой капли
    const startX = Math.random() * window.innerWidth; // Случайная точка по X сверху
    const duration = Math.random() * 0.6 + 0.5;       // Скорость падения (от 0.5 до 1.1 секунды)
    const opacity = Math.random() * 0.3 + 0.4;        // Чуть более выраженная прозрачность
    
    // Увеличиваем размеры: длина капли теперь от 20px до 40px
    const height = Math.random() * 20 + 20;           

    // Применяем стили напрямую через JS
    drop.style.left = `${startX}px`;
    drop.style.top = `-50px`; 
    drop.style.height = `${height}px`;
    drop.style.opacity = opacity;

    container.appendChild(drop);

    // Расчет расстояний для падения и ветра
    const fallDistance = window.innerHeight + 50; 
    const windDrift = -(Math.random() * 100 + 50); // Ветер влево

    const animation = drop.animate([
        { transform: `translate(0px, 0px)` },
        { transform: `translate(${windDrift}px, ${fallDistance}px)` }
    ], {
        duration: duration * 1000,
        easing: 'linear'
    });

    animation.onfinish = () => {
        drop.remove();
        if (document.body.contains(container)) {
            createRainDrop(container);
        }
    };
}

function createMayFireflies() {
    const container = document.createElement('div');
    container.id = 'may-fireflies-container';
    document.body.appendChild(container);

    for (let i = 0; i < 30; i++) {
        const firefly = document.createElement('div');
        firefly.className = 'may-firefly';
        
        firefly.style.left = (Math.random() * 100) + 'vw';
        firefly.style.top = (Math.random() * 100) + 'vh';

        const size = Math.random() * 4 + 3; 
        firefly.style.width = size + 'px';
        firefly.style.height = size + 'px';

        const duration = Math.random() * 5 + 4;
        const delay = -Math.random() * 10;
        firefly.style.animation = `fireflyFloat ${duration}s ease-in-out ${delay}s infinite`;
        
        container.appendChild(firefly);
    }
}

function createSummerBokeh() {
    const container = document.createElement('div');
    container.id = 'summer-glares-container';
    document.body.appendChild(container);

    for (let i = 0; i < 15; i++) {
        const glare = document.createElement('div');
        glare.className = 'summer-glare';
        
        glare.style.left = (Math.random() * 100) + 'vw';
        glare.style.top = (Math.random() * 100) + 'vh';

        const size = Math.random() * 80 + 40; 
        glare.style.width = size + 'px';
        glare.style.height = size + 'px';

        const duration = Math.random() * 10 + 8;
        const delay = -Math.random() * 12;
        glare.style.animation = `summerBokeh ${duration}s ease-in-out ${delay}s infinite`;
        
        container.appendChild(glare);
    }
}

function setSeasonalFilter(season) {
    document.querySelectorAll('#seasonal-filter').forEach(el => el.remove());
    if (season && season !== 'none' && areEffectsEnabled) {
        let filterEl = document.createElement('div');
        filterEl.id = 'seasonal-filter';
        filterEl.className = `filter-${season}`;
        document.body.prepend(filterEl);
    }
}

function applySeason(season) {
    currentForcedSeason = season;
    updateWeatherAndFilter();
}

function updateWeatherAndFilter() {
    const season = currentForcedSeason || getCurrentSeason();
    if (!areEffectsEnabled) {
        setSeasonalFilter('none');
        clearEffects();
        return;
    }
    setSeasonalFilter(season);
    clearEffects();
    
    if (season === 'autumn') {
        createAutumnLeaves();
    } else if (season === 'winter') {
        createSnowflakes();
    } else if (season === 'spring') {
        createSpringRain();
    } else if (season === 'may') {
        createMayFireflies();
    } else if (season === 'summer') {
        createSummerBokeh();
    }
}

function printToConsole(text, type = 'system') {
    const output = document.getElementById('console-output');
    if (!output) return;
    
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.innerHTML = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

// --- ЕДИНЫЙ ЗАПУСК И ОБРАБОТКА ИНТЕРФЕЙСА ---
let isAdmin = false;

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateScrollIndicators, 100);
    setRandomBackground();
    setInterval(setRandomBackground, 5000);

    currentForcedSeason = getCurrentSeason(); 
    updateWeatherAndFilter();

    const consoleModal = document.getElementById('console-modal');
    const consoleBtn = document.getElementById('secret-console-btn');
    const consoleCloseBtn = document.getElementById('console-close-btn');
    const consoleForm = document.getElementById('console-form');
    const consoleInput = document.getElementById('console-input');

    if (consoleBtn && consoleModal) {
        consoleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            consoleModal.classList.add('active');
            if (consoleInput) consoleInput.focus();
        });
    }

    if (consoleCloseBtn && consoleModal) {
        consoleCloseBtn.addEventListener('click', () => {
            consoleModal.classList.remove('active');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === consoleModal) {
            consoleModal.classList.remove('active');
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && consoleModal && consoleModal.classList.contains('active')) {
            consoleModal.classList.remove('active');
        }
    });

    if (consoleForm) {
        consoleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const command = consoleInput.value.trim();
            if (!command) return;

            printToConsole(`&gt; ${command}`, 'user');
            consoleInput.value = '';

            const lowerCmd = command.toLowerCase();

            if (lowerCmd === '42805542') {
                isAdmin = true;
                printToConsole('<b>[СЕКРЕТНЫЙ ДОСТУП РАЗРЕШЕН]</b> Режим администратора активирован! 🎉', 'secret');
                printToConsole('Теперь вам доступны команды управления сезонами.', 'secret');
                return;
            }

            if (lowerCmd === 'help') {
                printToConsole('<b>Список доступных команд:</b>', 'system');
                printToConsole(' • <b>help</b> — вызов справки ❓', 'system');
                printToConsole(' • <b>clear</b> — очистить историю консоли 🧹', 'system');
                
                if (isAdmin) {
                    printToConsole('<b>Команды администратора:</b>', 'secret');
                    printToConsole(' • <b>winter</b> — включить зимний сезон ❄️', 'system');
                    printToConsole(' • <b>autumn</b> — включить осенний сезон 🍂', 'system');
                    printToConsole(' • <b>spring</b> — включить весенний сезон 🌿', 'system');
                    printToConsole(' • <b>summer</b> — включить летний сезон ☀️', 'system');
                    printToConsole(' • <b>may</b> — включить майских светлячков ✨', 'system'); // <--- Добавили строчку в справку
                }
            } else if (lowerCmd === 'clear') {
                const output = document.getElementById('console-output');
                if (output) output.innerHTML = '';

            } else if (lowerCmd === 'winter') {
                if (!isAdmin) {
                    printToConsole('Ошибка: Требуются права администратора.', 'error');
                } else {
                    applySeason('winter');
                    printToConsole('Зимний режим успешно активирован! ❄️', 'success');
                }

            } else if (lowerCmd === 'autumn') {
                if (!isAdmin) {
                    printToConsole('Ошибка: Требуются права администратора.', 'error');
                } else {
                    applySeason('autumn');
                    printToConsole('Осенний режим успешно активирован! 🍂', 'success');
                }

            } else if (lowerCmd === 'spring') {
                if (!isAdmin) {
                    printToConsole('Ошибка: Требуются права администратора.', 'error');
                } else {
                    applySeason('spring');
                    printToConsole('Весенний режим успешно активирован! 🌿', 'success');
                }

            } else if (lowerCmd === 'summer') {
                if (!isAdmin) {
                    printToConsole('Ошибка: Требуются права администратора.', 'error');
                } else {
                    applySeason('summer');
                    printToConsole('Летний режим успешно активирован! ☀️', 'success');
                }

            } else if (lowerCmd === 'may') { // <--- Добавили обработку команды 'may'
                if (!isAdmin) {
                    printToConsole('Ошибка: Требуются права администратора.', 'error');
                } else {
                    applySeason('may');
                    printToConsole('Майский режим со светлячками успешно активирован! ✨', 'success');
                }

            } else {
                printToConsole(`Ошибка: Неизвестная команда "${command}". Введите <b>help</b> для списка команд.`, 'error');
            }
        });
    }

    const effectsBtn = document.getElementById('effects-toggle-btn');
    if (effectsBtn) {
        effectsBtn.addEventListener('click', () => {
            areEffectsEnabled = !areEffectsEnabled;
            effectsBtn.classList.toggle('disabled', !areEffectsEnabled);
            updateWeatherAndFilter();
        });
    }
});




// Логика модального окна новостей
const newsBtn = document.getElementById('news-btn');
const newsModal = document.getElementById('news-modal'); // Модалка с новостями
const newsContainer = document.getElementById('news-container');
const closeNewsBtn = document.getElementById('close-news'); // Крестик закрытия

if (newsBtn && newsModal) {
    newsBtn.addEventListener('click', () => {
        // Открываем модалку через класс анимации
        newsModal.classList.add('show');
        newsContainer.innerHTML = ''; 

        news.forEach(item => {
            const changesList = item.changes.map(c => `<li>${c}</li>`).join('');
            newsContainer.innerHTML += `
                <div class="news-item">
                    <div class="news-date">${item.date}</div>
                    <h2>${item.title}</h2>
                    <img src="${item.image}" alt="Обновление">
                    <h3>список изменений:</h3>
                    <ul>${changesList}</ul>
                </div>
            `;
        });
    });
}

// Функция закрытия окна новостей
function closeNewsWindow() {
    if (newsModal) {
        newsModal.classList.remove('show');
    }
}

// Закрытие по клику на крестик
if (closeNewsBtn) {
    closeNewsBtn.addEventListener('click', closeNewsWindow);
}

// Закрытие по клику на тёмный фон вокруг модального окна
window.addEventListener('click', (evt) => { 
    if (evt.target === newsModal) closeNewsWindow();
});


// --- ОТРИСОВКА И ЛОГИКА ТИР-ЛИСТА ---
const tierlistBtn = document.getElementById('open-tierlist-btn');
const tierlistModal = document.getElementById('tierlist-modal');
const closeTierlistBtn = document.getElementById('close-tierlist-btn');
const tierlistBodyContent = document.getElementById('tierlist-body-content');

function renderTierList() {
    if (!tierlistBodyContent) return;
    tierlistBodyContent.innerHTML = '';

    if (typeof tierListData !== 'undefined') {
        tierListData.forEach(tierRow => {
            const rowEl = document.createElement('div');
            rowEl.className = 'tier-row';

            // Плашка с буквой/названием тира
            const labelEl = document.createElement('div');
            labelEl.className = 'tier-label';
            labelEl.style.backgroundColor = tierRow.color || '#444';
            labelEl.innerText = tierRow.tier;
            rowEl.appendChild(labelEl);

            // Контейнер для элементов внутри тира
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'tier-items-container';

            if (tierRow.items && tierRow.items.length > 0) {
                tierRow.items.forEach(item => {
                    const itemCard = document.createElement('div');
                    itemCard.className = 'tier-item-card';

                    const img = document.createElement('img');
                    img.src = item.image || getRandomFallbackHead();
                    img.alt = item.name;
                    img.title = item.name;

                    item.image && img.addEventListener('click', () => openLightbox(img.src));

                    itemCard.appendChild(img);
                    itemsContainer.appendChild(itemCard);
                });
            } else {
                const emptyPlaceholder = document.createElement('span');
                emptyPlaceholder.className = 'tier-empty';
                emptyPlaceholder.innerText = 'Пусто';
                itemsContainer.appendChild(emptyPlaceholder);
            }

            rowEl.appendChild(itemsContainer);
            tierlistBodyContent.appendChild(rowEl);
        });
    }
}

if (tierlistBtn && tierlistModal) {
    tierlistBtn.addEventListener('click', () => {
        renderTierList(); // Рендерим актуальные данные при открытии
        tierlistModal.classList.remove('hidden');
        tierlistModal.style.display = 'flex';
        setTimeout(() => {
            tierlistModal.classList.add('show');
        }, 10);
    });
}

function closeTierlistWindow() {
    if (tierlistModal) {
        tierlistModal.classList.remove('show');
        setTimeout(() => {
            tierlistModal.style.display = 'none';
            tierlistModal.classList.add('hidden');
        }, 300);
    }
}

if (closeTierlistBtn) {
    closeTierlistBtn.addEventListener('click', closeTierlistWindow);
}

window.addEventListener('click', (evt) => {
    if (evt.target === tierlistModal) {
        closeTierlistWindow();
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && tierlistModal && !tierlistModal.classList.contains('hidden')) {
        closeTierlistWindow();
    }
});

