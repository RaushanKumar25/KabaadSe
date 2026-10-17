export const CITIES_LIST = [
  "Patna",
  "Bhubaneswar (Odisha)",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Bhopal",
  "Indore",
  "Nagpur",
  "Raipur",
  "Lucknow",
  "Noida",
  "Ghaziabad",
  "Gurgaon",
  "Jaipur",
] as const;

export type CityName = (typeof CITIES_LIST)[number];

export type ScrapCategory = "All" | "Paper" | "Plastic" | "Metal" | "E-waste" | "Other";

export interface ScrapRateItem {
  id: string;
  name: string;
  category: "Paper" | "Plastic" | "Metal" | "E-waste" | "Other";
  price: string;
  icon: string;
  image?: string;
  popular?: boolean;
}

export const SCRAP_ITEMS_DATA: ScrapRateItem[] = [
  // Paper
  { id: "newspaper", name: "Newspaper", category: "Paper", price: "₹10 /kg", icon: "📰", popular: true },
  { id: "carton", name: "Carton", category: "Paper", price: "₹11 /kg", icon: "📦", popular: true },
  { id: "books", name: "Books", category: "Paper", price: "₹12 /kg", icon: "📚" },
  { id: "grey-board", name: "Grey Board", category: "Paper", price: "₹2 /kg", icon: "📋" },
  { id: "copy", name: "Copy", category: "Paper", price: "₹10 /kg", icon: "📝" },
  { id: "magazines", name: "Magazines", category: "Paper", price: "₹4 /kg", icon: "📖" },
  { id: "record-paper", name: "Record Paper", category: "Paper", price: "₹10 /kg", icon: "📜" },
  { id: "white-paper", name: "White Paper", category: "Paper", price: "₹10 /kg", icon: "📄" },
  { id: "core-pipe", name: "Core Pipe (Cardboard)", category: "Paper", price: "₹1 /kg", icon: "🪵" },

  // Plastic
  { id: "mix-plastic", name: "Mix Plastic", category: "Plastic", price: "₹7 /kg", icon: "♻️" },
  { id: "soft-plastic", name: "Soft Plastic", category: "Plastic", price: "₹10 /kg", icon: "🛍️" },
  { id: "hard-plastic", name: "Hard Plastic", category: "Plastic", price: "₹2 /kg", icon: "🧴" },
  { id: "plastic-jar-15", name: "Plastic Jar (15 Litre)", category: "Plastic", price: "₹10 /kg", icon: "🛢️" },
  { id: "plastic-jar-5", name: "Plastic Jar (5 Litre)", category: "Plastic", price: "₹10 /kg", icon: "🫙" },
  { id: "polythene-ld", name: "Polythene Bags (LD)", category: "Plastic", price: "₹10 /kg", icon: "🛍️" },
  { id: "plastic-pp-bags", name: "Plastic (PP) Bags", category: "Plastic", price: "₹4 /kg", icon: "🛍️" },
  { id: "milk-covers", name: "Milk Covers", category: "Plastic", price: "₹1.7 /kg", icon: "🥛" },
  { id: "pvc-pipe", name: "PVC Pipe", category: "Plastic", price: "₹5 /kg", icon: "🚰" },
  { id: "pet-bottle", name: "PET Bottle", category: "Plastic", price: "₹14 /kg", icon: "🍾", popular: true },
  { id: "water-tank", name: "Water Tank (Sintex)", category: "Plastic", price: "₹20 /kg", icon: "💧" },
  { id: "plastic-can-20", name: "Plastic Can (20 Litre)", category: "Plastic", price: "₹10 /kg", icon: "🛢️" },
  { id: "plastic-drum-200", name: "Plastic Drum (200 Litre)", category: "Plastic", price: "₹15 /kg", icon: "🛢️" },
  { id: "plastic-can-25", name: "Plastic Can (25 Litre)", category: "Plastic", price: "₹15 /kg", icon: "🛢️" },
  { id: "plastic-can-50", name: "Plastic Can (50 Litre)", category: "Plastic", price: "₹15 /kg", icon: "🛢️" },
  { id: "polythene-hm", name: "Polythene Bags (HM)", category: "Plastic", price: "₹10 /kg", icon: "🛍️" },
  { id: "packaging-film", name: "Packaging Film", category: "Plastic", price: "₹1 /kg", icon: "🎞️" },

  // Metal
  { id: "iron", name: "Iron", category: "Metal", price: "₹22 /kg", icon: "🔩", popular: true },
  { id: "tin", name: "Tin", category: "Metal", price: "₹15 /kg", icon: "🥫" },
  { id: "aluminium", name: "Aluminium", category: "Metal", price: "₹150 /kg", icon: "⚙️", popular: true },
  { id: "steel", name: "Steel", category: "Metal", price: "₹40 /kg", icon: "⛓️" },
  { id: "brass", name: "Brass", category: "Metal", price: "₹500 /kg", icon: "🪙", popular: true },
  { id: "copper", name: "Copper", category: "Metal", price: "₹700 /kg", icon: "🥉", popular: true },
  { id: "casting-aluminium", name: "Casting Aluminium", category: "Metal", price: "₹95 /kg", icon: "🏗️" },
  { id: "beverage-cans", name: "Beverage Cans (Aluminium)", category: "Metal", price: "₹25 /kg", icon: "🥤" },
  { id: "copper-wire", name: "Copper Wire", category: "Metal", price: "₹400 /kg", icon: "🔌" },
  { id: "aluminium-wire", name: "Aluminium Wire", category: "Metal", price: "₹25 /kg", icon: "⚡" },
  { id: "cooler-tin", name: "Cooler (Tin)", category: "Metal", price: "₹15 /kg", icon: "❄️" },
  { id: "ms-drums-200", name: "MS Drums (200 Litre)", category: "Metal", price: "₹20 /kg", icon: "🛢️" },
  { id: "ms-drum-50", name: "MS Drum (50 Litre)", category: "Metal", price: "₹20 /kg", icon: "🛢️" },

  // E-waste
  { id: "ewaste", name: "E-waste", category: "E-waste", price: "₹20 /kg", icon: "🔌", image: "/images/ScrapImages/E-waste.png", popular: true },
  { id: "inverter-battery", name: "Inverter Battery", category: "E-waste", price: "₹1700 /pcs", icon: "🔋", popular: true },
  { id: "tv-lcd", name: "Television (LCD/LED)", category: "E-waste", price: "₹100 /pcs", icon: "📺" },
  { id: "laptop", name: "Laptop", category: "E-waste", price: "₹300 /pcs", icon: "💻", popular: true },
  { id: "ac-1ton", name: "AC (1 ton)", category: "E-waste", price: "₹2000 /pcs", icon: "❄️", popular: true },
  { id: "ac-1-5ton", name: "AC (1.5 ton)", category: "E-waste", price: "₹3000 /pcs", icon: "❄️" },
  { id: "washing-machine", name: "Washing machine", category: "E-waste", price: "₹300 /pcs", icon: "🧺" },
  { id: "ac-2ton", name: "AC (2 Ton)", category: "E-waste", price: "₹3500 /pcs", icon: "❄️" },
  { id: "tv-crt", name: "Television (CRT)", category: "E-waste", price: "₹100 /pcs", icon: "📺" },
  { id: "fridge-single", name: "Refrigerator (Single Door)", category: "E-waste", price: "₹500 /pcs", icon: "🧊" },
  { id: "fridge-double", name: "Refrigerator (Double Door)", category: "E-waste", price: "₹700 /pcs", icon: "🧊" },
  { id: "monitor-crt", name: "Monitor (CRT)", category: "E-waste", price: "₹200 /pcs", icon: "🖥️" },
  { id: "monitor-lcd", name: "Monitor (LCD/LED)", category: "E-waste", price: "₹100 /pcs", icon: "🖥️" },
  { id: "cpu", name: "CPU", category: "E-waste", price: "₹150 /pcs", icon: "🖲️" },
  { id: "geyser", name: "Geyser", category: "E-waste", price: "₹200 /pcs", icon: "♨️" },
  { id: "printer", name: "Printer", category: "E-waste", price: "₹200 /pcs", icon: "🖨️" },
  { id: "ups-battery", name: "UPS (with battery)", category: "E-waste", price: "₹200 /pcs", icon: "🔋" },
  { id: "ups-no-battery", name: "UPS (without battery)", category: "E-waste", price: "₹150 /pcs", icon: "🔌" },
  { id: "alkaline-battery", name: "Alkaline Battery (Cell)", category: "E-waste", price: "₹1 /kg", icon: "🔋" },
  { id: "microwave", name: "Microwave", category: "E-waste", price: "₹199 /pcs", icon: "📻" },

  // Other
  { id: "fibre", name: "Fibre", category: "Other", price: "₹5 /kg", icon: "🧶" },
  { id: "cooler-plastic", name: "Cooler (Plastic/Fibre)", category: "Other", price: "₹10 /kg", icon: "🌀" },
  { id: "bike", name: "Bike", category: "Other", price: "₹2000 /pcs", icon: "🏍️", popular: true },
  { id: "car", name: "Car", category: "Other", price: "₹10000 /pcs", icon: "🚗", popular: true },
];

