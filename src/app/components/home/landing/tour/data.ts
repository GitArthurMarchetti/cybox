// Sample data for the landing-page product tour. Mirrors the real app's model:
// rooms (departments) → categories (with an annual depreciation rate) → assets.

export type Role = "owner" | "admin" | "member";

export const ROLE_LABEL: Record<Role, string> = { owner: "Owner", admin: "Admin", member: "Member" };

// Same colours the app uses for role badges (src/lib/utils/roleUtils.ts)
export const ROLE_BADGE: Record<Role, string> = {
  owner: "bg-yellow-500 text-black",
  admin: "bg-blue-600 text-white",
  member: "bg-[#1a1a1a] text-[#8c8888] ring-1 ring-white/10",
};

export type Room = { id: string; name: string; location: string; assets: number; value: number; members: number; role: Role; hue: string };

export const ROOMS: Room[] = [
  { id: "ops", name: "Operations", location: "Vancouver HQ", assets: 142, value: 1_284_000, members: 8, role: "owner", hue: "from-primary/40" },
  { id: "it", name: "IT", location: "3rd floor", assets: 64, value: 412_000, members: 5, role: "admin", hue: "from-blue-500/30" },
  { id: "wh", name: "Warehouse", location: "Building B", assets: 38, value: 860_000, members: 4, role: "member", hue: "from-amber/40" },
];

export const JOINED_ROOM: Room = { id: "mkt", name: "Marketing", location: "Remote", assets: 12, value: 48_000, members: 3, role: "member", hue: "from-emerald-500/30" };

export const INVITE_CODE = "CYB-7F3K";

export type Member = { name: string; email: string; role: Role; color: string };

export const MEMBERS: Member[] = [
  { name: "Ana Souza", email: "ana@acme.co", role: "owner", color: "#F6CF45" },
  { name: "Lucas Martins", email: "lucas@acme.co", role: "admin", color: "#60A5FA" },
  { name: "Bia Costa", email: "bia@acme.co", role: "member", color: "#FFAE3F" },
  { name: "Rafael Lima", email: "rafael@acme.co", role: "member", color: "#EDE8DA" },
];

// Mirrors the permission checks in src/lib/authz.ts and the services.
export const PERMISSIONS: { label: string; roles: Role[] }[] = [
  { label: "See every asset and its value", roles: ["owner", "admin", "member"] },
  { label: "Add and edit categories and assets", roles: ["owner", "admin", "member"] },
  { label: "Invite people to the room", roles: ["owner", "admin", "member"] },
  { label: "Edit the room's details", roles: ["owner", "admin"] },
  { label: "Regenerate the invite code", roles: ["owner", "admin"] },
  { label: "Delete the room", roles: ["owner"] },
];

export type Asset = { name: string; code: string; acquired: string; age: number; price: number; location: string; specs: string };
export type Category = { id: string; name: string; rate: number; assets: Asset[] };

export const CATEGORIES: Category[] = [
  {
    id: "laptops",
    name: "Laptops",
    rate: 20,
    assets: [
      { name: "MacBook Pro 14\"", code: "CYB-0142", acquired: "May 2025", age: 1.5, price: 2400, location: "Desk 12", specs: "M3 Pro, 18 GB, 512 GB" },
      { name: "Dell XPS 13", code: "CYB-0156", acquired: "Nov 2023", age: 3, price: 1800, location: "Desk 4", specs: "i7, 16 GB, 1 TB" },
      { name: "ThinkPad T14", code: "CYB-0171", acquired: "May 2026", age: 0.5, price: 1500, location: "Desk 7", specs: "Ryzen 7, 32 GB" },
      { name: "MacBook Air", code: "CYB-0188", acquired: "Nov 2024", age: 2, price: 1200, location: "Reception", specs: "M2, 8 GB, 256 GB" },
    ],
  },
  {
    id: "furniture",
    name: "Furniture",
    rate: 10,
    assets: [
      { name: "Standing desk", code: "CYB-0051", acquired: "Nov 2024", age: 2, price: 900, location: "Open space", specs: "Electric, 160×80 cm" },
      { name: "Ergonomic chair", code: "CYB-0318", acquired: "Nov 2022", age: 4, price: 650, location: "Desk 12", specs: "Mesh, lumbar support" },
      { name: "Meeting table", code: "CYB-0322", acquired: "Nov 2020", age: 6, price: 2100, location: "Room A", specs: "Oak, 8 seats" },
    ],
  },
  {
    id: "vehicles",
    name: "Vehicles",
    rate: 20,
    assets: [
      { name: "Ford Transit", code: "CYB-0233", acquired: "Nov 2025", age: 1, price: 38000, location: "Garage", specs: "2.0 diesel, 2025" },
      { name: "Forklift FX-2", code: "CYB-0388", acquired: "May 2023", age: 3.5, price: 24000, location: "Building B", specs: "2.5 t, electric" },
    ],
  },
  {
    id: "machinery",
    name: "Machinery",
    rate: 10,
    assets: [
      { name: "Laser cutter", code: "CYB-0077", acquired: "Nov 2024", age: 2, price: 18000, location: "Workshop", specs: "CO₂, 130 W" },
      { name: "Air compressor", code: "CYB-0999", acquired: "Nov 2021", age: 5, price: 3200, location: "Workshop", specs: "200 L, 10 bar" },
    ],
  },
  { id: "kitchen", name: "Kitchen", rate: 10, assets: [] },
];

// Same straight-line rule the app uses (src/lib/depreciacao-calculo.ts).
export const valueToday = (a: Asset, rate: number) => Math.max(0, a.price * (1 - (rate / 100) * a.age));
export const percentLeft = (a: Asset, rate: number) => Math.round((valueToday(a, rate) / a.price) * 100);

// Same thresholds the app uses for the value colour.
export const valueTone = (pct: number) =>
  pct >= 70 ? { text: "text-green-400", bg: "bg-green-500" } : pct >= 50 ? { text: "text-yellow-400", bg: "bg-yellow-500" } : { text: "text-red-400", bg: "bg-red-500" };

export const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const compact = (n: number) =>
  "$" + n.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: n >= 1_000_000 ? 2 : 0 });
