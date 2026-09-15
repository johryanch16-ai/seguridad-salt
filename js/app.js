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

  const hamburgerSvg = `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>`;
  const closeSvg = `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`;

  function openDrawer() {
    drawer.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.innerHTML = closeSvg;
    toggleBtn.classList.add('is-active');
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.innerHTML = hamburgerSvg;
    toggleBtn.classList.remove('is-active');
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  // Close when clicking any nav link or quote button inside drawer
  drawer.querySelectorAll('.nav-link, .trigger-quote-modal, a, button').forEach(el => {
    el.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close when clicking outside drawer
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('active') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeDrawer();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && drawer.classList.contains('active')) {
      closeDrawer();
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
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Enviar Solicitud de Cotización';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="spinner-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; vertical-align: middle; margin-right: 8px;">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25" stroke="currentColor"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
          </svg>
          Procesando y enviando solicitud...
        `;
      }

      const name = form.full_name?.value.trim() || '';
      const clientType = form.client_type?.value || '';
      const phone = form.phone?.value.trim() || '';
      const email = form.email?.value.trim() || '';
      const service = form.service_type?.value || '';
      const comments = form.comments?.value.trim() || '';

      const quotePayload = {
        full_name: name,
        client_type: clientType,
        phone: phone,
        email: email,
        service_type: service,
        comments: comments,
        recipient: (typeof SALT_CONFIG !== 'undefined' && SALT_CONFIG.quoteNotificationEmail) ? SALT_CONFIG.quoteNotificationEmail : 'saltproteccion@gmail.com',
        created_at: new Date().toISOString()
      };

      // 1. Guardar en Bitácora (Supabase + Respaldo Local)
      saveQuoteToBitacora(quotePayload);

      // 2. Enviar Correo Electrónico Profesional a saltproteccion@gmail.com
      sendQuoteEmail(quotePayload);

      // 3. Feedback visual elegante de éxito
      if (feedback) {
        feedback.innerHTML = `
          <div style="background: rgba(46, 204, 113, 0.12); border: 1px solid rgba(46, 204, 113, 0.4); border-radius: 8px; padding: 16px; margin-top: 14px; text-align: left;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #2ecc71; font-weight: 800; font-size: 1.05rem;">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              ¡Solicitud de Cotización Enviada con Éxito!
            </div>
            <p style="margin: 0 0 8px 0; font-size: 0.92rem; color: #E2E5EC; line-height: 1.5;">
              Estimado(a) <strong>${name}</strong>, su solicitud ha sido remitida directamente a la gerencia operativa de <strong>${SALT_CONFIG.companyName}</strong> (<em>saltproteccion@gmail.com</em>).
            </p>
            <div style="font-size: 0.85rem; color: #A0A5B5; background: rgba(0,0,0,0.25); border-radius: 6px; padding: 10px;">
              <strong>Resumen de Solicitud:</strong><br>
              • <strong>Servicio:</strong> ${service}<br>
              • <strong>Tipo:</strong> ${clientType}<br>
              • <strong>Contacto:</strong> ${phone} | ${email}
            </div>
            <p style="margin: 8px 0 0 0; font-size: 0.88rem; color: #E2E5EC;">
              Un especialista operativo evaluará su requerimiento y le contactará a la brevedad posible.
            </p>
          </div>
        `;
        feedback.classList.add('success');
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `✓ Solicitud Registrada`;
      }

      // Resetear formulario tras 5 segundos
      setTimeout(() => {
        form.reset();
        if (submitBtn) submitBtn.innerHTML = originalBtnText;
      }, 5000);
    });
  }
}

/**
 * Envía la cotización por correo a saltproteccion@gmail.com
 * Cuenta con arquitectura de doble contingencia (Servidor Node + FormSubmit API)
 */
async function sendQuoteEmail(payload) {
  const recipient = payload.recipient || 'saltproteccion@gmail.com';
  
  // Intento 1: A través del endpoint de nuestro servidor local/Render
  try {
    const serverRes = await fetch('/api/send-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (serverRes.ok) {
      console.log('✅ Correo de cotización enviado a través del servidor a:', recipient);
      return;
    }
  } catch (err) {
    console.log('Intento 1 con servidor local falló, ejecutando contingencia directa FormSubmit...');
  }

  // Intento 2: Envío directo desde el cliente vía FormSubmit AJAX (respaldo absoluto)
  try {
    const postData = {
      _subject: `🛡️ Nueva Cotización: ${payload.service_type || 'Seguridad'} - ${payload.full_name || 'Cliente'}`,
      _template: 'table',
      _captcha: 'false',
      'Nombre Completo': payload.full_name || 'No especificado',
      'Tipo de Cliente': payload.client_type || 'No especificado',
      'Teléfono': payload.phone || 'No especificado',
      'Correo Electrónico': payload.email || 'No especificado',
      'Servicio Requerido': payload.service_type || 'No especificado',
      'Detalles del Requerimiento': payload.comments || 'No especificado',
      'Fecha': new Date().toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' }),
      'Origen': 'Sitio Web Seguridad SALT'
    };

    await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(postData)
    });
    console.log('✅ Correo de cotización despachado directamente vía FormSubmit a:', recipient);
  } catch (err) {
    console.error('Error al enviar correo por FormSubmit:', err);
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

  if (typeof SALT_CONFIG !== 'undefined' && SALT_CONFIG.supabaseUrl && SALT_CONFIG.supabaseAnonKey) {
    try {
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
