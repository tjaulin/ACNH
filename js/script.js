const baseURL = "https://api.nookipedia.com";
const apiKey = "84cfa779-c2f0-4655-85fc-f8bb8de9bc1f";
const baseTranslateFR = "EUfr";
const baseTranslateUS = "USen";
const main = document.querySelector(".main");
const mainTitle = document.querySelector(".mainTitle");
const menu = document.querySelector(".menu");
const body = document.getElementById("body");

async function getVillagers() {
    menu.remove();
    mainTitle.innerText = "Listes des villageois";
    mainTitle.style.margin = "80px 0 40px 0"
    afficherLoader();

    // Création du modal qui va contenir absolument tout les éléments que va contenir un villageois
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
        <div class="modal-content">
            <div class="navbarModalVil">
                <div class="divModalIconVil"></div>
                <div class="divTitleVil">
                    <p class="modalNameVil"></p>
                    <p class="modalFrenchName"></p>
                </div>
                <div class="divModalClose">
                <span class="close">&times;</span>
                </div>
            </div>
            <hr class="hrModalDetailsVil">
            <div class="divModalInfos">
                <div class="divModalPhotosVil">
                <div class="divModalPosterVil"></div>
                    <div class="divModalImageVil"></div>
                    </div>
                    <div class="divModalDetails"></div>
            </div>
            <div class="divModalHousePicturesVil">
                <div class="divModalExteriorHouseVil"></div>
                <div class="divModalInteriorHouseVil"></div>
                </div>
        </div>
        `;
        main.append(modal);
        
    
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
    // LOAD K.K. MUSIC
    const kkMusic = await fetch("../json/Music.json");
    const dataKKMusic = await kkMusic.json();
    console.log("dataKKMusic :");
    console.log(dataKKMusic);
    
    const loader = document.querySelector("#loader");
    loader.remove();

    
    const searchVillager = document.createElement("div");
    searchVillager.classList.add("divRechercherVil")
    searchVillager.innerHTML = `
    <input type="text" onkeyup="rechercherVil()" id="maRechercheVillageois" name="search"
    placeholder="Rechercher un villageois.." autocomplete="off"
        aria-label="Rechercher un villageois d'acnh parmi le contenu du site"/>
        <span class="input-border"></span>
        `
        
        const divVillagers = document.createElement("div");
        divVillagers.classList.add("villagers");
        
        for (i = 0; i < dataVillagers.length; i++ ) {
        const divVillager = document.createElement("div");
        divVillager.classList.add("card-villager");
        let villager = dataVillagers[i];
        divVillager.addEventListener("click", function(){
            // MODAL NAVBAR
            const closeBtn = document.getElementsByClassName("close")[0];
            const divModalIconVil = document.querySelector(".divModalIconVil");
            const modalNameVil = document.querySelector(".modalNameVil");
            const modalFrenchName = document.querySelector(".modalFrenchName");
            
            divModalIconVil.innerHTML = `
                <img src="${villager.nh_details.icon_url}" alt="Icone de ${villager.name}" />
            `;
            if (villager.gender === "Female") {
                modalNameVil.innerHTML = `${villager.name} <i class="fa-solid fa-venus"></i>`
            } else {
                modalNameVil.innerHTML = `${villager.name} <i class="fa-solid fa-mars"></i>`
            }
            for (let j = 0; j < dataVillagersTranslation.length; j++) {
                if (dataVillagersTranslation[j].USen == villager.name) {
                    modalFrenchName.innerText = dataVillagersTranslation[j].EUfr;
                }
            }

            // MODAL PHOTOS 
            const divModalPosterVil = document.querySelector(".divModalPosterVil");
            const divModalImageVil = document.querySelector(".divModalImageVil");
            
            divModalPosterVil.innerHTML = `
            <p>Poster :</p>
            <img src="${villager.nh_details.photo_url}" alt="Poster de ${villager.name}"/>
            `;
            divModalImageVil.innerHTML = `
            <p>Image :</p>
            <img src="${villager.nh_details.image_url}" alt="Image de ${villager.name}"/>
            `;

            // MODAL DETAILS
            const divModalDetails = document.querySelector(".divModalDetails");
            let frenchCatchPhrase = "";
            for (j = 0; j < dataVillagersCatchPhraseTranslations.length; j++) {
                if (dataVillagersCatchPhraseTranslations[j].USen == villager.phrase) {
                    frenchCatchPhrase = `"${dataVillagersCatchPhraseTranslations[j].EUfr}"`;
                }
            } 

            const colors = divVillager.querySelector(".colorsVil");
            
            const styles = villager.nh_details.fav_styles;
            let style1 = "";
            let style2 = "";
            if (styles.length > 1) {
                style1 = styles[0];
                style2 = styles[1];
            } else {
                style1 = styles[0];
            }

            divModalDetails.innerHTML = `
                <h2>Details</h2>
                <p class="modalBirthdayVil">Birthday : <span> ${villager.birthday_day} ${villager.birthday_month}</span> <img src="${getZodiacSignVil(villager.sign)}" alt="${villager.name} zodiac sign" title="${villager.sign}"/></p>
                <p class="modalCatchPhraseVil">Catchphrase : <span>${frenchCatchPhrase}</span></p>
                <p class="modalSpeciesVil">Species : <span>${villager.species}</span></p>
                <p class="modalPersonnalityVil">Personality : <span>${villager.personality}</span></p>
                <div class="divModalColorsVil"> 
                    <p class="modalColorsVil">Colors : </p>
                    ${getColor(colors)}
                </div>
                <p class="modalStylesVil">Styles : <span class="style1">${style1}</span> <span class="style2">${style2}</span></p>
                <p class="modalHobbyVil">Hobby : <span>${villager.nh_details.hobby}</span></p>
                <p class="modalMusicVil">Music : <img class="modalFavCoverSongVil" title="${villager.nh_details.house_music}" src="${getCoverKKSong(villager.nh_details.house_music, dataKKMusic)}" alt="Cover KK Song" /></p>
            `;

            // MODAL HOUSE PICTURE
            const divModalExteriorHouseVil = document.querySelector(".divModalExteriorHouseVil");
            const divModalInteriorHouseVil = document.querySelector(".divModalInteriorHouseVil");

            divModalExteriorHouseVil.innerHTML = `
                <a href="#${villager.name.toLowerCase()}_exterior_house">
                    <img src="${villager.nh_details.house_exterior_url}" alt="Extérieur de la maison de ${villager.name}"/>
                </a>
                <div id="${villager.name.toLowerCase()}_exterior_house" class="lightbox">
                    <img src="${villager.nh_details.house_exterior_url}" alt="Extérieur de la maison de ${villager.name}"/>
                    <a href="#" class="close-btn">&times;</a>
                </div>
            `;
            divModalInteriorHouseVil.innerHTML = `
                <a href="#${villager.name.toLowerCase()}_interior_house">
                    <img src="${villager.nh_details.house_interior_url}" alt="Intérieur de la maison de ${villager.name}"/>
                </a>
                <div id="${villager.name.toLowerCase()}_interior_house" class="lightbox">
                    <img src="${villager.nh_details.house_interior_url}" alt="Intérieur de la maison de ${villager.name}"/>
                    <a href="#" class="close-btn">&times;</a>
                </div>
            `;

            modal.style.display = "block";
            body.classList.add("active-modal");

            closeBtn.onclick = function() {
                modal.style.display = "none";
                body.classList.remove("active-modal");
            }

        })

        const divDetailVillager = document.createElement("div");
        divDetailVillager.classList.add("card-detail-villager");
        divDetailVillager.style.backgroundColor = `#${dataVillagers[i].title_color}`

        const iconVil = document.createElement("img");
        iconVil.classList.add("iconVil");
        iconVil.src = `${dataVillagers[i].nh_details.icon_url}`;

        const frenchDetailNameVil = document.createElement("p");
        frenchDetailNameVil.classList.add("frenchDetailNameVil");

        const catchPhraseVil = document.createElement("p")
        catchPhraseVil.classList.add("catchPhraseVil");
        catchPhraseVil.innerText = `"${dataVillagers[i].phrase}"`;

        const divDetailsVil = document.createElement("div");
        divDetailsVil.classList.add("detailsVil");
        const speciesVil = document.createElement("div");
        speciesVil.classList.add("speciesVil");
        speciesVil.innerHTML = `<i class="fa-sharp fa-solid fa-paw"></i> <span>${dataVillagers[i].species}</span>`;
        const personalityVil = document.createElement("div");
        personalityVil.classList.add("personalityVil");
        personalityVil.innerHTML = `
            <img class="iconPersonality" src="${getIconPersonality(dataVillagers[i].personality)}" alt="icon personality" />
            <span>${dataVillagers[i].personality}
        `;
        const colors = document.createElement("div");
        colors.classList.add("colorsVil");
        colors.innerHTML = `
            <i class="fa-solid fa-palette"></i>
        `;
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
            colors.append(color1);
        } else {
            colors.append(color1, color2);
        }
        const hobbyVil = document.createElement("div");
        hobbyVil.classList.add("hobbyVil");
        hobbyVil.innerHTML = `
            ${getHobbyIcon(dataVillagers[i].nh_details.hobby)}
            <span>${dataVillagers[i].nh_details.hobby}</span>
        `;
        const stylesVil = document.createElement("div");
        stylesVil.classList.add("stylesVil");
        if (dataVillagers[i].nh_details.fav_styles.length === 1) {
            stylesVil.innerHTML = `
                <i class="fa-solid fa-shirt"></i>
                <span class="style1">${dataVillagers[i].nh_details.fav_styles[0]}</span>
                `;
            } else {
                stylesVil.innerHTML = `
                <i class="fa-solid fa-shirt"></i>
                <span class="style1">${dataVillagers[i].nh_details.fav_styles[0]}</span>
                <span class="style2">${dataVillagers[i].nh_details.fav_styles[1]}</span>
            `;
        }
        const favMusicVil = document.createElement("div");
        favMusicVil.classList.add("favMusicVil");
        favMusicVil.innerHTML = `
            <img class="favCoverSongVil" src="${getCoverKKSong(dataVillagers[i].nh_details.house_music, dataKKMusic)}" alt="Cover KK Song" />
            <span>${dataVillagers[i].nh_details.house_music}</span>
        `;
        
        divDetailsVil.append(speciesVil, personalityVil, colors, hobbyVil, stylesVil, favMusicVil);

        const hrQuote = document.createElement("hr");
        hrQuote.classList.add("hrQuoteVil");
        const divQuote = document.createElement("div");
        divQuote.classList.add("divQuoteVil");
        divQuote.innerHTML = `
            <p>« ${dataVillagers[i].nh_details.quote} »</p>
        `;

        divDetailVillager.append(iconVil, frenchDetailNameVil, catchPhraseVil, divDetailsVil, hrQuote, divQuote);
        

        const divBirthday = document.createElement("div");
        divBirthday.classList.add("birthdayVil")
        divBirthday.innerHTML = `
        <i class="fa-solid fa-cake-candles"></i>
        <p>${dataVillagers[i].birthday_day} ${dataVillagers[i].birthday_month}</p>
        <img class="iconZodiacSignVil" src="${getZodiacSignVil(dataVillagers[i].sign)}" alt="Signe du zodiac"/>
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

    const hrQuotesVil = document.querySelectorAll(".hrQuoteVil");
    const AllCardDetailVillager = document.querySelectorAll(".card-detail-villager");
    for(i = 0; i < AllCardDetailVillager.length; i++) {
        const bgColorCard = chroma(AllCardDetailVillager[i].style.backgroundColor);
        hrQuotesVil[i].style.backgroundColor = chroma(bgColorCard).darken();
    }

    // Ici je gère l'affichage des détails des cards
    const stylesVil = document.querySelectorAll(".stylesVil");
    for(i = 0; i < stylesVil.length; i++) {
        const depassement = stylesVil[i].offsetWidth < stylesVil[i].scrollWidth;
        const style2 = stylesVil[i].querySelector(".style2");
        if (style2 !== null) {
            if (depassement) {
                style2.title = style2.innerText;
                style2.innerText = "+1"
            }
          }
    }
    
}

// Fonction qui permet le fonctionnement de la barre de recherche d'un villageois. Je compare le nom anglais et français a chaque fois que je tape une touche, si cela ne correspond pas je lui attribue un display none pour le désafficher. Sinon je lui met/remet un display inline-block pour le remettre sur l'écran.
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

// Je récupère via "personality" la personnalité de chaque villageois pour ensuite lui attribuer la bonne URL avec la bonne icone de personnalité
function getIconPersonality(personality) {
    let link = "";
    switch (personality) {
        case 'Smug':
            link = "../img/icons/personalities/smug_icon.png"
            break;
        case 'Big sister':
            link = "../img/icons/personalities/bigSister_icon.png"
            break;
        case 'Cranky':
            link = "../img/icons/personalities/cranky_icon.png"
            break;
        case 'Jock':
            link = "../img/icons/personalities/jock_icon.png"
            break;
        case 'Lazy':
            link = "../img/icons/personalities/lazy_icon.png"
            break;
        case 'Normal':
            link = "../img/icons/personalities/normal_icon.png"
            break;
        case 'Peppy':
            link = "../img/icons/personalities/peppy_icon.png"
            break;
        case 'Snooty':
            link = "../img/icons/personalities/snooty_icon.png"
            break;
        default:
            link = "../img/icons/personalities/smug_icon.png"
            break;
    }
    return link;
}

function getHobbyIcon(hobby) {
    let icon = "";
    switch (hobby) {
        case 'Fitness':
            icon = '<i class="fa-sharp fa-solid fa-dumbbell iconHobbyVil"></i>'
            break;
        case 'Nature':
            icon = '<i class="fa-solid fa-leaf iconHobbyVil"></i>'
            break;
        case 'Education':
            icon = '<i class="fa-sharp fa-solid fa-book iconHobbyVil"></i>'
            break;
        case 'Music':
            icon = '<i class="fa-solid fa-music iconHobbyVil"></i>'
            break;
        case 'Play':
            icon = '<i class="fa-solid fa-gamepad iconHobbyVil"></i>'
            break;
        case 'Fashion':
            icon = '<i class="fa-solid fa-shirt iconHobbyVil"></i>'
            break;
        default:
            icon = '<i class="fa-regular fa-dice iconHobbyVil"></i>'
            break;
    }
    return icon;
}

function getCoverKKSong(favMusicVil, dataKKMusic) {
    for(let i = 0; i < dataKKMusic.length; i++) {
        if (favMusicVil === dataKKMusic[i].name) {
            return dataKKMusic[i].framedImage
        }
        // TODO : Gérer les erreurs (Ici si on a pas d'image, ou si la correspondance n'est pas trouver)
    } 
}

function getZodiacSignVil(zodiacSign) {
    switch (zodiacSign) {
        case 'Aries':
            return "../img/icons/zodiac/Bélier.png";
        case 'Taurus':
            return "../img/icons/zodiac/Taureau.png";
        case 'Gemini':
            return "../img/icons/zodiac/Gémeaux.png";
        case 'Cancer':
            return "../img/icons/zodiac/Cancer.png";
        case 'Leo':
            return "../img/icons/zodiac/Lion.png";
        case 'Virgo':
            return "../img/icons/zodiac/Vierge.png";
        case 'Libra':
            return "../img/icons/zodiac/Balance.png";
        case 'Scorpio':
            return "../img/icons/zodiac/Scorpion.png";
        case 'Sagittarius':
            return "../img/icons/zodiac/Sagittaire.png";
        case 'Capricorn':
            return "../img/icons/zodiac/Capricorne.png";
        case 'Aquarius':
            return "../img/icons/zodiac/Verseau.png";
        case 'Pisces':
            return "../img/icons/zodiac/Poisson.png";
        default :
            return '../img/icons/zodiac/Balance.png'
    }
}

function getColor(colors) {
    const color1 = colors.querySelector(".color1");
    const color2 = colors.querySelector(".color2");
    if (color1 && color2) {
        return `${color1.outerHTML} ${color2.outerHTML}`;
    } else {
        return `${color1.outerHTML}`;
    }
}

async function getFossiles() {
    menu.remove();
    mainTitle.innerText = "Fossiles";
    mainTitle.style.margin = "80px 0 40px 0";
    afficherLoader();

    // ---- DATA SECTION ----
    // LOAD DATA
    const fossiles = await fetch(`${baseURL}/nh/fossils/individuals?&api_key=${apiKey}`);
    const dataFossiles = await fossiles.json();
    console.log("dataFossiles :");
    console.log(dataFossiles);

    // LOAD TRANSLATIONS
    //TODO : mettre le nom FR des fossiles en bas de chaque fossile (comme pour les villageois)
    const translationsFossilesNames = await fetch("../json/translations/Fossils.json");
    const dataTranslationsFossilesNames = await translationsFossilesNames.json();
    console.log(dataTranslationsFossilesNames);

    // Toujours remove le loader après les await qui permette de charger les données
    const loader = document.querySelector("#loader");
    loader.remove();

    const divFossiles = document.createElement("div");
    divFossiles.classList.add("fossiles");

    for (i = 0; i < dataFossiles.length; i++ ) {
        const divFossile = document.createElement("div");
        divFossile.classList.add("card-fossile");

        const nameFos = document.createElement("p");
        nameFos.classList.add("nameFos");
        nameFos.innerText = capitalizeFirstLetter(dataFossiles[i].name);

        const divDetailsFos = document.createElement("div");
        divDetailsFos.classList.add("detailsFos");

        const divImageFos = document.createElement("div");
        divImageFos.classList.add("imageFos");
        divImageFos.innerHTML = `
            <img src="${dataFossiles[i].image_url}" alt="Image d'illustration du fossile : ${dataFossiles[i].name}"/>
        `;

        const divPrix = document.createElement("div");
        divPrix.classList.add("pricesFos");
        divPrix.innerHTML = `
            <img title="Buy" class="iconClochette" src="../img/clochettepiece.png" alt="Image piece clochette"/>
            <div class="divPrice">
                <p class="price">${dataFossiles[i].sell}</p>
                <img src="../img/clochette.png" alt="Image clochette"/>
            </div>
        `;

        const colors = dataFossiles[i].colors
        let color1 = "";
        let color2 = "";
        if (colors[1]) {
            color1 = colors[0];
            color2 = colors[1];
        } else {
            color1 = colors[0];
        }
        const divColors = document.createElement("div");
        divColors.classList.add("colorsFos");
        if (color2 === "") {
            divColors.innerHTML = `
                <i class="fa-solid fa-palette"></i>
                <span class="color1" style="background-color: ${color1};">${color1}</span>
            `;
        } else {
            divColors.innerHTML = `
                <i class="fa-solid fa-palette"></i>
                <span class="color1" style="background-color: ${color1};">${color1}</span>
                <span class="color2" style="background-color: ${color2};">${color2}</span>
            `;
        }

        divDetailsFos.append(divPrix, divColors);
        divFossile.append(nameFos, divImageFos, divDetailsFos);
        divFossiles.append(divFossile);
    }

    main.append(divFossiles);

    // Ici je gère les couleurs du texte avec chroma.js
    const color1Fos = document.querySelectorAll(".color1");
    const color2Fos = document.querySelectorAll(".color2");
    for (i = 0; i < color1Fos.length; i++) {
        const color1Bg = chroma(color1Fos[i].style.backgroundColor);
        if (chroma.contrast(color1Bg, 'black') > chroma.contrast(color1Bg, 'white')) {
            color1Fos[i].style.color = "black";
        } else {
            color1Fos[i].style.color = "white";
        }
    }
    for (i = 0; i < color2Fos.length; i++) {
        const color2Bg = chroma(color2Fos[i].style.backgroundColor);
        if (chroma.contrast(color2Bg, 'black') > chroma.contrast(color2Bg, 'white')) {
            color2Fos[i].style.color = "black";
        } else {
            color2Fos[i].style.color = "white";
        }
    }
}

async function getArts() {
    menu.remove();
    mainTitle.innerText = "Arts";
    mainTitle.style.margin = "80px 0 40px 0";
    afficherLoader();

    // ---- DATA SECTION ----
    // LOAD DATA
    const arts = await fetch(`${baseURL}/nh/art?&api_key=${apiKey}`);
    const dataArts = await arts.json();
    console.log("dataArts :");
    console.log(dataArts);

    const loader = document.querySelector("#loader");
    loader.remove();

    const divArts = document.createElement("div");
    divArts.classList.add("arts");

    for (i = 0; i < dataArts.length; i++ ) {
        const divArt = document.createElement("div");
        divArt.classList.add("card-arts");

        const nameArt = document.createElement("p");
        nameArt.classList.add("nameArt");
        nameArt.innerText = capitalizeFirstLetter(dataArts[i].name);

        const imgArt = document.createElement("div");
        imgArt.classList.add("imgArt");
        imgArt.innerHTML = `
            <img src="${dataArts[i].image_url}" alt="Image de l'art ${dataArts[i].name}"/>
        `;

        const fakeArt = dataArts[i].has_fake;
        const divFake = document.createElement("div");
        if (fakeArt) {
            const fakeBtn = document.createElement("btn");
            fakeBtn.innerText = "See Fake Art";
            let dataFake = [
                url = `${dataArts[i].image_url}`,
                fake_url = `${dataArts[i].fake_image_url}`
            ]
            fakeBtn.classList.add("fakeBtn");
            fakeBtn.addEventListener("click", () => {
                // TODO: Rendre le bouton cliquable pour que l'utilisateur puisse voir le fake. S'inspirer de ce que j'ai fais précédemment avec les villageois.
                console.log(dataFake);
            });
            divFake.append(fakeBtn);
        } else {
            const pFake = document.createElement("p");
            pFake.classList.add("pFake");
            pFake.innerText = "This Art Have No Fake";
            divFake.append(pFake);
        }

        divArt.append(nameArt, imgArt, divFake);
        divArts.append(divArt);
    }

    main.append(divArts);
}

async function getCreatureMarines() {
    menu.remove();
    mainTitle.innerText = "Créatures Marines";
    mainTitle.style.margin = "80px 0 40px 0";
    afficherLoader();

    // ---- DATA SECTION ----
    // LOAD DATA
    const creaturemarine = await fetch(`${baseURL}/nh/sea?&api_key=${apiKey}`);
    const dataCreaturemarine = await creaturemarine.json();
    console.log("dataCreaturemarine :");
    console.log(dataCreaturemarine);

    const loader = document.querySelector("#loader");
    loader.remove();

    const divCreaturesMarines = document.createElement("div");
    divCreaturesMarines.classList.add("creatures_marines");

    for (i = 0; i < dataCreaturemarine.length; i++ ) {
        const divCreatureMarine = document.createElement("div");
        divCreatureMarine.classList.add("card-creaturemarine");
        
        const nameCM = document.createElement("p");
        nameCM.classList.add("nameCM");
        nameCM.innerText = dataCreaturemarine[i].name;

        const imgCM = document.createElement("div");
        imgCM.classList.add("imgCM");
        imgCM.innerHTML = `
            <img src="${dataCreaturemarine[i].image_url}" alt="Image d'une créature marine appeler : ${dataCreaturemarine[i].name}" />
        `;

        divCreatureMarine.append(nameCM, imgCM);
        divCreaturesMarines.append(divCreatureMarine);
    }
    main.append(divCreaturesMarines);
}

async function getPoissons() {
    menu.remove();
    mainTitle.innerText = "Poissons";
    mainTitle.style.margin = "80px 0 40px 0";
    afficherLoader();

    // ---- DATA SECTION ----
    // LOAD DATA
    const poissons = await fetch(`${baseURL}/nh/fish?&api_key=${apiKey}`);
    const dataPoissons = await poissons.json();
    console.log("dataPoissons :");
    console.log(dataPoissons);

    const loader = document.querySelector("#loader");
    loader.remove();

    const divPoissons = document.createElement("div");
    divPoissons.classList.add("poissons");

    for (i = 0; i < dataPoissons.length; i++ ) {
        const divPoisson = document.createElement("div");
        divPoisson.classList.add("card-poisson");
        
        const namePoisson = document.createElement("p");
        namePoisson.classList.add("namePoisson");
        namePoisson.innerText = dataPoissons[i].name;

        const imgPoisson = document.createElement("div");
        imgPoisson.classList.add("imgPoisson");
        imgPoisson.innerHTML = `
            <img src="${dataPoissons[i].image_url}" alt="Image du poisson : ${dataPoissons[i].name}" />
        `;

        divPoisson.append(namePoisson, imgPoisson);
        divPoissons.append(divPoisson);
    }
    main.append(divPoissons);
}

async function getInsectes() {
    menu.remove();
    mainTitle.innerText = "Insectes";
    mainTitle.style.margin = "80px 0 40px 0";
    afficherLoader();

    // ---- DATA SECTION ----
    // LOAD DATA
    const insectes = await fetch(`${baseURL}/nh/bugs?&api_key=${apiKey}`);
    const dataInsectes = await insectes.json();
    console.log("dataInsectes :");
    console.log(dataInsectes);

    const loader = document.querySelector("#loader");
    loader.remove();

    const divInsectes = document.createElement("div");
    divInsectes.classList.add("insectes");

    for (i = 0; i < dataInsectes.length; i++ ) {
        const divInsecte = document.createElement("div");
        divInsecte.classList.add("card-insecte");
        
        const nameInsecte = document.createElement("p");
        nameInsecte.classList.add("namePoisson");
        nameInsecte.innerText = dataInsectes[i].name;

        const imgInsecte = document.createElement("div");
        imgInsecte.classList.add("imgInsecte");
        imgInsecte.innerHTML = `
            <img src="${dataInsectes[i].image_url}" alt="Image de l'insecte : ${dataInsectes[i].name}" />
        `;

        divInsecte.append(nameInsecte, imgInsecte);
        divInsectes.append(divInsecte);
    }
    main.append(divInsectes);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function afficherLoader() {
    let loaderContainer = document.createElement("div");
    loaderContainer.classList.add("loader-container");
    let loader = document.createElement("div");
    loader.id = "loader";
    loaderContainer.append(loader);
    main.append(loaderContainer);
}