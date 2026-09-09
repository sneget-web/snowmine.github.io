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
    "images/heads/2dd53cccfdcf524b44f9cfeb78b7136e.jpg",
    "images/heads/5a339e704816608612a25249236866ee.jpg",
    "images/heads/5b1a0afde84d583e4d7e0b383df891b6.jpg",
    "images/heads/6c18d5c275a2c6154fe0cbcf51da6a80.jpg",
    "images/heads/6f1e69cd52eda9edf3323d12ac8dc97d.jpg",
    "images/heads/7e8d6996511a008131fff6f446fa1833.jpg",
    "images/heads/58c627cae896636a7375b0ab78b6e4ce.jpg",
    "images/heads/67b08c6f88e6aa78b8373cebc2265318.jpg",
    "images/heads/85eab929a7dca982a46dd2a00443e9b7.jpg",
    "images/heads/319dcb893b6e1124c2d28a12569aebd6.jpg",
    "images/heads/427e14f51e753ddee3ced92980fecd8e.jpg",
    "images/heads/646d2830b667c8e203ea483f501f00cb.jpg",
    "images/heads/909c2238c5edd06912ac1ad6a3c31968.jpg",
    "images/heads/3024c86002544104d4ce2999b6ee3514.jpg",
    "images/heads/856924af9719419ddff5e3d71935877f.jpg",
    "images/heads/840984620e8c437595ce7946147db34c.jpg",
    "images/heads/a707efe13cbf865ba72b5c48ff261ea3.jpg",
    "images/heads/ad46b50918e0a8ba0a266e674eafac75.jpg",
    "images/heads/b5ec9586eef23231333f5206704434a9.jpg",
    "images/heads/b5ffbf938edef3c1aa312491857dc76c.jpg",
    "images/heads/bcc08ed6414114489ef9c0df25226a96.jpg",
    "images/heads/bd8f2acc74af3e0e0c68079dd3961a4f.jpg",
    "images/heads/c6d9d2f704df2983bfa187543b655e14.jpg",
    "images/heads/d7e1cb5708df0c214eac4da6cb6dda51.jpg",
    "images/heads/e746383410960961d6daab30b90be263.jpg",
    "images/heads/head1.jpg",
    "images/heads/head2.jpg",
    "images/heads/head3.jpg"
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

    timelineElement.style.width = `${Math.max(maxLeft + 600, window.innerWidth)}px`; // Огромный запас справа, чтобы линия уходила далеко в будущее
}

// --- ПРОКРУТКА КОЛЕСИКОМ МЫШИ ---
const scrollContainer = document.getElementById('scroll-container');

let targetScroll = 0;
let currentScroll = 0;
let isScrolling = false;

function smoothScrollLoop() {
    if (!scrollContainer) return;

    currentScroll += (targetScroll - currentScroll) * 0.22;
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

        targetScroll += evt.deltaY * 1.5;

        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

        if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(smoothScrollLoop);
        }
    }, { passive: false });
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
let startX = 0;
let startY = 0;
let hasMoved = false; // Флаг для разделения перетаскивания и клика

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

    // Закрытие по клику на темный фон
    lightbox.addEventListener('click', (e) => {
        if (e.target.id === 'lightbox') {
            lightbox.style.display = 'none';
        }
    });

    // Закрытие по клавише Escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            lightbox.style.display = 'none';
        }
    });

    lightboxImg.addEventListener('dragstart', (e) => e.preventDefault());

    // Клик по картинке (зум или возвращение назад)
    lightboxImg.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // ЕСЛИ мы только что перетаскивали картинку, отменяем срабатывание клика
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

    // Зум колесиком мыши относительно позиции курсора
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

    // Начало перетаскивания
    lightboxImg.addEventListener('mousedown', (e) => {
        if (scale > 1) {
            e.preventDefault();
            panning = true;
            hasMoved = false; // Сбрасываем флаг при новом нажатии
            startX = e.clientX - pointX;
            startY = e.clientY - pointY;
            updateCursor();
        }
    });

    // Процесс перемещения мыши
    window.addEventListener('mousemove', (e) => {
        if (!panning) return;
        e.preventDefault();
        hasMoved = true; // Фиксируем, что было реальное движение (перетаскивание)
        pointX = e.clientX - startX;
        pointY = e.clientY - startY;
        setTransform();
    });

    // Конец перетаскивания
    window.addEventListener('mouseup', () => {
        if (panning) {
            panning = false;
            updateCursor();
        }
    });
});

