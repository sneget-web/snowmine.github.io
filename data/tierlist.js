// ==========================================
// 1. НАСТРОЙКИ И ДАННЫЕ ТИР-ЛИСТА
// ==========================================

const tierRowsData = [
    { id: "Джекпот", color: "#ff7f7f" },
    { id: "Крутяк", color: "#ffbf7f" },
    { id: "Не найс", color: "#ffdf7f" },
    { id: "дерьмо", color: "#d2ff7f" },
    { id: "Не играл,  Не помню", color: "#838383" }
];

const tierItemsData = [
    { id: "item1", name: "Сезон 1", image: "images/ico/1.webp" },
    { id: "item2", name: "Сезон stone block", image: "images/ico/SB.webp" },
    { id: "item3", name: "Сезон 2", image: "images/ico/2.webp" },
    { id: "item4", name: "Сезон 3", image: "images/ico/3.webp" }, 
    { id: "item5", name: "Сезон 4", image: "images/ico/4.webp" },
    { id: "item6", name: "Сезон 5", image: "images/ico/5.webp" },
    { id: "item7", name: "Игрок 6", image: "images/ico/6.webp" },
    { id: "item8", name: "Игрок create", image: "images/ico/create.webp" }
];

// ==========================================
// 2. ЛОГИКА РЕНДЕРА И ОКНА
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const tierlistBtn = document.getElementById('open-tierlist-btn');
    const tierlistModal = document.getElementById('tierlist-modal');
    const closeTierlistBtn = document.getElementById('close-tierlist-btn');
    const tierlistBody = document.getElementById('tierlist-body-content');

    let tierlistMemoryWrapper = null;

    if (tierlistBtn && tierlistModal) {
        tierlistBtn.addEventListener('click', () => {
            if (!tierlistMemoryWrapper) {
                tierlistMemoryWrapper = document.createElement('div');
                tierlistMemoryWrapper.id = 'tierlist-memory-wrapper';
                renderTierList(tierlistMemoryWrapper); 
            }
            if (tierlistBody) {
                tierlistBody.appendChild(tierlistMemoryWrapper);
            }
            tierlistModal.classList.remove('hidden');
            tierlistModal.style.display = 'flex';
            setTimeout(() => tierlistModal.classList.add('show'), 10);
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

    if (closeTierlistBtn) closeTierlistBtn.addEventListener('click', closeTierlistWindow);
    window.addEventListener('click', (evt) => { if (evt.target === tierlistModal) closeTierlistWindow(); });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && tierlistModal && !tierlistModal.classList.contains('hidden')) {
            closeTierlistWindow();
        }
    });

    function attachDragEvents(zone) {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    }

    function createTierRow(tier) {
        const row = document.createElement('div');
        row.className = 'tier-row';

        const label = document.createElement('div');
        label.className = 'tier-label';
        label.style.backgroundColor = tier.color;
        label.innerText = tier.id;
        label.contentEditable = "true";
        label.spellcheck = false;

        label.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                label.blur();
            }
        });

        const dropZone = document.createElement('div');
        dropZone.className = 'tier-items-container';
        dropZone.dataset.zone = 'tier';
        attachDragEvents(dropZone); 

        // ==========================================
        // ПЕРЕТАСКИВАНИЕ СТРОК (ИСПРАВЛЕНО)
        // ==========================================
        dropZone.addEventListener('mousedown', function(e) {
            if (e.target !== dropZone) return;
            if (e.button !== 0) return; 

            e.preventDefault();

            const container = row.parentElement;
            if (!container) return;

            // Удаляем любые залипшие плейсхолдеры из контейнера заранее
            container.querySelectorAll('.tier-row.placeholder').forEach(p => p.remove());

            const preventNativeDrag = (dragEvt) => dragEvt.preventDefault();
            row.addEventListener('dragstart', preventNativeDrag);

            const containerRect = container.getBoundingClientRect();
            const rect = row.getBoundingClientRect();
            const startY = e.clientY;

            // Вычисляем координаты относительно контейнера #tier-rows-container
            const startTopInContainer = rect.top - containerRect.top;
            const startLeftInContainer = rect.left - containerRect.left;

            let hasMoved = false;

            // Заглушка (placeholder) — для удержания места в потоке
            const placeholder = document.createElement('div');
            placeholder.className = 'tier-row placeholder';
            placeholder.style.height = rect.height + 'px';
            placeholder.style.margin = window.getComputedStyle(row).margin;
            placeholder.style.boxSizing = 'border-box';

            // Позиционируем относительно родительского контейнера (#tier-rows-container имеет position: relative)
            row.style.position = 'absolute';
            row.style.top = startTopInContainer + 'px';
            row.style.left = startLeftInContainer + 'px';
            row.style.width = rect.width + 'px';
            row.style.zIndex = '9999';
            row.style.pointerEvents = 'none'; 
            row.style.transition = 'none';
            row.style.transform = 'scale(1.01)';
            row.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
            row.classList.add('dragging-row');

            container.insertBefore(placeholder, row.nextSibling);

            function movePlaceholderWithAnimation(newSibling) {
                const staticRows = Array.from(container.querySelectorAll('.tier-row:not(.dragging-row):not(.placeholder)'));
                
                const firstPositions = new Map();
                staticRows.forEach(el => firstPositions.set(el, el.getBoundingClientRect().top));

                if (newSibling === 'after-last') {
                    container.appendChild(placeholder);
                } else if (newSibling) {
                    container.insertBefore(placeholder, newSibling);
                }

                staticRows.forEach(el => {
                    const firstTop = firstPositions.get(el);
                    const lastTop = el.getBoundingClientRect().top;
                    const deltaY = firstTop - lastTop;

                    if (deltaY !== 0) {
                        el.style.transition = 'none';
                        el.style.transform = `translateY(${deltaY}px)`;

                        void el.offsetHeight;

                        el.style.transition = 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)';
                        el.style.transform = 'translateY(0px)';

                        setTimeout(() => {
                            el.style.transition = '';
                            el.style.transform = '';
                        }, 150);
                    }
                });
            }

            function onMouseMove(moveEvent) {
                hasMoved = true;
                const deltaY = moveEvent.clientY - startY;
                row.style.top = (startTopInContainer + deltaY) + 'px';

                const currentContainerRect = container.getBoundingClientRect();
                const relativeMouseY = moveEvent.clientY - currentContainerRect.top;

                const staticRows = Array.from(container.querySelectorAll('.tier-row:not(.dragging-row):not(.placeholder)'));
                const placeholderIndex = Array.from(container.children).indexOf(placeholder);

                for (let i = 0; i < staticRows.length; i++) {
                    const targetRow = staticRows[i];
                    const targetTop = targetRow.offsetTop;
                    const targetHeight = targetRow.offsetHeight;
                    const targetIndex = Array.from(container.children).indexOf(targetRow);

                    const margin = targetHeight * 0.2;

                    if (placeholderIndex < targetIndex) {
                        if (relativeMouseY > targetTop + margin) {
                            movePlaceholderWithAnimation(targetRow.nextSibling || 'after-last');
                            break;
                        }
                    } else if (placeholderIndex > targetIndex) {
                        if (relativeMouseY < targetTop + targetHeight - margin) {
                            movePlaceholderWithAnimation(targetRow);
                            break;
                        }
                    }
                }
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                row.removeEventListener('dragstart', preventNativeDrag);

                // Очистка сброшенных стилей
                row.style.position = '';
                row.style.top = '';
                row.style.left = '';
                row.style.width = '';
                row.style.zIndex = '';
                row.style.pointerEvents = '';
                row.style.transition = '';
                row.style.transform = '';
                row.style.boxShadow = '';
                row.classList.remove('dragging-row');

                // Возвращаем строку на место плейсхолдера и сразу его удаляем
                if (placeholder && placeholder.parentElement) {
                    container.insertBefore(row, placeholder);
                    placeholder.remove();
                }
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        const controls = document.createElement('div');
        controls.className = 'tier-controls';

        const minusBtn = document.createElement('button');
        minusBtn.className = 'tier-control-btn delete';
        minusBtn.innerHTML = '&minus;';
        minusBtn.title = 'Удалить категорию';
        minusBtn.onclick = () => {
            const pool = document.querySelector('.tier-pool');
            if (pool) {
                while (dropZone.firstChild) {
                    pool.appendChild(dropZone.firstChild);
                }
            }
            row.remove();
        };

        const gearBtn = document.createElement('button');
        gearBtn.className = 'tier-control-btn gear';
        gearBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';
        gearBtn.title = 'Настроить цвет';
        
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = tier.color || "#cccccc";
        colorInput.style.position = 'absolute';
        colorInput.style.opacity = '0';
        colorInput.style.pointerEvents = 'none';
        
        colorInput.addEventListener('input', (e) => {
            label.style.backgroundColor = e.target.value;
        });

        gearBtn.appendChild(colorInput);
        gearBtn.onclick = (e) => {
            if (e.target !== colorInput) colorInput.click();
        };

        const plusBtn = document.createElement('button');
        plusBtn.className = 'tier-control-btn add';
        plusBtn.innerHTML = '&plus;';
        plusBtn.title = 'Добавить новую категорию под этой';
        plusBtn.onclick = () => {
            const newRow = createTierRow({ id: "Новая", color: "#cccccc" });
            row.after(newRow); 
        };

        controls.appendChild(minusBtn);
        controls.appendChild(gearBtn);
        controls.appendChild(plusBtn);

        row.appendChild(label);
        row.appendChild(dropZone);
        row.appendChild(controls);

        return row;
    }

    function renderTierList(container) {
        container.innerHTML = ''; 

        const rowsContainer = document.createElement('div');
        rowsContainer.id = 'tier-rows-container';
        rowsContainer.style.position = 'relative';
        container.appendChild(rowsContainer);

        tierRowsData.forEach(tier => {
            rowsContainer.appendChild(createTierRow(tier));
        });

        const divider = document.createElement('div');
        divider.className = 'modal-divider';
        container.appendChild(divider);

        const poolZone = document.createElement('div');
        poolZone.className = 'tier-pool';
        poolZone.dataset.zone = 'pool'; 
        attachDragEvents(poolZone); 

        tierItemsData.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'tier-item-card';
            card.draggable = true; 
            card.id = 'tier-item-' + index;
            
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.name;
            img.title = item.name;

            card.appendChild(img);
            poolZone.appendChild(card);
            
            card.addEventListener('dragstart', handleDragStart);
            card.addEventListener('dragend', handleDragEnd);
        });

        container.appendChild(poolZone);
    }

    let draggedItem = null;

    function handleDragStart(e) {
        draggedItem = this;
        setTimeout(() => this.classList.add('dragging'), 0);
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        draggedItem = null;
        document.querySelectorAll('.drag-over').forEach(zone => zone.classList.remove('drag-over'));
    }

    function handleDragOver(e) {
        e.preventDefault(); 
        this.classList.add('drag-over');
    }

    function handleDragLeave(e) {
        this.classList.remove('drag-over');
    }

    function handleDrop(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        if (draggedItem) {
            this.appendChild(draggedItem);
        }
    }
});