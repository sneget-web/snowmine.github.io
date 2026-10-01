const timelineElement = document.getElementById('timeline');

// Функция для открытия картинки по центру экрана (лайтбокс)
function openLightbox(imgSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = imgSrc;
    lightbox.style.display = 'flex';
}

seasons.forEach((season) => {
    const node = document.createElement('div');
    node.className = 'season-node';
    
    const hoverContainer = document.createElement('div');
    hoverContainer.className = 'hover-image-container';
    const hoverImg = document.createElement('img');
    
    if (season.randomImages && season.randomImages.length > 0) {
        hoverImg.src = season.randomImages[0];
    }

    // Делаем превью-картинку при наведении кликабельной для полного экрана
    hoverImg.style.cursor = 'pointer';
    hoverImg.addEventListener('click', (e) => {
        e.stopPropagation(); // чтобы не открывалось модальное окно сезона
        openLightbox(hoverImg.src);
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

const scrollContainer = document.getElementById('scroll-container');
scrollContainer.addEventListener('wheel', (evt) => {
    evt.preventDefault();
    scrollContainer.scrollLeft += evt.deltaY * 1.5; 
});

const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('close-modal');

function openModal(season) {
    document.getElementById('modal-title').innerText = season.title;
    document.getElementById('modal-version').innerText = season.version;
    
    const downloadBtn = document.getElementById('modal-download');

    // Проверяем, заполнена ли ссылка на мир (если пустая — кнопка становится серой)
    if (season.worldLink && season.worldLink.trim() !== "") {
        downloadBtn.href = season.worldLink;
        downloadBtn.innerText = "Скачать мир";
        downloadBtn.classList.remove('disabled');
        downloadBtn.setAttribute('target', '_blank');
    } else {
        downloadBtn.href = "#";
        downloadBtn.innerText = "Сохранение мира не найдено";
        downloadBtn.classList.add('disabled');
        downloadBtn.removeAttribute('target');
    }

    const bodyContent = document.getElementById('modal-body-content');
    bodyContent.innerHTML = '';
    
    const usedImages = new Set();

    // 1. Отрисовываем кастомный контент (текст / картинки)
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

    // 2. Автоматически находим оставшиеся картинки
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

    // Запускаем плавную анимацию появления модалки через класс CSS
    modal.classList.add('show');
}

// Функция закрытия с плавной анимацией
function closeModalWindow() {
    modal.classList.remove('show');
}

closeModalBtn.addEventListener('click', closeModalWindow);
window.addEventListener('click', (evt) => { 
    if (evt.target === modal) {
        closeModalWindow();
    } 
});


// --- СЛУЧАЙНЫЙ ФОН С ТАЙМЕРОМ СМЕНЫ И ЗАЩИТОЙ ОТ ПОВТОРОВ ---
const backgroundImages = [
    "images/season1/2023-08-31_21.26.25.png",
    "images/season1/2023-08-26_20.01.22.png",
    "images/season1/2023-08-31_21.25.29.png",
    "images/season1/2023-08-31_21.26.04.png",
    "images/season1/2023-09-01_20-21-55.png",
    "images/season1SB/2023-10-13_18-15-31.png",
    "images/season2/14.01.2024.png",
    "images/season4/2024-06-17_21-08-38.png",
    "images/season4/12.06.2024.png"
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

// Запускаем при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    setRandomBackground(); // Установить первую картинку сразу
    
    // Меняем фон каждые 8 секунд (8000 миллисекунд)
    setInterval(setRandomBackground, 8000);
});