// --- ОТРИСОВКА БЛОКА ИГРОКОВ ---
function renderPlayersBlock(item, container) {
    const playersContainer = document.createElement('div');
    playersContainer.className = 'players-container';

    if (item.title) {
        const title = document.createElement('div');
        title.className = 'players-title';
        title.innerText = item.title;
        playersContainer.appendChild(title);
    }

    const grid = document.createElement('div');
    grid.className = 'players-grid';

    if (item.list && Array.isArray(item.list)) {
        item.list.forEach(player => {
            const card = document.createElement('div');
            card.className = 'player-card';

            const name = typeof player === 'string' ? player : player.name;
            const customHead = typeof player === 'object' && player !== null ? player.head : null;
            const altNames = typeof player === 'object' && player !== null ? player.altNames : null;

            const img = document.createElement('img');
            img.className = 'player-head';
            img.alt = name;

            if (customHead) {
                img.src = customHead;
            } else {
                img.src = getRandomFallbackHead();
            }

            img.onerror = () => { 
                img.src = 'images/heads/head1.jpg'; 
            };

            const nameSpan = document.createElement('span');
            nameSpan.className = 'player-name';
            nameSpan.innerText = name;

            card.appendChild(img);
            card.appendChild(nameSpan);
            
            if (altNames && Array.isArray(altNames) && altNames.length > 0) {
                card.style.cursor = 'pointer';
                card.style.userSelect = 'none';

                card.addEventListener('click', () => {
                    let availableNames = altNames.filter(n => n !== nameSpan.innerText);
                    if (availableNames.length === 0) availableNames = altNames; 

                    const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
                    nameSpan.innerText = randomName;
                });
            }

            grid.appendChild(card);
        });
    }

    playersContainer.appendChild(grid);
    container.appendChild(playersContainer);
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
                
                let imagesToDisplay = [];
                if (item.urls && Array.isArray(item.urls)) {
                    imagesToDisplay = item.urls;
                } else if (item.url) {
                    imagesToDisplay = [item.url];
                }

                const imagesWrapper = document.createElement('div');
                imagesWrapper.style.display = "flex";
                imagesWrapper.style.justifyContent = "center";
                imagesWrapper.style.gap = "10px";
                imagesWrapper.style.flexWrap = "wrap";

                imagesToDisplay.forEach(imgUrl => {
                    const img = document.createElement('img');
                    img.src = imgUrl;
                    img.style.maxWidth = "100%";
                    img.style.maxHeight = "350px";
                    img.style.borderRadius = "6px";
                    img.style.objectFit = "cover";
                    img.style.cursor = "pointer";
                    
                    img.addEventListener('click', () => openLightbox(img.src));
                    imagesWrapper.appendChild(img);
                    usedImages.add(imgUrl);
                });

                imgContainer.appendChild(imagesWrapper);

                if (item.caption) {
                    const captionEl = document.createElement('div');
                    captionEl.innerText = item.caption;
                    captionEl.style.fontSize = "0.95rem";
                    captionEl.style.color = "#aaaaaa";
                    captionEl.style.marginTop = "8px";
                    captionEl.style.fontStyle = "italic";
                    imgContainer.appendChild(captionEl);
                }

                bodyContent.appendChild(imgContainer);
            } else if (item.type === "players") {
                renderPlayersBlock(item, bodyContent);
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
            gallery.style.display = "flex";
            gallery.style.flexWrap = "wrap";
            gallery.style.gap = "10px";
            gallery.style.marginTop = "10px";

            remainingImages.forEach(imgUrl => {
                const img = document.createElement('img');
                img.src = imgUrl;
                img.style.height = "150px";
                img.style.borderRadius = "4px";
                img.style.objectFit = "cover";
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
    "images/season1/2023-08-31_21.26.25.png",
    "images/season1/2023-08-26_20.01.22.png",
    "images/season1/2023-08-31_21.25.29.png",
    "images/season1/2023-08-31_21.26.04.png",
    "images/season1/2023-09-01_20-21-55.png",
    "images/season1SB/2023-10-13_18-15-31.png",
    "images/season2/14.01.2024.png",
    "images/season2/2024-01-15_20.44.12.png",
    "images/season3/16.02.2024.png",
    "images/season3/Base_Profile_Screenshot_2024.02.08_-_15.24.00.25.png",
    "images/season5/2025-02-17_16.07.07.png",
    "images/season5/2025-02-20_20.08.35.png",
    "images/season5/2025-02-22_11.17.23.png",
    "images/season5/2025-03-01_23.57.55.png",
    "images/season5/2025-03-01_23.58.37.png",
    "images/season5/2025-03-02_00.13.22.png",
    "images/season6/468.png",
    "images/seasone create/2026-07-20_01.42.48.png"
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

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateScrollIndicators, 100);
    setRandomBackground();
    setInterval(setRandomBackground, 5000);
});

// --- ВСПЛЫВАЮЩАЯ ПОЛОСА ПРОГРЕССА С ПЛАВНОЙ ПЕРЕМОТКОЙ И БЫСТРЫМ СКРЫТИЕМ ---
const progressContainer = document.getElementById('bottom-progress-container');
const progressBar = document.getElementById('bottom-progress-bar');

let hideProgressTimeout = null;
let isDraggingProgress = false;

// Таймер убирания полосы (400 мс вместо 1200 мс для быстрого скрытия)
const HIDE_DELAY = 800;

function scheduleProgressHide() {
    clearTimeout(hideProgressTimeout);
    // Не убираем полосу, пока пользователь держит зажатой клавишу мыши
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

// Вызываем обновление при обычном скролле мышкой
if (scrollContainer) {
    scrollContainer.addEventListener('scroll', () => {
        updateScrollIndicators();
        updateProgressBar();
    });
}

// Расчёт позиции таймлайна по координате X
function seekTimelineByMouse(e) {
    if (!progressContainer || !scrollContainer) return;

    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));

    const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    
    // Мгновенная прокрутка таймлайна за курсором
    scrollContainer.scrollLeft = ratio * maxScrollLeft;

    if (typeof updateScrollIndicators === 'function') updateScrollIndicators();
    if (typeof updateProgressBar === 'function') updateProgressBar();
}

// Перетаскивание зажатой мышью
if (progressContainer && scrollContainer) {
    progressContainer.addEventListener('mousedown', (e) => {
        isDraggingProgress = true;
        progressContainer.classList.add('active');
        clearTimeout(hideProgressTimeout);
        
        seekTimelineByMouse(e);
        e.preventDefault(); // Защита от выделения текста при ведении мыши
    });

    window.addEventListener('mousemove', (e) => {
        if (isDraggingProgress) {
            seekTimelineByMouse(e);
        }
    });

    window.addEventListener('mouseup', () => {
        if (isDraggingProgress) {
            isDraggingProgress = false;
            scheduleProgressHide();
        }
    });

    // Поддержка сенсорных экранов
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