export const CITY_LOCALITIES: Record<string, string[]> = {
  Patna: [
    "Kankarbagh",
    "Boring Road",
    "Bailey Road",
    "Danapur",
    "Patliputra",
    "Rajendra Nagar",
    "Anisabad",
    "Fraser Road",
  ],
  "Bhubaneswar (Odisha)": [
    "Patia",
    "Saheed Nagar",
    "Nayapalli",
    "Jaydev Vihar",
    "Chandrasekharpur",
    "Khandagiri",
    "Old Town",
  ],
  Bhubaneswar: [
    "Patia",
    "Saheed Nagar",
    "Nayapalli",
    "Jaydev Vihar",
    "Chandrasekharpur",
    "Khandagiri",
    "Old Town",
  ],
  Mumbai: [
    "Andheri East",
    "Andheri West",
    "Bandra West",
    "Vile Parle East",
    "Goregaon East",
    "Goregaon West",
    "Malad West",
    "Kandivali West",
    "Ghatkopar East",
    "Ghatkopar West",
    "Kurla West",
    "Chembur",
    "Sion",
    "Dadar West",
  ],
  Delhi: [
    "Connaught Place",
    "Lajpat Nagar",
    "Saket",
    "Hauz Khas",
    "Rohini",
    "Dwarka",
    "Janakpuri",
    "Karol Bagh",
    "Pitampura",
    "Vasant Kunj",
    "Mayur Vihar",
    "South Extension",
  ],
  Bangalore: [
    "Koramangala",
    "Indiranagar",
    "Whitefield",
    "HSR Layout",
    "Jayanagar",
    "Electronic City",
    "Marathahalli",
    "BTM Layout",
    "Malleshwaram",
    "Hebbal",
    "Yelahanka",
    "Banashankari",
  ],
  Pune: [
    "Kothrud",
    "Baner",
    "Hinjewadi",
    "Viman Nagar",
    "Wakad",
    "Aundh",
    "Kalyani Nagar",
    "Hadapsar",
    "Magarpatta",
    "Shivaji Nagar",
    "Pimpri",
    "Chinchwad",
  ],
  Hyderabad: [
    "Hitec City",
    "Gachibowli",
    "Madhapur",
    "Banjara Hills",
    "Jubilee Hills",
    "Kukatpally",
    "Secunderabad",
    "Begumpet",
    "Kondapur",
    "Manikonda",
  ],
  Bhopal: [
    "MP Nagar",
    "Arera Colony",
    "Kolar Road",
    "Hoshangabad Road",
    "Gulmohar",
    "Shahpura",
    "Bairagarh",
    "TT Nagar",
    "Ayodhya Bypass",
    "Govindpura",
  ],
  Indore: [
    "Vijay Nagar",
    "Palasia",
    "Bhawarkua",
    "Scheme 54",
    "Annapurna",
    "Rau",
    "AB Road",
    "Sudama Nagar",
    "Rajendra Nagar",
    "Geeta Bhavan",
  ],
  Nagpur: [
    "Dharampeth",
    "Ramdaspeth",
    "Sadar",
    "Civil Lines",
    "Manish Nagar",
    "Pratap Nagar",
    "Wardha Road",
    "Sitabuldi",
    "Nandanvan",
    "Trimurti Nagar",
  ],
  Raipur: [
    "Shankar Nagar",
    "Pandri",
    "Devendra Nagar",
    "Samta Colony",
    "Telibandha",
    "Tatibandh",
    "VIP Road",
    "Civil Lines",
    "Bhatagaon",
  ],
  Lucknow: [
    "Gomti Nagar",
    "Hazratganj",
    "Aliganj",
    "Indira Nagar",
    "Mahanagar",
    "Jankipuram",
    "Ashiyana",
    "Vikas Nagar",
    "Chowk",
    "Alambagh",
  ],
  Ahmedabad: [
    "SG Highway",
    "Bodakdev",
    "Satellite",
    "Navrangpura",
    "Maninagar",
    "Prahlad Nagar",
    "Vastrapur",
    "Thaltej",
    "Gota",
    "Chandkheda",
  ],
  Noida: [
    "Sector 18",
    "Sector 62",
    "Sector 137",
    "Sector 50",
    "Sector 76",
    "Sector 128",
    "Sector 15",
    "Sector 44",
    "Sector 104",
  ],
  Ghaziabad: [
    "Indirapuram",
    "Vaishali",
    "Vasundhara",
    "Raj Nagar Extension",
    "Crossings Republik",
    "Kaushambi",
    "Sahibabad",
    "Kavi Nagar",
  ],
  Gurgaon: [
    "DLF Phase 1-5",
    "Cyber City",
    "Golf Course Road",
    "Sohna Road",
    "Sector 56",
    "Sector 57",
    "Sector 48",
    "Palam Vihar",
    "MG Road",
  ],
  Jaipur: [
    "Malviya Nagar",
    "Vaishali Nagar",
    "C-Scheme",
    "Mansarovar",
    "Raja Park",
    "Tonk Road",
    "Jagatpura",
    "Bani Park",
    "Ajmer Road",
  ],
};

export function normalizeCityName(raw: string | null | undefined): CityName | null {
  if (!raw) return null;
  const cleaned = raw.trim().toLowerCase();

  for (const city of CITIES_LIST) {
    const target = city.toLowerCase();
    if (target === cleaned) return city;
    // Check without parentheses or partial
    if (city === "Bhubaneswar (Odisha)" && (cleaned === "bhubaneswar" || cleaned === "odisha" || cleaned === "bhubaneswar-odisha")) {
      return "Bhubaneswar (Odisha)";
    }
    if (target.includes(cleaned) || cleaned.includes(target.split(" ")[0])) {
      return city;
    }
  }

  return null;
}

export function getCitySlug(city: CityName): string {
  if (city === "Bhubaneswar (Odisha)") return "bhubaneswar";
  return city.toLowerCase().replace(/\s+/g, "-");
}
