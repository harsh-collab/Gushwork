document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initImageCarousel();
  initImageZoom();
  initManufacturingTabs();
  initApplicationsCarousel();
  initFAQAccordion();
  initCatalogueForm();
  initDatasheetModal();
  initCallbackModal();
});

/* Sticky Header — uses IntersectionObserver on the hero section.
   Shows when scrolling DOWN past the hero, hides on scroll UP. */
function initStickyHeader() {
  const stickyHeader = document.getElementById('stickyHeader');
  const productHero = document.getElementById('productHero');
  const mainHeader = document.getElementById('mainHeader');

  if (!stickyHeader || !productHero) return;

  let lastScrollY = window.scrollY;
  let heroOutOfView = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        heroOutOfView = !entry.isIntersecting;
        updateVisibility();
      });
    },
    { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
  );

  observer.observe(productHero);

  function updateVisibility() {
    if (!heroOutOfView) {
      stickyHeader.classList.remove('visible');
      if (mainHeader) mainHeader.style.top = '0';
    }
  }

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;

    if (heroOutOfView && scrollingDown && currentScrollY > 200) {
      stickyHeader.classList.add('visible');
      if (mainHeader) mainHeader.style.top = stickyHeader.offsetHeight + 'px';
    } else if (!scrollingDown) {
      stickyHeader.classList.remove('visible');
      if (mainHeader) mainHeader.style.top = '0';
    }

    if (!heroOutOfView) {
      stickyHeader.classList.remove('visible');
      if (mainHeader) mainHeader.style.top = '0';
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
}

/* Image Carousel — thumbnail clicks and arrow navigation cycle the main image */
function initImageCarousel() {
  const mainImage = document.getElementById('mainImage');
  const thumbStrip = document.getElementById('thumbStrip');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  const zoomPreviewImg = document.getElementById('zoomPreviewImg');

  if (!mainImage || !thumbStrip) return;

  const thumbButtons = thumbStrip.querySelectorAll('.product-gallery__thumb-btn');
  let currentIndex = 0;

  function setActiveSlide(index) {
    if (index < 0) index = thumbButtons.length - 1;
    if (index >= thumbButtons.length) index = 0;
    currentIndex = index;

    thumbButtons.forEach((btn) => btn.classList.remove('active'));
    thumbButtons[currentIndex].classList.add('active');

    const newSrc = thumbButtons[currentIndex].querySelector('img').src;
    mainImage.src = newSrc;
    if (zoomPreviewImg) zoomPreviewImg.src = newSrc;
  }

  thumbButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setActiveSlide(parseInt(btn.dataset.index, 10));
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', () => setActiveSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => setActiveSlide(currentIndex + 1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') setActiveSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') setActiveSlide(currentIndex + 1);
  });
}

/* Image Zoom — hover on main image shows a lens + a zoomed preview panel to the right */
function initImageZoom() {
  const container = document.getElementById('mainImageContainer');
  const zoomLens = document.getElementById('zoomLens');
  const zoomPreview = document.getElementById('zoomPreview');
  const zoomPreviewImg = document.getElementById('zoomPreviewImg');

  if (!container || !zoomLens || !zoomPreview || !zoomPreviewImg) return;

  const ZOOM_RATIO = 2;

  container.addEventListener('mouseenter', () => {
    zoomPreview.classList.add('active');
  });

  container.addEventListener('mouseleave', () => {
    zoomPreview.classList.remove('active');
  });

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const lensW = zoomLens.offsetWidth;
    const lensH = zoomLens.offsetHeight;

    // Clamp lens within image bounds
    let lensX = Math.max(0, Math.min(x - lensW / 2, rect.width - lensW));
    let lensY = Math.max(0, Math.min(y - lensH / 2, rect.height - lensH));

    zoomLens.style.left = lensX + 'px';
    zoomLens.style.top = lensY + 'px';

    // Map lens position to preview image offset
    const percX = lensX / (rect.width - lensW);
    const percY = lensY / (rect.height - lensH);

    const previewRect = zoomPreview.getBoundingClientRect();
    zoomPreviewImg.style.width = previewRect.width * ZOOM_RATIO + 'px';
    zoomPreviewImg.style.height = previewRect.height * ZOOM_RATIO + 'px';

    const maxTX = previewRect.width * ZOOM_RATIO - previewRect.width;
    const maxTY = previewRect.height * ZOOM_RATIO - previewRect.height;
    zoomPreviewImg.style.transform = `translate(-${percX * maxTX}px, -${percY * maxTY}px)`;
  });
}

