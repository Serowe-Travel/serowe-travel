/**
 * Central, editable source of truth for static site content.
 * Contact details, navigation and marketing copy pulled from the
 * Serowe Travel company profile.
 */

export const site = {
  name: "Serowe Travel",
  tagline: "Explore Botswana & Beyond. Your Journey Starts Here.",
  description:
    "Serowe Travel is an IATA-accredited, Amadeus-partnered travel agency specialising in luxury and sustainable travel across Botswana and the world.",
  url: "https://serowetravel.com",
  email: "sales@serowetravel.com",
  phones: ["+267 71 45 9292", "+267 71 43 2118"],
  whatsapp: "+267 71 45 9292",
  address: {
    physical: "Plot 548, Mokgampo Investment Center, Mere Ward, Serowe",
    postal: "PO Box 45255, Riverwalk, Gaborone, Botswana",
  },
  // Social links are admin-editable at runtime; these are fallbacks.
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "",
    linkedin: "",
  },
} as const;

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services & Tours", href: "/services" },
  { label: "Destinations", href: "/destinations" },
  { label: "Packages", href: "/packages" },
  { label: "Contact", href: "/contact" },
] as const;

export const valueProps = [
  {
    title: "IATA Accredited & Amadeus Partner",
    body: "Globally recognised accreditation and a partnership with the Amadeus Central Reservation System for flights, hotels and car hire.",
    icon: "badge",
  },
  {
    title: "Luxury & Sustainable Travel",
    body: "Up-market, responsible journeys designed to inspire — while giving back to the communities and heritage we showcase.",
    icon: "leaf",
  },
  {
    title: "Local Expertise, Global Reach",
    body: "Rooted in Serowe and the Central Region, with the connections to take you anywhere in the world.",
    icon: "globe",
  },
] as const;

export type ServiceKey =
  | "travel-management"
  | "luxury"
  | "family"
  | "health"
  | "adventure";

export const services: {
  key: ServiceKey;
  title: string;
  short: string;
  body: string;
  points: string[];
  image: string;
}[] = [
  {
    key: "travel-management",
    title: "Travel Management Services",
    short: "Seamless corporate and managed travel.",
    body: "End-to-end travel management for corporate clients — keeping teams moving efficiently, on policy and on budget.",
    points: [
      "Travel policy management for corporate clients",
      "Travel consolidation services",
      "Visa Assist, Travel Assist & Travel Insurance",
    ],
    image: "/images/hero/travel-flatlay.png",
  },
  {
    key: "luxury",
    title: "Luxury Tours — Serowe & Central Region",
    short: "Heritage and wildlife, beautifully done.",
    body: "Up-market, curated tours celebrating the heritage and nature of Serowe, Palapye and their environs — branding the Central Region as a destination of choice.",
    points: [
      "Heritage & cultural experiences",
      "Wildlife and nature tours",
      "Tailored for discerning travellers within Botswana",
    ],
    image: "/images/gallery/heritage-homestead.jpg",
  },
  {
    key: "family",
    title: "Family Tours — SADC & International",
    short: "Memories made together.",
    body: "Family journeys across the SADC region and beyond — from regional escapes to international favourites like Mauritius and Disneyland, Florida.",
    points: [
      "SADC regional family getaways",
      "Mauritius island holidays",
      "Disneyland, Florida adventures",
    ],
    image: "/images/gallery/sunset-game-drive.jpg",
  },
  {
    key: "health",
    title: "Health & Wellness Tours",
    short: "Restorative travel for body and mind.",
    body: "Curated wellness trips for health-conscious couples and individuals to renowned destinations such as Indonesia and Thailand.",
    points: [
      "Wellness retreats & health destinations",
      "Indonesia & Thailand specialists",
      "Couples and individual itineraries",
    ],
    image: "/images/gallery/luxury-tent-interior.jpg",
  },
  {
    key: "adventure",
    title: "Adventure Tourism & Events",
    short: "Go further. Celebrate bigger.",
    body: "Special adventure packages and full event management for those seeking something more.",
    points: [
      "Tailored adventure packages",
      "Event planning & management",
      "Unique, off-the-beaten-track experiences",
    ],
    image: "/images/hero/safari-vehicle.png",
  },
];

export const destinations = [
  {
    region: "Botswana",
    blurb:
      "Our home and our heart — the Okavango Delta, Chobe, the Kalahari and the rich heritage of the Central Region.",
    places: ["Serowe & Palapye", "Okavango Delta", "Chobe", "Central Kalahari"],
    image: "/images/hero/elephant-river.png",
  },
  {
    region: "SADC Region",
    blurb:
      "Family-friendly escapes across Southern Africa, easy to reach and full of wonder.",
    places: ["South Africa", "Zimbabwe", "Zambia", "Namibia"],
    image: "/images/hero/mokoro-delta.png",
  },
  {
    region: "International",
    blurb:
      "From island holidays to wellness retreats and theme-park magic — the world, expertly arranged.",
    places: ["Mauritius", "Florida (Disneyland)", "Thailand", "Indonesia"],
    image: "/images/hero/tented-camp.png",
  },
] as const;

export const companyValues = [
  {
    title: "Knowledge",
    body: "Vast experience and deep know-how in travel and tourism.",
  },
  {
    title: "Integrity",
    body: "Honest, transparent advice you can rely on.",
  },
  {
    title: "Confidentiality",
    body: "Your plans and details are always kept private.",
  },
  {
    title: "Service Excellence",
    body: "A relentless commitment to getting every detail right.",
  },
] as const;
