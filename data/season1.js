seasons.push({
    id: 1,
    date: "Август 2023",
    dateValue: "2023.8",
    title: "Сезон 1",
    version: "Майнкрафт 1.20.1",
    
    // Картинка, которая показывается на таймлайне при наведении (можно несколько для рандома)
    randomImages: [
        "images/season1/2023-08-26_20.01.22.png",
        "images/season1/2023-08-31_21.25.29.png" ,
        "images/season1/2023-08-31_21.26.04.png" ,
        "images/season1/2023-08-31_21.26.17.png" ,
        "images/season1/2023-08-31_21.26.25.png" ,
        "images/season1/2023-08-31_21.26.37.png" ,
        "images/season1/2023-08-31_21.26.48.png" ,
        "images/season1/2023-08-31_21.26.58.png"
    ],

    // 1. Твой ручной порядок текста и картинок в модалке
    content: [
        {
            type: "text",
            value: "Этот сезон начался от того что мы решили поиграть в майнкрафт с жителями торговцами. Обустроеный спавн сервера на момент 26 августа."
        },
        {
            type: "image",
            url: "images/season1/2023-08-26_20.01.22.png",
            caption: "Тут видны дома Mes sneget_ ферма тростника и ферма ягод. 26 Августа."
        },
        {
            type: "text",
            value: "Была возможность покупать летающие надписи."
        },
        {
            type: "image",
            urls: [
            "images/season1/2023-08-29_21-47-44.png",
            "images/season1/2023-08-31_21.26.04.png"
        ],
            caption: "Дом Данила и он сам. 29 Августа."
        },
        {
            type: "text",
            value: "Семён смог заполучить бэдрок и устроил пранк над админом. Завозик по нападению на дом админа не удался."
        },
        {
            type: "image",
            url: "images/season1/2023-09-01_20-21-55.png",
            caption: "Хулиганы напали на дома Егора. 1 Сентября."
        },
        {
            type: "image",
            url: "images/season1/2023-08-31_21.26.25.png",
            caption: "Казино Семёна. 31 Августа."
        },
        {
            type: "image",
            url: "images/season1/2023-08-25_15-22-16.png",
            caption: "Воришка в доме Семёна. 25 Августа."
        },
        {
            type: "players",
            title: "Состав участников:",
            list: [
                { name: "Mes4000", head: "images/heads/mes.png", altNames: ["Mes4000", "mes", "Семён", "Глиномес", "Мес"] },     // Получит случайную голову из папки heads
                { name: "sneget_", head: "images/heads/sneget.png", altNames: ["sneget_", "Егор", "снегет", "снегр"]  },       // Получит случайную голову из папки heads
                { name: "danil_lisov", head: "images/heads/danil.jpg", altNames: ["danil_lisov", "tayen_42", "tayen_52", "Данил"]  } ,   // Получит случайную голову из папки heads
                { name: "Zar0813", altNames: ["Zar0813", "зар", "Захар"]  },    
                "anhcous0018"

            ]
        }   
    ],

    // 2. ВСЕ картинки этого сезона (нужно для автоматического хвоста в конце)
    allImages: [
        "images/season1/2023-08-24_18-11-37.png",
        "images/season1/2023-08-25_15-22-16.png",
        "images/season1/2023-08-25_15-28-22.png",
        "images/season1/2023-08-26_20.01.22.png",
        "images/season1/2023-08-27_00-26-53.png",
        "images/season1/2023-08-29_21-47-44.png",
        "images/season1/2023-08-31_21.25.29.png",
        "images/season1/2023-08-31_21.26.04.png",
        "images/season1/2023-08-31_21.26.17.png",
        "images/season1/2023-08-31_21.26.25.png",
        "images/season1/2023-08-31_21.26.37.png",
        "images/season1/2023-08-31_21.26.48.png",
        "images/season1/2023-08-31_21.26.58.png",
        "images/season1/2023-09-01_01-18-37.png",
        "images/season1/2023-09-01_01-20-43.png",
        "images/season1/2023-09-01_20-21-55.png",
        "images/season1/image (1).png",
        "images/season1/image (2).png",
        "images/season1/image.png"
    ],
    
    worldLink: ""
});