/* Manufacturing Process Tabs — switches content when tab is clicked */
function initManufacturingTabs() {
  const tabsContainer = document.getElementById('mfgTabs');
  if (!tabsContainer) return;

  const tabs = tabsContainer.querySelectorAll('.mfg-process__tab');
  const titleEl = document.getElementById('mfgStepTitle');
  const descEl = document.getElementById('mfgStepDesc');
  const listEl = document.getElementById('mfgStepList');

  /* Tab content data for each manufacturing step */
  const tabData = [
    { title: 'High-Grade Raw Material Selection', desc: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.', items: ['PE100 grade material', 'Optimal molecular weight distribution'] },
    { title: 'Precision Extrusion Process', desc: 'High-performance single or twin-screw extruders melt and homogenize HDPE resin at controlled temperatures for consistent output quality.', items: ['Temperature-controlled barrel zones', 'Consistent melt flow rate'] },
    { title: 'Controlled Cooling System', desc: 'Spray cooling and immersion baths gradually reduce pipe temperature to prevent internal stresses and ensure dimensional stability.', items: ['Gradual temperature reduction', 'Stress-free crystallization'] },
    { title: 'Vacuum Sizing & Calibration', desc: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.', items: ['Precise diameter control', 'Wall thickness uniformity'] },
    { title: 'Quality Control & Testing', desc: 'Every pipe undergoes rigorous testing including hydrostatic pressure tests, dimensional checks, and material property verification.', items: ['Hydrostatic pressure testing', 'Dimensional accuracy checks'] },
    { title: 'Marking & Identification', desc: 'Permanent inkjet printing applies product specifications, batch numbers, and certification marks for complete traceability.', items: ['IS standard marking', 'Batch traceability codes'] },
    { title: 'Precision Cutting', desc: 'Automated cutting systems deliver clean, square cuts at specified lengths with minimal material waste.', items: ['Automated length cutting', 'Clean square-cut finish'] },
    { title: 'Packaging & Dispatch', desc: 'Finished pipes are bundled, strapped, and prepared for safe transportation to ensure damage-free delivery.', items: ['Secure bundling', 'Transport-ready packaging'] },
  ];

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.dataset.tab);
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      if (tabData[idx]) {
        titleEl.textContent = tabData[idx].title;
        descEl.textContent = tabData[idx].desc;
        listEl.innerHTML = tabData[idx].items.map((item) => `<li>${item}</li>`).join('');
      }
    });
  });
}

/* Applications Carousel — horizontal scrolling card carousel */
function initApplicationsCarousel() {
  const track = document.getElementById('appTrack');
  const prevBtn = document.getElementById('appPrev');
  const nextBtn = document.getElementById('appNext');
  if (!track || !prevBtn || !nextBtn) return;

  const scrollAmount = 436; // card width (420) + gap (16)

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

/* FAQ Accordion — enforces only-one-open-at-a-time using native <details> toggle event */
function initFAQAccordion() {
  const accordion = document.getElementById('faqAccordion');
  if (!accordion) return;

  const items = accordion.querySelectorAll('.faq-item');

  items.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        items.forEach((other) => {
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });
}

/* Catalogue Form — prevents default submit and shows confirmation */
function initCatalogueForm() {
  const form = document.getElementById('catalogueForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]');
    if (email && email.value) {
      alert('Thank you! We will send the catalogue to ' + email.value);
      email.value = '';
    }
  });
}

/* Datasheet Modal — opens when "Download Full Technical Datasheet" is clicked */
function initDatasheetModal() {
  const openBtn = document.getElementById('openDatasheetModal');
  const modal = document.getElementById('datasheetModal');
  const closeBtn = document.getElementById('closeDatasheetModal');
  const form = document.getElementById('datasheetForm');

  if (!openBtn || !modal) return;

  openBtn.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]');
    if (email && email.value) {
      alert('Thank you! We will send the datasheet to ' + email.value);
      form.reset();
      closeModal();
    }
  });
}

/* Callback Modal — opens when "Get Custom Quote" or "Request a Quote" buttons are clicked */
function initCallbackModal() {
  const modal = document.getElementById('callbackModal');
  const closeBtn = document.getElementById('closeCallbackModal');
  const form = document.getElementById('callbackForm');
  const openBtns = document.querySelectorAll('.open-callback-modal');

  if (!modal || openBtns.length === 0) return;

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('input[type="text"]');
    if (name && name.value) {
      alert('Thank you ' + name.value + '! We will call you back shortly.');
      form.reset();
      closeModal();
    }
  });
}
