import type { Locale } from "./config";

export interface Messages {
  nav: {
    shopAll: string;
    sofas: string;
    bedroom: string;
    storage: string;
    about: string;
    cart: string;
    openMenu: string;
    closeMenu: string;
    languageLabel: string;
  };
  footer: {
    tagline: string;
    belowRetail: string;
    fastShipping: string;
    qualityTrust: string;
    shopHeading: string;
    companyHeading: string;
    legalHeading: string;
    aboutGemo: string;
    shopAllLink: string;
    cartLink: string;
    privacy: string;
    terms: string;
    returns: string;
    shipping: string;
    payment: string;
    rightsReserved: string;
    shippingAcrossUS: string;
  };
  hero: {
    badge: string;
    headingLine1: string;
    headingLine2: string;
    subtitle: string;
    ctaShop: string;
    ctaStory: string;
    avgRating: string;
    fastShippingNationwide: string;
  };
  marquee: {
    belowRetail: string;
    fastShipping: string;
    returns30: string;
    qualityChecked: string;
    freeShippingCheapest: string;
  };
  categories: {
    eyebrow: string;
    heading: string;
    viewAll: string;
    piece: string;
    pieces: string;
    comingSoon: string;
  };
  featured: {
    eyebrow: string;
    heading: string;
    viewAll: string;
  };
  story: {
    eyebrow: string;
    heading: string;
    body: string;
    pillar1Title: string;
    pillar1Body: string;
    pillar2Title: string;
    pillar2Body: string;
    pillar3Title: string;
    pillar3Body: string;
  };
  productCard: {
    bestseller: string;
    newLabel: string;
    belowRetail: string;
    freeShipping: string;
  };
  shop: {
    titleAll: string;
    product: string;
    products: string;
    all: string;
    emptyState: string;
  };
  product: {
    shop: string;
    bestseller: string;
    review: string;
    reviews: string;
    save: string;
    freeShippingItem: string;
    dimensions: string;
    weight: string;
    lb: string;
    customerReviews: string;
    outOf5: string;
    youMayAlsoLike: string;
    fastShippingUSA: string;
    qualityChecked: string;
    returns30: string;
    addToCart: string;
    addedToCart: string;
    decreaseQuantity: string;
    increaseQuantity: string;
  };
  cart: {
    title: string;
    empty: string;
    emptyBody: string;
    shopAllFurniture: string;
    orderSummary: string;
    subtotal: string;
    shippingTaxNote: string;
    continueToShipping: string;
    continueShopping: string;
    remove: string;
  };
  checkoutSuccess: {
    thankYou: string;
    confirmationSent: (email: string) => string;
    orderPlaced: string;
    willEmailTracking: string;
    orderTotal: string;
    reviewInvite: string;
    continueShopping: string;
  };
  checkoutCancel: {
    title: string;
    body: string;
    returnToCart: string;
  };
  about: {
    eyebrow: string;
    heading: string;
    p1: string;
    p2: string;
    p3: string;
    p4: string;
    whyHeading: string;
    reason1: string;
    reason2: string;
    reason3: string;
    reason4: string;
    reason5: string;
    reason6: string;
    ctaQuote: string;
    ctaShop: string;
  };
}

