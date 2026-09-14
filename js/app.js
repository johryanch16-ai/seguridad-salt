/**
 * SEGURIDAD SALT - Main Interactive Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initCompanyConfig();
  initHeaderScroll();
  initMobileMenu();
  initShowcaseTabs();
  initTestimonialsSlider();
  initGalleryLightbox();
  initQuoteModal();
  initWhatsAppWidget();
});

/**
 * 1. Inject Config values (WhatsApp, Phone, Email) across the site
 */
function initCompanyConfig() {
  if (typeof SALT_CONFIG === 'undefined') return;

  // WhatsApp Link Elements
  const waUrl = `https://wa.me/${SALT_CONFIG.whatsappNumber}?text=${encodeURIComponent(SALT_CONFIG.defaultWhatsAppMessage)}`;
  
  document.querySelectorAll('.js-wa-link').forEach(link => {
    link.setAttribute('href', waUrl);
  });

  document.querySelectorAll('.js-wa-display').forEach(el => {
    el.textContent = SALT_CONFIG.whatsappDisplay;
  });

  // Email Links
  const mailtoUrl = `mailto:${SALT_CONFIG.contactEmail}?subject=${encodeURIComponent(SALT_CONFIG.defaultQuoteSubject)}`;
  document.querySelectorAll('.js-email-link').forEach(link => {
    link.setAttribute('href', mailtoUrl);
  });

  document.querySelectorAll('.js-email-display').forEach(el => {
    el.textContent = SALT_CONFIG.contactEmail;
  });
}

/**
 * 2. Sticky Header with glassmorphism on scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/**
 * 3. Mobile Navigation Drawer
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileMenuDrawer');
  if (!toggleBtn || !drawer) return;

  // Ensure drawer is hidden on initial desktop load
  if (window.innerWidth > 768) {
    drawer.style.display = 'none';
  }

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('active');
    const isOpen = drawer.classList.contains('active');
    drawer.style.display = isOpen ? 'flex' : 'none';
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close when clicking any nav link inside drawer
  drawer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('active');
      drawer.style.display = 'none';
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      drawer.classList.remove('active');
      drawer.style.display = 'none';
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * 4. Portería Condominios Showcase Tabs
 */
function initShowcaseTabs() {
  const tabBtns = document.querySelectorAll('.showcase-tab-btn');
  const contentPanels = document.querySelectorAll('.showcase-content-panel');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      // Update button state
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update content panel
      contentPanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.style.display = 'grid';
          panel.classList.add('fadeIn');
        } else {
          panel.style.display = 'none';
          panel.classList.remove('fadeIn');
        }
      });
    });
  });
}

/**
 * 5. Testimonials Carousel
 */
function initTestimonialsSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  if (!slides.length) return;

  let currentIndex = 0;
  let autoSlideInterval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

  function startInterval() {
    autoSlideInterval = setInterval(nextSlide, 7000);
  }

  function resetInterval() {
    clearInterval(autoSlideInterval);
    startInterval();
  }

  startInterval();
}

/**
 * 6. Gallery Lightbox
 */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  if (!lightboxModal) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-img');
      const title = item.querySelector('.gallery-title')?.textContent || '';
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || title;
        if (lightboxCaption) lightboxCaption.textContent = title;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/**
 * 7. Interactive Cotización Modal with Prefill
 */
