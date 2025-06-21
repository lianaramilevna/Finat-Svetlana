// script.js

// 1. Счётчик до свадьбы (работает для элементов на странице 8)
(function() {
  // Установите дату свадьбы:
  const weddingTime = new Date('2025-08-14T12:00:00').getTime();
  // Элементы:
  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');
  if (!elDays || !elHours || !elMinutes || !elSeconds) return;

  function updateCountdown() {
    const now = Date.now();
    const diff = weddingTime - now;
    if (diff <= 0) {
      elDays.textContent = '00';
      elHours.textContent = '00';
      elMinutes.textContent = '00';
      elSeconds.textContent = '00';
      return;
    }
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
    const seconds = Math.floor((diff % (1000*60)) / 1000);
    elDays.textContent = String(days).padStart(2,'0');
    elHours.textContent = String(hours).padStart(2,'0');
    elMinutes.textContent = String(minutes).padStart(2,'0');
    elSeconds.textContent = String(seconds).padStart(2,'0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

// 2. Инициализация Яндекс.Карты на странице 4
const MAP4_COORDS = [56.224970, 37.784748];
(function() {
  function initMap4() {
    const mapContainer = document.getElementById('map4');
    if (!mapContainer) return;
    const map = new ymaps.Map(mapContainer, {
      center: MAP4_COORDS,
      zoom: 14,
      controls: []
    });
    const placemark = new ymaps.Placemark(
      MAP4_COORDS,
      {
        hintContent: 'Шервуд',
        balloonContent: 'Шервуд'
      }
    );
    map.geoObjects.add(placemark);
  }
  function waitForYmapsReady() {
    if (window.ymaps && typeof ymaps.ready === 'function') {
      ymaps.ready(initMap4);
    } else {
      setTimeout(waitForYmapsReady, 100);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForYmapsReady);
  } else {
    waitForYmapsReady();
  }
})();

// 3. Обработка отправки формы RSVP и модальное окно
async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  // Honeypot проверка
  if (formData.get('_gotcha')) return false;
  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" }
    });
    if (response.ok) {
      form.reset();
      const modal = document.getElementById("success-modal");
      if (modal) {
        modal.style.display = "flex";
        const okBtn = document.getElementById("modal-ok-button");
        const closeBtn = document.getElementById("modal-close");
        if (okBtn) okBtn.focus();
        else if (closeBtn) closeBtn.focus();
      }
    } else {
      alert("Ошибка при отправке. Попробуйте позже.");
    }
  } catch (error) {
    alert("Ошибка сети. Попробуйте позже.");
  }
  return false;
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('success-modal');
  const closeBtn = document.getElementById('modal-close');
  const okBtn = document.getElementById('modal-ok-button');
  const form = document.getElementById('rsvp-form');

  function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
    if (form) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.focus();
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  if (okBtn) {
    okBtn.addEventListener('click', closeModal);
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      closeModal();
    }
  });
});
