/**
 * SEGURIDAD SALT - Configuración General
 * 
 * Modifique los valores a continuación cuando tenga los datos definitivos de contacto.
 * Estos valores se actualizan automáticamente en todos los botones, formularios y widgets del sitio.
 */
const SALT_CONFIG = {
  // Nombre de la empresa
  companyName: "SEGURIDAD SALT",
  
  // Número de WhatsApp (código de país sin signos + o espacios, ej: 50685674793)
  // Coloque aquí el número definitivo cuando el cliente lo proporcione
  whatsappNumber: "50685674793", 

  // Número visible en textos o botones
  whatsappDisplay: "+506 8567-4793",

  // Correo electrónico receptor de cotizaciones y consultas
  contactEmail: "contacto@seguridadsalt.com",

  // Teléfono de central telefónica (opcional)
  phoneCentral: "+506 2200-0000",

  // Mensaje por defecto para el chat de WhatsApp
  defaultWhatsAppMessage: "Hola, estoy interesado en los servicios de Seguridad SALT y me gustaría solicitar una cotización.",

  // Ubicación / Cobertura
  location: "San José, Costa Rica — Cobertura Nacional",
  
  // Horario de atención
  officeHours: "Atención Operativa 24/7 — Oficinas: Lun a Vie 8:00am a 5:00pm",

  // Redes Sociales
  facebookUrl: "https://www.facebook.com/",
  instagramUrl: "https://www.instagram.com/",
  linkedinUrl: "https://www.linkedin.com/",

  // Configuración de Supabase (Bitácora de Cotizaciones)
  supabaseUrl: "https://vshqhahmhljokkekhlur.supabase.co",
  supabaseAnonKey: "sb_publishable_VtytL0ovTYKtS5RaMayacQ_dWlQN00-"
};

// Congelar el objeto para evitar modificaciones no deseadas en tiempo de ejecución
if (typeof Object.freeze === 'function') {
  Object.freeze(SALT_CONFIG);
}
