// const baseURL = "https://acnhapi.com/v1a";
const baseURL = "https://api.nookipedia.com";
const apiKey = "84cfa779-c2f0-4655-85fc-f8bb8de9bc1f";
const baseTranslateFR = "EUfr";
const baseTranslateUS = "USen";
const main = document.querySelector(".main");
const mainTitle = document.querySelector(".mainTitle");
const menu = document.querySelector(".menu");

async function getVillagers() {
    menu.remove();
    mainTitle.innerText = "Listes des villageois";
    // ---- DATA SECTION ----
    // LOAD DATA
    const villagers = await fetch(`${baseURL}/villagers?nhdetails=true&game=nh&api_key=${apiKey}`);
    const dataVillagers = await villagers.json();
    console.log("dataVillagers :");
    console.log(dataVillagers);

    // ---- TRANSLATIONS SECTION ----
    // LOAD TRANSLATIONS VILLAGER
    const villagersTranslation = await fetch("../json/translations/Villagers.json");
    const dataVillagersTranslation = await villagersTranslation.json();
    console.log("dataVillagersTranslation :");
    console.log(dataVillagersTranslation);
    // LOAD TRANSLATIONS VILLAGER CATCH PHRASE
    const villagersCatchPhraseTranslations = await fetch("../json/translations/Villager Catchphrases.json");
    const dataVillagersCatchPhraseTranslations = await villagersCatchPhraseTranslations.json();
    console.log("dataVillagersCatchPhraseTranslations :");
    console.log(dataVillagersCatchPhraseTranslations);
    // LOAD TRANSLATIONS SPECIES
    // TODO : Crée le JSON permettant la traduction des espèces des villageois. (../json/translations/Species.json)
    // const speciesVilTranslations = await fetch("../json/translations/");

    const searchVillager = document.createElement("div");
    searchVillager.classList.add("divRechercherVil")
    searchVillager.innerHTML = `
    <input type="text" onkeyup="rechercherVil()" id="maRechercheVillageois" name="search"
        placeholder="Rechercher un villageois.." autocomplete="off"
        aria-label="Rechercher un villageois d'acnh parmi le contenu du site"/>
    `

    const divVillagers = document.createElement("div");
    divVillagers.classList.add("villagers");

    for (i = 0; i < dataVillagers.length; i++ ) {
        const divVillager = document.createElement("div");
        divVillager.classList.add("card-villager");

        const divDetailVillager = document.createElement("div");
        divDetailVillager.classList.add("card-detail-villager");
        divDetailVillager.style.backgroundColor = `#${dataVillagers[i].title_color}`

        const logoVil = document.createElement("img");
        logoVil.src = `${dataVillagers[i].nh_details.icon_url}`;

        const frenchDetailNameVil = document.createElement("p");
        frenchDetailNameVil.classList.add("frenchDetailNameVil");

        const catchPhraseVil = document.createElement("p")
        catchPhraseVil.classList.add("catchPhraseVil");
        catchPhraseVil.innerText = `"${dataVillagers[i].phrase}"`;

        const divDetailsVil = document.createElement("div");
        divDetailsVil.classList.add("detailsVil");
        const speciesVil = document.createElement("span");
        speciesVil.innerHTML = `<i class="fa-sharp fa-solid fa-paw"></i> ${dataVillagers[i].species}`;
        const colors = document.createElement("div");
        colors.classList.add("colorsVil");
        const txtColors = document.createElement("span");
        txtColors.classList.add("txtColors");
        txtColors.innerText = "Couleurs :";
        const color1 = document.createElement("span");
        color1.classList.add("color1");
        color1.innerText = `${dataVillagers[i].nh_details.fav_colors[0]}`;
        if (dataVillagers[i].nh_details.fav_colors[0] === "Colorful") {
            color1.style.background = "url(../img/color_gradient.jpg)";
            color1.style.backgroundSize = "cover";
        } else {
            color1.style.backgroundColor = `${dataVillagers[i].nh_details.fav_colors[0]}`;
        }
        const color2 = document.createElement("span");
        color2.classList.add("color2");
        if(dataVillagers[i].nh_details.fav_colors[1]) {
            color2.innerText = `${dataVillagers[i].nh_details.fav_colors[1]}`;
            if (dataVillagers[i].nh_details.fav_colors[1] === "Colorful") {
                color2.style.background = "url(../img/color_gradient.jpg)";
                color2.style.backgroundSize = "cover";
            } else {
                color2.style.backgroundColor = `${dataVillagers[i].nh_details.fav_colors[1]}`;
            }
        } else {
            color2.classList.add("noColor");
        }
        if (color2.classList.contains("noColor")) {
            colors.append(txtColors, color1);
        } else {
            colors.append(txtColors, color1, color2);
        }
        const stylesVil = document.createElement("div");
        stylesVil.classList.add("stylesVil");
        if (dataVillagers[i].nh_details.fav_styles.length === 1) {
            stylesVil.innerHTML = `
                <span>Styles : </span>
                <span>${dataVillagers[i].nh_details.fav_styles[0]}</span>
                `;
            } else {
                stylesVil.innerHTML = `
                <span>Styles : </span>
                <span>${dataVillagers[i].nh_details.fav_styles[0]}</span>
                <span>${dataVillagers[i].nh_details.fav_styles[1]}</span>
            `;
        }
        
        
        divDetailsVil.append(speciesVil, colors, stylesVil);

        divDetailVillager.append(logoVil, frenchDetailNameVil, catchPhraseVil, divDetailsVil);
        

        const divBirthday = document.createElement("div");
        divBirthday.classList.add("birthdayVil")
        divBirthday.innerHTML = `
        <i class="fa-solid fa-cake-candles"></i>
        <p>${dataVillagers[i].birthday_day} ${dataVillagers[i].birthday_month}</p>
        `

        const nameVillager = document.createElement("div");
        nameVillager.classList.add("namesVil")
        if (dataVillagers[i].gender === "Female") {
            nameVillager.innerHTML = `<p class="nameVil">${dataVillagers[i].name}</p><i class="fa-solid fa-venus"></i>`
        } else {
            nameVillager.innerHTML = `<p class="nameVil">${dataVillagers[i].name}</p><i class="fa-solid fa-mars"></i>`
        }
        const nameFrenchVillager = document.createElement("p");
        nameFrenchVillager.classList.add("frenchNameVil");
        const imgVillager = document.createElement("img");
        imgVillager.classList.add("imgVil");
        imgVillager.src = `${dataVillagers[i].nh_details.photo_url}`;
        // imgVillager.crossOrigin = "anonymous";
        divVillager.append(divDetailVillager, divBirthday, nameVillager, nameFrenchVillager, imgVillager);
        divVillagers.append(divVillager);


        // Boucle qui permet de vérifier le nom anglais avec le nom anglais de la traduction pour ensuite mettre le nom en francais du villageois. J'utilise la boucle pour le nom afficher sur la card et sur le detail de la card (au survol de la souris).
        for (let j = 0; j < dataVillagersTranslation.length; j++) {
            if (dataVillagersTranslation[j].USen == dataVillagers[i].name) {
                nameFrenchVillager.innerText = `${dataVillagersTranslation[j].EUfr}`;
                frenchDetailNameVil.innerText = `${dataVillagersTranslation[j].EUfr}`;
            }
        }
        // Idem qu'en haut avec la "catchphrase" du villageois.
        for (j = 0; j < dataVillagersCatchPhraseTranslations.length; j++) {
            if (dataVillagersCatchPhraseTranslations[j].USen == dataVillagers[i].phrase) {
                catchPhraseVil.innerText = `"${dataVillagersCatchPhraseTranslations[j].EUfr}"`;
            }
        } 
    }
    
    main.append(searchVillager, divVillagers);

    // Ici je gère les couleurs avec chroma.js
    const favoritesColor1Vil = document.querySelectorAll(".color1");
    const favoritesColor2Vil = document.querySelectorAll(".color2");
    for (i = 0; i < favoritesColor1Vil.length; i++) {
        const txtColor1 = favoritesColor1Vil[i].innerText
        if (txtColor1 != "Colorful") {
            const color1Bg = chroma(favoritesColor1Vil[i].style.backgroundColor);
            if (chroma.contrast(color1Bg, 'black') > chroma.contrast(color1Bg, 'white')) {
                favoritesColor1Vil[i].style.color = "black";
            } else {
                favoritesColor1Vil[i].style.color = "white";
            }
        }
    }
    for (i = 0; i < favoritesColor2Vil.length; i++) {
        const txtColor2 = favoritesColor2Vil[i].innerText
        if (txtColor2 != "Colorful") {
            const color2Bg = chroma(favoritesColor2Vil[i].style.backgroundColor);
            if (chroma.contrast(color2Bg, 'black') > chroma.contrast(color2Bg, 'white')) {
                favoritesColor2Vil[i].style.color = "black";
            } else {
                favoritesColor2Vil[i].style.color = "white";
            }
        }
    }
}

function rechercherVil() {
    let userValue = document.getElementById("maRechercheVillageois").value;
    userValue = userValue.toLowerCase();
    let namesVillager = document.querySelectorAll(".nameVil");
    let frenchNamesVillager = document.querySelectorAll(".frenchNameVil");
    let cardsVillager = document.querySelectorAll(".card-villager");

    for (i = 0; i < namesVillager.length; i++) {
        if (!namesVillager[i].innerHTML.toLowerCase().includes(userValue) 
            && !frenchNamesVillager[i].innerHTML.toLowerCase().includes(userValue)) {
            cardsVillager[i].style.display = "none";
        }
        else {
            cardsVillager[i].style.display = "inline-block";
        }
    }
}