function initQuoteModal() {
  const modal = document.getElementById('quoteModal');
  const closeBtn = document.getElementById('quoteModalClose');
  const form = document.getElementById('quoteForm');
  const feedback = document.getElementById('quoteFeedback');
  const serviceSelect = document.getElementById('quoteServiceSelect');
  if (!modal) return;

  // Open Modal Triggers
  document.querySelectorAll('.trigger-quote-modal').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const requestedService = trigger.getAttribute('data-service');
      
      // Auto-prefill service if specified
      if (requestedService && serviceSelect) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value.toLowerCase().includes(requestedService.toLowerCase()) || 
              requestedService.toLowerCase().includes(serviceSelect.options[i].value.toLowerCase())) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      const firstInput = form.querySelector('input');
      if (firstInput) setTimeout(() => firstInput.focus(), 150);
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (feedback) feedback.classList.remove('success');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.full_name?.value || '';
      const clientType = form.client_type?.value || '';
      const phone = form.phone?.value || '';
      const email = form.email?.value || '';
      const service = form.service_type?.value || '';
      const comments = form.comments?.value || '';

      // 1. Guardar en Bitácora (Supabase + Respaldo Local)
      const quotePayload = {
        full_name: name,
        client_type: clientType,
        phone: phone,
        email: email,
        service_type: service,
        comments: comments,
        created_at: new Date().toISOString()
      };
      
      saveQuoteToBitacora(quotePayload);

      // 2. Feedback visual de éxito
      if (feedback) {
        feedback.innerHTML = `
          <strong>¡Solicitud de Cotización Registrada con Éxito!</strong><br>
          Gracias, <strong>${name}</strong>. Sus datos han sido guardados en nuestra bitácora operativa. Un especialista de <strong>${SALT_CONFIG.companyName}</strong> revisará sus requerimientos y se comunicará a <strong>${phone}</strong> / <strong>${email}</strong> a la mayor brevedad.
        `;
        feedback.classList.add('success');
      }

      // Resetear formulario tras 4 segundos
      setTimeout(() => {
        form.reset();
      }, 4000);
    });
  }
}

/**
 * Guarda la cotización en la bitácora de Supabase y en respaldo local
 */
async function saveQuoteToBitacora(payload) {
  // A. Respaldo Local en Navegador (siempre activo como contingencia)
  try {
    const existing = JSON.parse(localStorage.getItem('salt_cotizaciones_bitacora') || '[]');
    existing.unshift(payload);
    localStorage.setItem('salt_cotizaciones_bitacora', JSON.stringify(existing));
  } catch (e) {
    console.warn('No se pudo escribir en el almacenamiento local:', e);
  }

  // B. Envío a Supabase si las credenciales están configuradas
  if (typeof SALT_CONFIG !== 'undefined' && SALT_CONFIG.supabaseUrl && SALT_CONFIG.supabaseAnonKey) {
      const baseUrl = SALT_CONFIG.supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
      const url = `${baseUrl}/rest/v1/cotizaciones`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'apikey': SALT_CONFIG.supabaseAnonKey,
          'Authorization': `Bearer ${SALT_CONFIG.supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          full_name: payload.full_name,
          client_type: payload.client_type,
          phone: payload.phone,
          email: payload.email,
          service_type: payload.service_type,
          comments: payload.comments
        })
      });

      if (!response.ok) {
        console.warn('Respuesta no exitosa de Supabase:', response.status, await response.text());
      } else {
        console.log('✅ Cotización guardada con éxito en la bitácora de Supabase');
      }
    } catch (err) {
      console.error('Error al conectar con Supabase:', err);
    }
  }
}

/**
 * 8. WhatsApp Floating Widget with Interactive Chatbox
 */
function initWhatsAppWidget() {
  const toggleBtn = document.getElementById('waWidgetToggle');
  const chatbox = document.getElementById('waChatbox');
  const closeBtn = document.getElementById('waChatboxClose');
  const sendBtn = document.getElementById('waStartChatBtn');
  if (!toggleBtn || !chatbox) return;

  toggleBtn.addEventListener('click', () => {
    chatbox.classList.toggle('active');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chatbox.classList.remove('active');
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const waNumber = (typeof SALT_CONFIG !== 'undefined' && SALT_CONFIG.whatsappNumber) ? SALT_CONFIG.whatsappNumber : '50685674793';
      const msg = "Hola, estoy navegando en la web de Seguridad SALT y me gustaría solicitar información y cotización para un servicio de seguridad.";
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
      chatbox.classList.remove('active');
    });
  }
}
