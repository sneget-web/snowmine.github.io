seasons.push({
    id: 1,
    date: "Сентябрь 2023",
    dateValue: "2023.9",
    title: "Сезон Стоун Блок",
    version: "StoneBlock1 1.12.2",
    
    // Картинка, которая показывается на таймлайне при наведении (можно несколько для рандома)
    randomImages: [
        "images/season1SB/2023-09-09_23-45-20.png",
        "images/season1SB/2023-10-05_21-52-39.png",
        "images/season1SB/2023-10-11_22-50-13.png",
        "images/season1SB/2023-10-13_18-15-31.png"
    ],

    // 1. Твой ручной порядок текста и картинок в модалке
    content: [
        {
            type: "text",
            value: "Об этом сезоне будет написано позже."
        },
        {
            type: "players",
            title: "Состав участников:",
            list: [
                { name: "Mes4000", head: "images/heads/!mes.webp", altNames: ["Mes4000", "mes", "Семён", "Глиномес", "Мес"] },     // Получит случайную голову из папки heads
                { name: "sneget_", head: "images/heads/!sneget.webp", altNames: ["sneget_", "Егор", "снегет", "снегр"]  },       // Получит случайную голову из папки heads
                { name: "danil_lisov", head: "images/heads/!danil.webp", altNames: ["danil_lisov", "tayen_42", "tayen_52", "Данил"]  } 
            ]
        }
    ],

    // 2. ВСЕ картинки этого сезона (нужно для автоматического хвоста в конце)
    allImages: [
        "images/season1SB/2023-09-09_23-45-20.png",
        "images/season1SB/2023-10-05_21-52-39.png",
        "images/season1SB/2023-10-11_22-50-13.png",
        "images/season1SB/2023-10-13_18-15-31.png"
    ],
    
    worldLink: ""
});