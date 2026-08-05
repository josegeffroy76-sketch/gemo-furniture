import type { Locale } from "./config";
import type { Product } from "../types";

interface ProductTranslation {
  name?: string;
  shortDescription?: string;
  description?: string;
  features?: string[];
}

/**
 * Spanish copy for the 14 starter catalog products (src/lib/products.ts).
 * Admin-added custom products have no entry here and simply fall back to
 * their (English) admin-entered text — see localizeProduct() below.
 */
export const PRODUCT_TRANSLATIONS_ES: Record<string, ProductTranslation> = {
  p001: {
    name: "Sofá Aria de 2 Plazas para Apartamento",
    shortDescription:
      "Un loveseat de brazos delgados que cabe por puertas y salas estrechas.",
    description:
      "El Aria está diseñado para la vida real en apartamentos: un perfil delgado, ensamblaje sin herramientas y una estructura lo bastante angosta para pasar por la mayoría de escaleras y puertas. Su tapizado tejido resistente y cojines de espuma de alta densidad lo mantienen cómodo para uso diario sin el volumen de un sofá tradicional.",
    features: [
      'Cabe por puertas de 30" — no es necesario quitar puertas ni bisagras',
      "Cojines de espuma de alta densidad que mantienen su forma por años",
      "Tela tejida resistente a manchas, fácil de limpiar",
      "Ensamblaje sin herramientas, por encaje, en menos de 15 minutos",
    ],
  },
  p002: {
    name: "Loveseat Mira Estilo Esmoquin",
    shortDescription:
      "Loveseat de líneas limpias tipo esmoquin que da carácter a una sala pequeña sin saturarla.",
    description:
      "Una versión moderna de la clásica silueta esmoquin, adaptada a espacios más pequeños. Los brazos rectos y las patas de madera cónicas le dan al Mira un aspecto elegante, mientras que un cojín de asiento firme lo mantiene cómodo para el uso diario.",
    features: [
      "Brazos rectos para una silueta limpia y moderna",
      "Patas de madera maciza cónicas",
      "Espuma de asiento firme que no se hunde con el tiempo",
      "Se envía en dos cajas compactas, fáciles para escaleras y elevadores",
    ],
  },
  p003: {
    name: "Sofá Cama Haven",
    shortDescription:
      "Un sofá tamaño completo de día, una cama real de memory foam de noche.",
    description:
      "El Haven cumple doble función en estudios y cuartos de huéspedes: un sofá cómodo para uso diario que se convierte en una superficie de cama tamaño completo en segundos. El colchón de memory foam es notablemente más cómodo que un colchón de resortes plegable estándar.",
    features: [
      "Se convierte de sofá a cama tamaño completo en un solo movimiento",
      'Incluye cubierta de memory foam de 2" — sin resortes incómodos',
      "Estructura de acero reforzado, apta para uso nocturno diario",
      "Fundas de cojines removibles y lavables a máquina",
    ],
  },
  p004: {
    name: "Sofá Cama Futón Wren",
    shortDescription: "Un futón económico que se reclina de sofá a diván y a cama.",
    description:
      "Un clásico de primer apartamento, renovado. El respaldo dividido del Wren se reclina en tres posiciones, así que es un sofá para noche de película y un diván o cama cuando se quedan invitados. Ideal para dormitorios de estudiante, estudios y presupuestos ajustados.",
    features: [
      "Respaldo reclinable en 3 posiciones: sofá, diván, cama",
      "Estructura metálica compacta, fácil de mover entre cuartos",
      "Funda lavable a máquina",
      "Cabe sin ensamblar en la mayoría de los elevadores estándar",
    ],
  },
  p005: {
    name: "Cama Plataforma Individual Nook con Almacenaje",
    shortDescription:
      "Una cama plataforma individual con cajones integrados — no necesita box spring.",
    description:
      "Pensada para dormitorios de estudiante y cuartos pequeños, la Nook elimina por completo el box spring gracias a una base de listones, y aprovecha el espacio debajo con dos cajones de extensión completa.",
    features: [
      "No requiere box spring — soporta colchones de memory foam y de resortes",
      "Dos cajones de almacenaje de extensión completa bajo la cama",
      "Listones de madera maciza, sin hundimiento",
      "Perfil bajo, cabe bajo techos inclinados de dormitorios de estudiante",
    ],
  },
  p006: {
    name: "Cama con Almacenaje Harlow Queen",
    shortDescription:
      "Una cama plataforma queen con base elevable para almacenaje oculto.",
    description:
      "La base elevable hidráulica de la Harlow convierte el espacio no utilizado bajo la cama en almacenaje real para ropa de temporada, maletas o ropa de cama extra — ideal para recámaras pequeñas sin espacio de closet de sobra.",
    features: [
      "Base con pistón de gas que revela almacenaje oculto de largo completo",
      "Cabecera tapizada con acolchado en canal",
      "No requiere box spring",
      "Compatible con colchones hasta queen, capacidad de 500 lb",
    ],
  },
  p007: {
    name: "Cama Litera Individual Bunkhouse con Escritorio",
    shortDescription:
      "Una cama tipo litera con escritorio y repisas integradas debajo — recámara y oficina en un solo mueble.",
    description:
      "Perfecta para dormitorios de estudiante y apartamentos tipo estudio, la Bunkhouse eleva una cama individual sobre un escritorio completo y repisas abiertas, para que obtengas una recámara y un espacio de trabajo en un solo mueble.",
    features: [
      "Altura elevada que deja espacio para escritorio, silla y repisas debajo",
      "Superficie de escritorio integrada y repisa de dos niveles",
      "Estructura de pino macizo con barandales en la litera superior",
      "Escalera integrada a la estructura — sin piezas sueltas",
    ],
  },
  p008: {
    name: "Otomana Cubby con Almacenaje",
    shortDescription:
      "Reposapiés, asiento extra y compartimento de almacenaje oculto en un solo mueble compacto.",
    description:
      "Un esencial versátil para espacios pequeños: úsalo como reposapiés, acércalo como asiento extra, o levanta la tapa para guardar cobijas, zapatos o controles remotos fuera de vista.",
    features: [
      "Tapa abatible con bisagra de cierre suave",
      "Funciona también como asiento extra (soporta hasta 300 lb)",
      "Exterior de piel vegana resistente a manchas",
      "Cabe bajo la mayoría de escritorios y mesas de consola",
    ],
  },
  p009: {
    name: "Librero Escalera de 5 Niveles",
    shortDescription:
      "Un librero tipo escalera que suma almacenaje sin ocupar espacio de piso.",
    description:
      "La silueta tipo escalera se recarga contra cualquier pared y se va estrechando hacia arriba, dándote cinco niveles de exhibición y almacenaje con una huella pequeña — ideal para libros, plantas o la creciente colección de cosas de un primer apartamento.",
    features: [
      "Se recarga contra la pared — incluye correa de sujeción para estabilidad",
      "5 niveles, de base ancha a punta angosta",
      "Madera de ingeniería con acabado nogal cálido",
      "Ensamblaje de 15 minutos, incluye una herramienta",
    ],
  },
  p010: {
    name: "Set de Comedor Plegable para Dos",
    shortDescription:
      "Una mesa abatible y dos sillas que se pliegan cuando necesitas recuperar el espacio de piso.",
    description:
      "Pensada para cocinas tipo estudio y rincones de comedor pequeños, esta mesa de hojas abatibles se extiende para comer y se pliega contra la pared el resto del tiempo. Las dos sillas a juego se apilan para guardarse fácilmente en un closet.",
    features: [
      'Cubierta abatible que se extiende de 20" a 40" de ancho',
      "Incluye dos sillas apilables",
      "Incluye soporte de pared para la mesa plegada",
      "Cubierta laminada resistente al agua",
    ],
  },
  p011: {
    name: "Escritorio de Esquina",
    shortDescription:
      "Un escritorio en L diseñado para aprovechar la esquina que sobra en cualquier cuarto pequeño.",
    description:
      "Se acomoda en una esquina para crear un espacio de trabajo real sin ceder espacio de piso en ningún otro punto del cuarto. Una repisa inferior mantiene una impresora o almacenaje extra al alcance.",
    features: [
      'Formato en L que cabe en cualquier esquina de 42"',
      "Repisa inferior integrada para impresora o archivero",
      "Cubierta laminada resistente a rayones",
      "Incluye orificio pasacables integrado",
    ],
  },
  p012: {
    name: "Silla de Escritorio Plegable",
    shortDescription:
      "Una silla de escritorio acolchada que se pliega y se guarda detrás de una puerta cuando terminas de trabajar.",
    description:
      "Un asiento ergonómico real para tu escritorio que no tiene que quedarse permanentemente en el cuarto — pliégala y guárdala detrás de una puerta, en un closet o bajo la cama.",
    features: [
      'Se pliega a solo 4" de profundidad para guardarse',
      "Asiento y respaldo acolchados con curva lumbar",
      "Soporta hasta 275 lb",
      "Base con tapas antideslizantes que no marcan el piso",
    ],
  },
  p013: {
    name: "Lámpara de Piso Arc",
    shortDescription:
      "Una lámpara de piso curva que ilumina un rincón de lectura sin necesitar una mesa lateral.",
    description:
      "Una lámpara de piso en arco que se extiende sobre un sofá o sillón, para que tengas luz tipo cenital sin instalar una lámpara de techo ni ocupar una mesa lateral.",
    features: [
      "Base con peso que no se voltea",
      'El arco se extiende hasta 26" desde la base',
      "Regulable de intensidad, usa foco estándar E26 (no incluido)",
      "Interruptor de pie integrado en el cable",
    ],
  },
  p014: {
    name: "Mesa Lateral Redonda",
    shortDescription: "Una mesa lateral redonda y pequeña que se acomoda junto a cualquier silla o sofá.",
    description:
      "Una mesa lateral simple y resistente, del tamaño justo para el espacio junto a un loveseat o sillón — suficiente superficie para una lámpara, una bebida y un libro.",
    features: [
      'Cubierta redonda de 16" — cabe en espacios ajustados entre muebles',
      "Patas de madera maciza, cubierta de madera de ingeniería",
      "Ensamblaje de 5 minutos con una sola herramienta",
      "Disponible en tres acabados",
    ],
  },
};

/** Returns a copy of `product` with Spanish text when a translation exists; falls back to the original (English) fields otherwise. */
export function localizeProduct<T extends Product>(product: T, locale: Locale): T {
  if (locale === "en") return product;
  const tr = PRODUCT_TRANSLATIONS_ES[product.id];
  if (!tr) return product;
  return {
    ...product,
    name: tr.name ?? product.name,
    shortDescription: tr.shortDescription ?? product.shortDescription,
    description: tr.description ?? product.description,
    features: tr.features ?? product.features,
  };
}

export function localizeProducts<T extends Product>(products: T[], locale: Locale): T[] {
  return products.map((p) => localizeProduct(p, locale));
}