export const messages: Record<Locale, Messages> = {
  en: {
    nav: {
      shopAll: "Shop All",
      sofas: "Sofas",
      bedroom: "Bedroom",
      storage: "Storage",
      about: "About",
      cart: "Cart",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      languageLabel: "Language",
    },
    footer: {
      tagline:
        "High-quality, space-saving furniture at prices below traditional retail — built for apartments, dorms, and every first home in between.",
      belowRetail: "Below retail pricing",
      fastShipping: "Fast nationwide shipping",
      qualityTrust: "Quality you can trust",
      shopHeading: "Shop",
      companyHeading: "Company",
      legalHeading: "Legal",
      aboutGemo: "About GEMO",
      shopAllLink: "Shop All",
      cartLink: "Cart",
      privacy: "Privacy Policy",
      terms: "Terms & Conditions",
      returns: "Return Policy",
      shipping: "Shipping Policy",
      payment: "Payment Policy",
      rightsReserved: "GEMO Furniture. All rights reserved.",
      shippingAcrossUS: "Shipping across the United States.",
    },
    hero: {
      badge: "Furnish your home for less",
      headingLine1: "Beautiful, space-saving furniture",
      headingLine2: "without the retail price tag.",
      subtitle:
        "Whether you're furnishing your first apartment, moving into a small space, starting college, or beginning a new chapter as newlyweds, GEMO Furniture helps you build a comfortable, stylish home on a budget — with fast shipping across the United States.",
      ctaShop: "Shop all furniture",
      ctaStory: "Our story",
      avgRating: "average rating",
      fastShippingNationwide: "Fast nationwide shipping",
    },
    marquee: {
      belowRetail: "Prices below traditional retail",
      fastShipping: "Fast shipping across the USA",
      returns30: "30-day returns",
      qualityChecked: "Quality checked before it ships",
      freeShippingCheapest: "Free shipping on our lowest-cost option",
    },
    categories: {
      eyebrow: "Shop by room",
      heading: "Made for the spaces you actually live in",
      viewAll: "View all {count} pieces",
      piece: "piece",
      pieces: "pieces",
      comingSoon: "Coming soon",
    },
    featured: {
      eyebrow: "Customer favorites",
      heading: "The pieces our customers keep coming back for",
      viewAll: "View all →",
    },
    story: {
      eyebrow: "Our story",
      heading: "Good furniture shouldn't be a luxury",
      body: "GEMO started with a simple frustration: furniture that fits a small budget usually looks and feels like it. We keep our catalog tight and focused on what actually fits small spaces, so you don't have to compromise.",
      pillar1Title: "Designed for small spaces",
      pillar1Body:
        "Every piece is chosen and sized for real apartments, dorms, and first homes — not showrooms.",
      pillar2Title: "Priced without the retail markup",
      pillar2Body:
        "We keep our catalog tight and pass the savings on, so quality furniture doesn't come with a retail price tag.",
      pillar3Title: "Quality checked before it ships",
      pillar3Body:
        "Every order is checked before it leaves the warehouse, and backed by 30-day returns if something isn't right.",
    },
    productCard: {
      bestseller: "Bestseller",
      newLabel: "New",
      belowRetail: "{percent}% below retail",
      freeShipping: "Free shipping",
    },
    shop: {
      titleAll: "Shop All Furniture",
      product: "product",
      products: "products",
      all: "All",
      emptyState: "No products in this category yet — check back soon.",
    },
    product: {
      shop: "Shop",
      bestseller: "Bestseller",
      review: "review",
      reviews: "reviews",
      save: "Save {percent}%",
      freeShippingItem: "Free shipping on this item",
      dimensions: "Dimensions",
      weight: "Weight",
      lb: "lb",
      customerReviews: "Customer reviews",
      outOf5: "out of 5",
      youMayAlsoLike: "You may also like",
      fastShippingUSA: "Fast shipping across the USA",
      qualityChecked: "Quality checked before it ships",
      returns30: "30-day returns",
      addToCart: "Add to Cart",
      addedToCart: "Added to cart",
      decreaseQuantity: "Decrease quantity",
      increaseQuantity: "Increase quantity",
    },
    cart: {
      title: "Your Cart",
      empty: "Your cart is empty",
      emptyBody: "Find something to love for your space.",
      shopAllFurniture: "Shop All Furniture",
      orderSummary: "Order Summary",
      subtotal: "Subtotal",
      shippingTaxNote: "Shipping and tax calculated at checkout.",
      continueToShipping: "Continue to Shipping",
      continueShopping: "Continue shopping",
      remove: "Remove {name}",
    },
    checkoutSuccess: {
      thankYou: "Thank you for your order!",
      confirmationSent: (email) => `A confirmation has been sent to ${email}.`,
      orderPlaced: "Your order has been placed.",
      willEmailTracking: "We'll email you tracking details as soon as it ships.",
      orderTotal: "Order total:",
      reviewInvite:
        "Once your order has had some time to arrive and settle in, we'll email you asking how it went and inviting you to rate and review what you bought.",
      continueShopping: "Continue Shopping",
    },
    checkoutCancel: {
      title: "Checkout canceled",
      body: "No charge was made. Your cart is still saved whenever you're ready to finish.",
      returnToCart: "Return to Cart",
    },
    about: {
      eyebrow: "Our Story",
      heading: "Welcome to GEMO Furniture",
      p1: "At GEMO Furniture, we believe everyone deserves a beautiful home without paying retail prices.",
      p2: "Whether you're furnishing your first apartment, moving into a small space, starting college, or beginning a new chapter as newlyweds, we're here to help you create a comfortable and stylish home on a budget.",
      p3: "We specialize in high-quality, space-saving furniture at prices below traditional retail stores. Our carefully selected collection is designed for modern living, offering smart solutions for apartments, condos, dorms, and smaller homes without compromising on style or quality.",
      p4: "With fast shipping across the United States, shopping for affordable furniture has never been easier.",
      whyHeading: "Why Choose GEMO Furniture?",
      reason1: "Prices below traditional retail stores",
      reason2: "Perfect for apartments and small living spaces",
      reason3: "Ideal for students, first-time renters, and newly married couples",
      reason4: "Modern, functional, and stylish furniture",
      reason5: "Fast nationwide shipping across the USA",
      reason6: "Outstanding value without sacrificing quality",
      ctaQuote: "Furnish your home for less. Live better with GEMO Furniture.",
      ctaShop: "Shop All Furniture",
    },
  },
  es: {
    nav: {
      shopAll: "Ver todo",
      sofas: "Sofás",
      bedroom: "Dormitorio",
      storage: "Almacenaje",
      about: "Nosotros",
      cart: "Carrito",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      languageLabel: "Idioma",
    },
    footer: {
      tagline:
        "Muebles de alta calidad y que aprovechan el espacio, a precios por debajo del comercio minorista tradicional — pensados para apartamentos, dormitorios de estudiante y cada primer hogar.",
      belowRetail: "Precios por debajo del retail",
      fastShipping: "Envío rápido a todo el país",
      qualityTrust: "Calidad en la que puedes confiar",
      shopHeading: "Tienda",
      companyHeading: "Compañía",
      legalHeading: "Legal",
      aboutGemo: "Sobre GEMO",
      shopAllLink: "Ver todo",
      cartLink: "Carrito",
      privacy: "Política de Privacidad",
      terms: "Términos y Condiciones",
      returns: "Política de Devoluciones",
      shipping: "Política de Envíos",
      payment: "Política de Pago",
      rightsReserved: "GEMO Furniture. Todos los derechos reservados.",
      shippingAcrossUS: "Envíos a todo Estados Unidos.",
    },
    hero: {
      badge: "Amuebla tu hogar por menos",
      headingLine1: "Muebles hermosos que aprovechan el espacio,",
      headingLine2: "sin el precio de tienda.",
      subtitle:
        "Ya sea que estés amueblando tu primer apartamento, mudándote a un espacio pequeño, comenzando la universidad, o iniciando una nueva etapa como recién casados, GEMO Furniture te ayuda a crear un hogar cómodo y con estilo sin gastar de más — con envío rápido a todo Estados Unidos.",
      ctaShop: "Ver todos los muebles",
      ctaStory: "Nuestra historia",
      avgRating: "calificación promedio",
      fastShippingNationwide: "Envío rápido a todo el país",
    },
    marquee: {
      belowRetail: "Precios por debajo del retail tradicional",
      fastShipping: "Envío rápido a todo EE. UU.",
      returns30: "Devoluciones en 30 días",
      qualityChecked: "Calidad verificada antes de enviarse",
      freeShippingCheapest: "Envío gratis en nuestra opción más económica",
    },
    categories: {
      eyebrow: "Compra por ambiente",
      heading: "Pensados para los espacios donde realmente vives",
      viewAll: "Ver las {count} piezas",
      piece: "pieza",
      pieces: "piezas",
      comingSoon: "Próximamente",
    },
    featured: {
      eyebrow: "Favoritos de clientes",
      heading: "Las piezas por las que nuestros clientes siempre vuelven",
      viewAll: "Ver todo →",
    },
    story: {
      eyebrow: "Nuestra historia",
      heading: "Los muebles buenos no deberían ser un lujo",
      body: "GEMO nació de una frustración simple: los muebles que se ajustan a un presupuesto ajustado suelen verse y sentirse así. Mantenemos nuestro catálogo enfocado en lo que realmente funciona en espacios pequeños, para que no tengas que sacrificar calidad.",
      pillar1Title: "Diseñado para espacios pequeños",
      pillar1Body:
        "Cada pieza se elige y se dimensiona para apartamentos reales, dormitorios de estudiante y primeros hogares — no para salas de exhibición.",
      pillar2Title: "Precio sin el margen del retail",
      pillar2Body:
        "Mantenemos nuestro catálogo enfocado y trasladamos el ahorro a ti, para que los muebles de calidad no vengan con precio de tienda.",
      pillar3Title: "Calidad verificada antes de enviarse",
      pillar3Body:
        "Cada pedido se revisa antes de salir del almacén, y está respaldado por devoluciones de 30 días si algo no está bien.",
    },
    productCard: {
      bestseller: "Más vendido",
      newLabel: "Nuevo",
      belowRetail: "{percent}% por debajo del retail",
      freeShipping: "Envío gratis",
    },
    shop: {
      titleAll: "Ver Todos los Muebles",
      product: "producto",
      products: "productos",
      all: "Todos",
      emptyState: "Todavía no hay productos en esta categoría — vuelve pronto.",
    },
    product: {
      shop: "Tienda",
      bestseller: "Más vendido",
      review: "reseña",
      reviews: "reseñas",
      save: "Ahorra {percent}%",
      freeShippingItem: "Envío gratis en este artículo",
      dimensions: "Dimensiones",
      weight: "Peso",
      lb: "lb",
      customerReviews: "Reseñas de clientes",
      outOf5: "de 5",
      youMayAlsoLike: "También te puede gustar",
      fastShippingUSA: "Envío rápido a todo EE. UU.",
      qualityChecked: "Calidad verificada antes de enviarse",
      returns30: "Devoluciones en 30 días",
      addToCart: "Agregar al Carrito",
      addedToCart: "Agregado al carrito",
      decreaseQuantity: "Disminuir cantidad",
      increaseQuantity: "Aumentar cantidad",
    },
    cart: {
      title: "Tu Carrito",
      empty: "Tu carrito está vacío",
      emptyBody: "Encuentra algo que te encante para tu espacio.",
      shopAllFurniture: "Ver Todos los Muebles",
      orderSummary: "Resumen del Pedido",
      subtotal: "Subtotal",
      shippingTaxNote: "El envío y los impuestos se calculan al finalizar la compra.",
      continueToShipping: "Continuar al Envío",
      continueShopping: "Seguir comprando",
      remove: "Quitar {name}",
    },
    checkoutSuccess: {
      thankYou: "¡Gracias por tu pedido!",
      confirmationSent: (email) => `Se ha enviado una confirmación a ${email}.`,
      orderPlaced: "Tu pedido ha sido realizado.",
      willEmailTracking: "Te enviaremos los datos de seguimiento por correo en cuanto se envíe.",
      orderTotal: "Total del pedido:",
      reviewInvite:
        "Cuando tu pedido haya llegado y hayas tenido tiempo de disfrutarlo, te enviaremos un correo preguntándote qué tal te fue e invitándote a calificar y reseñar lo que compraste.",
      continueShopping: "Seguir Comprando",
    },
    checkoutCancel: {
      title: "Compra cancelada",
      body: "No se realizó ningún cargo. Tu carrito sigue guardado para cuando quieras finalizar tu compra.",
      returnToCart: "Volver al Carrito",
    },
    about: {
      eyebrow: "Nuestra Historia",
      heading: "Bienvenido a GEMO Furniture",
      p1: "En GEMO Furniture creemos que todos merecen un hogar hermoso sin pagar precios de tienda.",
      p2: "Ya sea que estés amueblando tu primer apartamento, mudándote a un espacio pequeño, comenzando la universidad, o iniciando una nueva etapa como recién casados, estamos aquí para ayudarte a crear un hogar cómodo y con estilo sin gastar de más.",
      p3: "Nos especializamos en muebles de alta calidad que aprovechan el espacio, a precios por debajo de las tiendas minoristas tradicionales. Nuestra colección, cuidadosamente seleccionada, está pensada para la vida moderna, con soluciones inteligentes para apartamentos, condominios, dormitorios de estudiante y hogares pequeños, sin sacrificar estilo ni calidad.",
      p4: "Con envío rápido a todo Estados Unidos, comprar muebles asequibles nunca ha sido más fácil.",
      whyHeading: "¿Por Qué Elegir GEMO Furniture?",
      reason1: "Precios por debajo de las tiendas minoristas tradicionales",
      reason2: "Perfecto para apartamentos y espacios pequeños",
      reason3: "Ideal para estudiantes, quienes rentan por primera vez y parejas recién casadas",
      reason4: "Muebles modernos, funcionales y con estilo",
      reason5: "Envío rápido a todo Estados Unidos",
      reason6: "Excelente relación calidad-precio sin sacrificar calidad",
      ctaQuote: "Amuebla tu hogar por menos. Vive mejor con GEMO Furniture.",
      ctaShop: "Ver Todos los Muebles",
    },
  },
};

export function t(locale: Locale) {
  return messages[locale];
}
