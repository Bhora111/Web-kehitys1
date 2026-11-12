// WS05 student starter / opiskelijan aloituspohja
// Complete the TODOs. This file is intentionally unfinished.
// Täydennä TODO-kohdat. Tämä tiedosto on tarkoituksella keskeneräinen.


const animalForm = document.getElementById("animalForm");
const animalName = document.getElementById("animalName");
const animalSpecies = document.getElementById("animalSpecies");
const careNote = document.getElementById("careNote");
const nameError = document.getElementById("nameError");
const speciesError = document.getElementById("speciesError");
const noteError = document.getElementById("noteError");
const formResult = document.getElementById("formResult");

// Harjoitukset 1 ja 3
animalForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Tyhjennä edelliset virheet
    nameError.textContent = "";
    speciesError.textContent = "";
    noteError.textContent = "";
    formResult.textContent = "";
    animalName.classList.remove("invalid");
    animalSpecies.classList.remove("invalid");
    careNote.classList.remove("invalid");

    // Lue ja trimmaa arvot
    const name = animalName.value.trim();
    const species = animalSpecies.value.trim();
    const note = careNote.value.trim();

    // Validoi
    let isValid = true;

    if (name === "") {
        nameError.textContent = "Anna eläimen nimi.";
        animalName.classList.add("invalid");
        isValid = false;
    }
    if (species === "") {
        speciesError.textContent = "Anna eläimen laji.";
        animalSpecies.classList.add("invalid");
        isValid = false;
    }
    if (note.length < 1 || note.length > 150) {
        noteError.textContent = "Hoitomuistion pituuden pitää olla 1–150 merkkiä.";
        careNote.classList.add("invalid");
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Hyväksytty tulos
    formResult.textContent = "Lisätty: " + name + " (" + species + ") – " + note;

    // Tallenna (korvaa edellisen)
    const animal = { name, species, note };
    localStorage.setItem("ws05Animal", JSON.stringify(animal));
});

// Harjoitus 2
const sponsorForm = document.getElementById("sponsorForm");
const animalType = document.getElementById("animalType");
const yearsInput = document.getElementById("years");
const cost = document.getElementById("cost");
const discountMessage = document.getElementById("discountMessage");

sponsorForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fee = Number(animalType.value);
    const years = Number(yearsInput.value);

    if (!Number.isInteger(years) || years < 1) {
        cost.textContent = "Anna vuodet positiivisena kokonaislukuna.";
        discountMessage.textContent = "";
        return;
    }

    let total = fee * years;
    let message = "Ei alennusta.";

    if (years > 2) {
        total = total * 0.8;
        message = "20 % alennus myönnetty.";
    }
    if (years >= 5) {
        total = total - 5;
        message = "20 % alennus ja lisäksi 5 € alennus myönnetty.";
    }

    cost.textContent = "Yhteensä: " + total.toFixed(2) + " €";
    discountMessage.textContent = message;
});

// Harjoitus 4
const loadButton = document.getElementById("loadAnimal");
const clearButton = document.getElementById("clearAnimal");
const savedAnimal = document.getElementById("savedAnimal");

function loadAnimal() {
    const saved = localStorage.getItem("ws05Animal");

    if (saved === null) {
        savedAnimal.textContent = "Ei vielä tallennettua eläintä";
        return;
    }

    const animal = JSON.parse(saved);
    savedAnimal.textContent =
        "Nimi: " + animal.name + ", laji: " + animal.species + ", muistio: " + animal.note;
}

loadButton.addEventListener("click", loadAnimal);

clearButton.addEventListener("click", function () {
    localStorage.removeItem("ws05Animal");
    loadAnimal();
});

// Palauta tiedot sivun avautuessa
loadAnimal();