seasons.push({
    id: 1,
    date: "Февраль 2024",
    dateValue: "2024.2",
    title: "Сезон 3",
    version: "Майнкрафт 1.20.1",
    
    // Картинка, которая показывается на таймлайне при наведении (можно несколько для рандома)
    randomImages: [
        "images/season3/02.02.2024.png",
        "images/season3/15.02.2024.png" ,
        "images/season3/16.02.2024.png" ,
        "images/season3/18.02.2024.png" ,
        "images/season3/232.png" ,
        "images/season3/Base_Profile_Screenshot_2024.02.08_-_15.24.00.25.png" ,
        "images/season3/image (1).png" ,
        "images/season3/image (2).png" ,
        "images/season3/image.png" ,
        "images/season3/image1.png"
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
                { name: "Mes4000", head: "images/heads/mes.png", altNames: ["Mes4000", "mes", "Семён", "Глиномес", "Мес"] },     // Получит случайную голову из папки heads
                { name: "sneget_", head: "images/heads/sneget.png", altNames: ["sneget_", "Егор", "снегет", "снегр"]  },       // Получит случайную голову из папки heads
                { name: "danil_lisov", head: "images/heads/danil.jpg", altNames: ["danil_lisov", "tayen_42", "tayen_52", "Данил"]  } ,
                { name: "Shuranella", head: "images/heads/shuraneli.png", altNames: ["Shuranella", "Шершуля", "жир", "Чурчхела", "Саня", "Сасаня" ] } ,
                { name: "Saba228", altNames: ["Saba228", "Сава", "свиноблуд"] },
                { name: "Maksos_0909", altNames: ["Maksos_0909", "Максос", "Maksimka"] },
                { name: "KiberNagibator", altNames: ["KiberNagibator", "Лапша", "Насвай", "o da doza"]  }, 
                { name: "Jerty", altNames: ["Jerty", "Арсений", "Montana", "jez3as"]  },  // Получит случайную голову из папки heads
                { name: "Nikita_criptomainer", altNames: ["Nikita_criptomainer", "Железный Никита"] }

            ]
        }
    ],

    // 2. ВСЕ картинки этого сезона (нужно для автоматического хвоста в конце)
    allImages: [
        "images/season3/02.02.2024.png",
        "images/season3/15.02.2024.png" ,
        "images/season3/16.02.2024.png" ,
        "images/season3/18.02.2024.png" ,
        "images/season3/232.png" ,
        "images/season3/Base_Profile_Screenshot_2024.02.08_-_15.24.00.25.png" ,
        "images/season3/image (1).png" ,
        "images/season3/image (2).png" ,
        "images/season3/image.png" ,
        "images/season3/image1.png"
    ],
    
    worldLink: "https://drive.google.com/file/d/1dyr7HOxXaydk2Nbcdeo8yLzMax0u-4Wa/view?usp=sharing"
});