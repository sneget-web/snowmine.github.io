seasons.push({
    id: 1,
    date: "Январь 2024",
    dateValue: "2024.1",
    title: "Сезон 2",
    version: "Майнкрафт 1.20.1",
    
    // Картинка, которая показывается на таймлайне при наведении (можно несколько для рандома)
    randomImages: [
        "images/season2/14.01.2024.png",
        "images/season2/2024-01-13_23-14-34.png" ,
        "images/season2/2024-01-14_19-47-05.png" ,
        "images/season2/2024-01-15_20.44.12.png" ,
        "images/season2/2024-01-15_22-44-22.png" ,
        "images/season2/2024-01-15_22-44-35.png" ,
        "images/season2/2024-01-16_21-42-55.png" ,
        "images/season2/2024-01-16_21-45-15.png"
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
                { name: "danil_lisov", head: "images/heads/!danil.webp", altNames: ["danil_lisov", "tayen_42", "tayen_52", "Данил"]  } ,   // Получит случайную голову из папки heads
                { name: "Zar0813", altNames: ["Zar0813", "зар", "зар танк", "Захар"]  }, 
                "anhcous0018"   ,
                { name: "KiberNagibator", altNames: ["KiberNagibator", "Лапша", "Насвай", "o da doza"]  },
                { name: "Jerty", altNames: ["Jerty", "Арсений", "Montana", "Жирти", "Жирнов", "Джирти", "jez3as"]  },
                { name: "Saba228", altNames: ["Saba228", "Сава", "Повар"] },
                { name: "Maksos_0909", altNames: ["Maksos_0909", "Максос", "Maksimka", "Макс", "Максим"] },
                { name: "Bebronix45", altNames: ["Bebronix45", "Марк", "Маркер"] }
            ]
        }
    ],

    // 2. ВСЕ картинки этого сезона (нужно для автоматического хвоста в конце)
    allImages: [
        "images/season2/14.01.2024.png",
        "images/season2/2024-01-13_23-14-34.png" ,
        "images/season2/2024-01-14_19-47-05.png" ,
        "images/season2/2024-01-15_20.44.12.png" ,
        "images/season2/2024-01-15_22-44-22.png" ,
        "images/season2/2024-01-15_22-44-35.png" ,
        "images/season2/2024-01-16_21-42-55.png" ,
        "images/season2/2024-01-16_21-45-15.png"
    ],
    
    worldLink: ""
});