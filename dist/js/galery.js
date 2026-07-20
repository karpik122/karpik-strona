const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('galleryModal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');
const modalDesc = document.getElementById('modalDesc');
const modalDate = document.getElementById('modalDate');

galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    const sciezka = item.dataset.src;
    
    // 1. Wstawianie obrazka
    modalImage.src = sciezka;
    modalImage.alt = item.dataset.alt;

    // 2. Wstawianie opisu z pliku dane.js
    const dane = opisyProjektow[sciezka];
    if (dane) {
      modalDesc.textContent = dane.opis;
    } else {
      modalDesc.textContent = "Brak opisu dla tego zdjęcia.";
    }

    // Wstępny tekst daty
    modalDate.textContent = "Data: Szukanie...";

    // Otwarcie okienka
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    // 3. Wstawianie daty ze zdjęcia
    const img = item.querySelector('img');
    EXIF.getData(img, function() {
      const date = EXIF.getTag(this, "DateTimeOriginal");
      if (date) {
        const cleanDate = date.split(' ')[0].replace(/:/g, '-');
        modalDate.textContent = "Data: " + cleanDate;
      } else {
        modalDate.textContent = "Data: Brak zapisanej daty w pliku";
      }
    });
  });
});

closeModal.addEventListener('click', () => {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
});

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }
});