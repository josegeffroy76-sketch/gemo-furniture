import type { Product, ProductCategory } from "./types";
import { getOverrides, getCustomProducts } from "./catalog-store";

/**
 * PLACEHOLDER CATALOG
 * ---------------------------------------------------------------------------
 * This is sample data so the storefront is fully browsable end-to-end while
 * the real GEMO Furniture catalog (products, real photography, exact prices)
 * is being provided. Swap this file for a database-backed source (see
 * src/app/api/admin/products/route.ts) without changing any page code —
 * every page reads through the functions at the bottom of this file.
 * ---------------------------------------------------------------------------
 */
export const PRODUCTS: Product[] = [
  {
    id: "p001",
    slug: "aria-2-seat-apartment-sofa",
    name: "Aria 2-Seat Apartment Sofa",
    category: "sofas-sectionals",
    price: 39900,
    compareAtPrice: 59900,
    shortDescription: "A slim-arm loveseat that fits through narrow doorways and small living rooms.",
    description:
      "The Aria is designed for real apartment life: a slim profile, tool-free assembly, and a frame narrow enough to clear most stairwells and doorways. Durable woven upholstery and high-density foam cushions keep it comfortable for everyday use without the bulk of a traditional sofa.",
    features: [
      "Fits through 30\" doorways — no need to remove doors or hinges",
      "High-density foam cushions keep their shape for years",
      "Stain-resistant woven fabric, easy to spot clean",
      "Tool-free, snap-together assembly in under 15 minutes",
    ],
    dimensions: "60\"W x 33\"D x 34\"H",
    weightLbs: 62,
    icon: "sofa",
    colorway: "#BF4E30",
    stock: 24,
    bestseller: true,
  },
  {
    id: "p002",
    slug: "mira-tuxedo-loveseat",
    name: "Mira Tuxedo Loveseat",
    category: "sofas-sectionals",
    price: 34900,
    compareAtPrice: 49900,
    shortDescription: "Clean-lined tuxedo loveseat that anchors a small living room without overwhelming it.",
    description:
      "A modern take on the classic tuxedo silhouette, scaled down for smaller rooms. Track arms and tapered wood legs give the Mira a tailored look, while a supportive seat cushion keeps it comfortable for daily lounging.",
    features: [
      "Track arms for a clean, modern silhouette",
      "Solid wood tapered legs",
      "Supportive seat foam, doesn't sink over time",
      "Ships in two compact boxes for easy stairs and elevators",
    ],
    dimensions: "58\"W x 32\"D x 31\"H",
    weightLbs: 58,
    icon: "sofa",
    colorway: "#A43F26",
    stock: 15,
  },
  {
    id: "p003",
    slug: "haven-sleeper-sofa-bed",
    name: "Haven Sleeper Sofa Bed",
    category: "sofa-beds",
    price: 44900,
    compareAtPrice: 69900,
    shortDescription: "A full-size sofa by day, a real memory-foam bed by night.",
    description:
      "The Haven pulls double duty for studios and guest rooms: a comfortable sofa for everyday use that folds flat into a full-size sleeping surface in seconds. The memory-foam mattress topper is noticeably more comfortable than a standard pull-out coil mattress.",
    features: [
      "Converts from sofa to full-size bed in one motion",
      "2\" memory-foam topper included — no lumpy coils",
      "Reinforced steel frame rated for nightly use",
      "Removable, machine-washable cushion covers",
    ],
    dimensions: "70\"W x 35\"D x 33\"H (84\"W x 54\"D as a bed)",
    weightLbs: 88,
    icon: "sofa",
    colorway: "#83321F",
    stock: 10,
    bestseller: true,
  },
  {
    id: "p004",
    slug: "wren-futon-sofa-bed",
    name: "Wren Futon Sofa Bed",
    category: "sofa-beds",
    price: 24900,
    compareAtPrice: 34900,
    shortDescription: "A budget-friendly futon that reclines from sofa to lounger to bed.",
    description:
      "A first-apartment classic, updated. The Wren's split-back design reclines to three positions, so it's a sofa for movie night and a lounger or bed when guests stay over. Great for dorms, studios, and tight budgets.",
    features: [
      "3-position reclining back: sofa, lounger, bed",
      "Compact metal frame, easy to move between rooms",
      "Machine-washable cover",
      "Fits in most standard elevators unassembled",
    ],
    dimensions: "70\"W x 30\"D x 32\"H",
    weightLbs: 54,
    icon: "sofa",
    colorway: "#CC6947",
    stock: 30,
  },
  {
    id: "p005",
    slug: "nook-twin-platform-bed",
    name: "Nook Twin Platform Bed with Storage",
    category: "bedroom",
    price: 26900,
    compareAtPrice: 37900,
    shortDescription: "A twin platform bed with built-in drawers — no box spring needed.",
    description:
      "Built for dorms and small bedrooms, the Nook skips the box spring entirely thanks to a slatted platform base, and reclaims the space underneath with two full-extension storage drawers.",
    features: [
      "No box spring required — supports memory foam and innerspring mattresses",
      "Two full-extension under-bed storage drawers",
      "Solid wood slats, no sagging",
      "Low profile fits under sloped dorm ceilings",
    ],
    dimensions: "Twin — 79\"L x 42\"W x 14\"H",
    weightLbs: 71,
    icon: "bed-single",
    colorway: "#BF4E30",
    stock: 18,
  },
  {
    id: "p006",
    slug: "harlow-queen-storage-bed",
    name: "Harlow Queen Storage Bed",
    category: "bedroom",
    price: 42900,
    compareAtPrice: 64900,
    shortDescription: "A queen platform bed with a lift-up base for hidden storage.",
    description:
      "The Harlow's hydraulic lift-up base turns unused under-bed space into real storage for out-of-season clothes, luggage, or extra bedding — ideal for small bedrooms with no closet space to spare.",
    features: [
      "Gas-lift base reveals full-length hidden storage",
      "Upholstered headboard with channel tufting",
      "No box spring required",
      "Rated for mattresses up to queen, 500 lb weight capacity",
    ],
    dimensions: "Queen — 84\"L x 63\"W x 40\"H (headboard)",
    weightLbs: 132,
    icon: "bed-double",
    colorway: "#642619",
    stock: 9,
    newArrival: true,
  },
  {
    id: "p007",
    slug: "bunkhouse-twin-loft-bed",
    name: "Bunkhouse Twin Loft Bed with Desk",
    category: "bedroom",
    price: 32900,
    compareAtPrice: 45900,
    shortDescription: "A loft bed with a built-in desk and shelving underneath — a bedroom and office in one footprint.",
    description:
      "Perfect for dorms and studio apartments, the Bunkhouse lofts a twin bed over a full desk and open shelving, so you get a bedroom and a workspace out of a single piece of furniture.",
    features: [
      "Loft height clears a desk, chair, and shelving underneath",
      "Built-in desk surface and two-tier shelf",
      "Solid pine frame with guardrails on the top bunk",
      "Ladder integrated into the frame — no loose parts",
    ],
    dimensions: "79\"L x 42\"W x 66\"H",
    weightLbs: 118,
    icon: "bed-single",
    colorway: "#A43F26",
    stock: 6,
  },
  {
    id: "p008",
    slug: "cubby-storage-ottoman",
    name: "Cubby Storage Ottoman",
    category: "storage",
    price: 8900,
    compareAtPrice: 12900,
    shortDescription: "A footrest, extra seat, and hidden storage bin in one small footprint.",
    description:
      "A hard-working small-space essential: use it as a footrest, pull it up as extra seating, or lift the top to stash blankets, shoes, or remote controls out of sight.",
    features: [
      "Lift-top lid with soft-close hinge",
      "Doubles as extra seating (holds up to 300 lb)",
      "Stain-resistant vegan leather exterior",
      "Fits under most desks and console tables",
    ],
    dimensions: "30\"W x 18\"D x 16\"H",
    weightLbs: 19,
    icon: "box",
    colorway: "#CC6947",
    stock: 40,
    bestseller: true,
  },
  {
    id: "p009",
    slug: "ladder-bookshelf-5-tier",
    name: "5-Tier Ladder Bookshelf",
    category: "storage",
    price: 9900,
    compareAtPrice: 14900,
    shortDescription: "A leaning ladder shelf that adds storage without eating floor space.",
    description:
      "The ladder silhouette leans against any wall and tapers as it rises, giving you five tiers of display and storage while keeping a small footprint — great for books, plants, or a first apartment's growing collection of things.",
    features: [
      "Leans flush against the wall — wall strap included for stability",
      "5 tiers, tapering from wide base to narrow top",
      "Engineered wood with a warm walnut finish",
      "15-minute assembly, one tool included",
    ],
    dimensions: "22\"W x 14\"D x 70\"H",
    weightLbs: 28,
    icon: "package",
    colorway: "#83321F",
    stock: 33,
  },
  {
    id: "p010",
    slug: "fold-flat-dining-set-2",
    name: "Fold-Flat Dining Set for Two",
    category: "dining",
    price: 18900,
    compareAtPrice: 26900,
    shortDescription: "A drop-leaf table and two chairs that fold away when you need the floor space back.",
    description:
      "Sized for studio kitchens and small dining nooks, this drop-leaf table expands for meals and folds flat against the wall the rest of the time. The two matching chairs stack for easy storage in a closet.",
    features: [
      "Drop-leaf top expands from 20\" to 40\" wide",
      "Two stackable chairs included",
      "Wall-mount bracket included for the folded table",
      "Water-resistant laminate top",
    ],
    dimensions: "Table: 40\"W x 28\"D x 30\"H (open)",
    weightLbs: 46,
    icon: "table-2",
    colorway: "#BF4E30",
    stock: 21,
  },
  {
    id: "p011",
    slug: "corner-writing-desk",
    name: "Corner Writing Desk",
    category: "home-office",
    price: 14900,
    compareAtPrice: 21900,
    shortDescription: "An L-shaped desk built to use the one corner every small room has to spare.",
    description:
      "Tucks into a corner to create a real workspace without giving up floor space anywhere else in the room. A lower shelf keeps a printer or extra storage within reach.",
    features: [
      "L-shaped footprint fits into any 42\" corner",
      "Built-in lower shelf for a printer or files",
      "Scratch-resistant laminate top",
      "Cable management grommet included",
    ],
    dimensions: "42\"W x 42\"D x 30\"H",
    weightLbs: 41,
    icon: "table-2",
    colorway: "#A43F26",
    stock: 27,
  },
  {
    id: "p012",
    slug: "folding-desk-chair",
    name: "Folding Task Chair",
    category: "home-office",
    price: 6900,
    compareAtPrice: 9900,
    shortDescription: "A padded task chair that folds flat and slides behind a door when you're done working.",
    description:
      "A real ergonomic seat for your desk that doesn't have to live in the room permanently — fold it flat and store it behind a door, in a closet, or under a bed.",
    features: [
      "Folds to 4\" deep for storage",
      "Padded seat and back with lumbar curve",
      "Rated for up to 275 lb",
      "Non-marking floor caps",
    ],
    dimensions: "22\"W x 22\"D x 34\"H (unfolded)",
    weightLbs: 17,
    icon: "armchair",
    colorway: "#642619",
    stock: 36,
  },
  {
    id: "p013",
    slug: "arc-floor-lamp",
    name: "Arc Floor Lamp",
    category: "accent-decor",
    price: 7900,
    compareAtPrice: 11900,
    shortDescription: "A curved floor lamp that lights a reading corner without needing a side table.",
    description:
      "An arched floor lamp that reaches up and over a sofa or armchair, so you get overhead-style light without an overhead fixture or a side table taking up floor space.",
    features: [
      "Weighted base won't tip over",
      "Arc reaches up to 26\" past the base",
      "Dimmable, uses a standard E26 bulb (not included)",
      "In-line foot switch",
    ],
    dimensions: "58\"H, base 12\" diameter",
    weightLbs: 14,
    icon: "lamp",
    colorway: "#CC6947",
    stock: 22,
  },
  {
    id: "p014",
    slug: "round-accent-side-table",
    name: "Round Accent Side Table",
    category: "accent-decor",
    price: 5900,
    compareAtPrice: 8400,
    shortDescription: "A small round side table that slots beside any chair or sofa.",
    description:
      "A simple, sturdy side table sized to fit the tight gap next to a loveseat or armchair — enough surface for a lamp, a drink, and a book.",
    features: [
      "16\" round top — fits tight gaps between furniture",
      "Solid wood legs, engineered wood top",
      "5-minute, single-tool assembly",
      "Available in three finishes",
    ],
    dimensions: "16\" diameter x 20\"H",
    weightLbs: 9,
    icon: "package",
    colorway: "#BF4E30",
    stock: 45,
    newArrival: true,
  },
];

/**
 * Merges the static starter catalog above with any admin-panel edits
 * (price/stock/visibility overrides) and admin-added custom products, then
 * filters out hidden items. This is the single read path every page uses —
 * swapping the underlying storage for a real database later only means
 * changing this function's implementation, not any page code.
 */
function getMergedCatalog(): Product[] {
  const overrides = getOverrides();
  const base = PRODUCTS.map((p) => ({ ...p, ...overrides[p.id] }));
  const custom = getCustomProducts();
  return [...base, ...custom].filter((p) => !p.hidden);
}

export function getAllProducts(): Product[] {
  return getMergedCatalog();
}

export function getProductBySlug(slug: string): Product | undefined {
  return getMergedCatalog().find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return getMergedCatalog().find((p) => p.id === id);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return getMergedCatalog().filter((p) => p.category === category);
}

export function getBestsellers(limit = 4): Product[] {
  return getMergedCatalog()
    .filter((p) => p.bestseller)
    .slice(0, limit);
}

export function getNewArrivals(limit = 4): Product[] {
  return getMergedCatalog()
    .filter((p) => p.newArrival)
    .slice(0, limit);
}
