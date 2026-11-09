// Demo ("exhibition") mode: a visitor can explore the whole app without an account.
// A demo session is a normal NextAuth JWT session whose provider is "demo". Every service
// checks `isDemoSession()` first and answers from the sample data below instead of MySQL,
// so the demo works with no database and can never read or change real data.
// Writes are refused with DEMO_READ_ONLY.

import { auth } from "@/auth";
import { calcularValorDepreciado } from "@/lib/depreciacao-calculo";
import type {
    CategoriaComPatrimoniosType,
    CategoriaType,
    ConviteDetalhadoType,
    DepartamentoType,
    PadraoDepreciacaoType,
    PatrimonioType,
    UserType,
} from "@/lib/types/types";

import { DEMO_USER } from "@/lib/demo-user";

export { DEMO_USER };
export const DEMO_READ_ONLY = "Demo mode is read-only. Create an account to save your own changes.";

export async function isDemoSession(): Promise<boolean> {
    const session = await auth();
    return session?.provider === "demo";
}

type Role = "owner" | "admin" | "member";

const PADROES: PadraoDepreciacaoType[] = [
    { id: 1, categoria: "Computers & peripherals", descricao: "Laptops, desktops, printers", taxa_anual_percent: 20, vida_util_anos: 5 },
    { id: 2, categoria: "Furniture & fixtures", descricao: "Desks, chairs, cabinets, shelves", taxa_anual_percent: 10, vida_util_anos: 10 },
    { id: 3, categoria: "Vehicles", descricao: "Cars, vans, trucks", taxa_anual_percent: 20, vida_util_anos: 5 },
    { id: 4, categoria: "Machinery & equipment", descricao: "Industrial and commercial equipment", taxa_anual_percent: 10, vida_util_anos: 10 },
    { id: 5, categoria: "Communication equipment", descricao: "Phones, radios, network gear", taxa_anual_percent: 20, vida_util_anos: 5 },
    { id: 6, categoria: "Tools", descricao: "General tools", taxa_anual_percent: 15, vida_util_anos: 7 },
];

const PEOPLE = {
    ana: { id: "demo-ana", nome: "Ana Souza", email: "ana@acme.co" },
    lucas: { id: "demo-lucas", nome: "Lucas Martins", email: "lucas@acme.co" },
    bia: { id: "demo-bia", nome: "Bia Costa", email: "bia@acme.co" },
    rafael: { id: "demo-rafael", nome: "Rafael Lima", email: "rafael@acme.co" },
    joao: { id: "demo-joao", nome: "João Pereira", email: "joao@acme.co" },
};

const ROOMS: (DepartamentoType & { id_departamentos: number; role: Role; members: { id: string; nome: string; email: string; role: Role }[] })[] = [
    {
        id_departamentos: 9001,
        titulo: "Operations",
        descricao: "Everything the head office runs on: laptops, furniture and the company vans.",
        localizacao: "Head office · Vancouver",
        codigo_convite: "DEPT-7F3KQ2XHMA",
        fotoDepartamento: "/placeholderImage.jpg",
        created_at: "2025-03-12",
        role: "owner",
        members: [
            { id: DEMO_USER.id, nome: DEMO_USER.name, email: DEMO_USER.email, role: "owner" },
            { ...PEOPLE.lucas, role: "admin" },
            { ...PEOPLE.bia, role: "member" },
            { ...PEOPLE.rafael, role: "member" },
        ],
    },
    {
        id_departamentos: 9002,
        titulo: "IT",
        descricao: "Servers, network and every device handed out to the team.",
        localizacao: "3rd floor",
        codigo_convite: "DEPT-K8PW4NZT2R",
        fotoDepartamento: "/placeholderImage.jpg",
        created_at: "2025-05-02",
        role: "admin",
        members: [
            { ...PEOPLE.ana, role: "owner" },
            { id: DEMO_USER.id, nome: DEMO_USER.name, email: DEMO_USER.email, role: "admin" },
            { ...PEOPLE.joao, role: "member" },
        ],
    },
    {
        id_departamentos: 9003,
        titulo: "Warehouse",
        descricao: "Forklifts, racking and the workshop tools.",
        localizacao: "Building B",
        codigo_convite: "DEPT-WH3R5LJ9QC",
        fotoDepartamento: "/placeholderImage.jpg",
        created_at: "2025-08-21",
        role: "member",
        members: [
            { ...PEOPLE.rafael, role: "owner" },
            { ...PEOPLE.ana, role: "admin" },
            { id: DEMO_USER.id, nome: DEMO_USER.name, email: DEMO_USER.email, role: "member" },
        ],
    },
];

type DemoAsset = Omit<PatrimonioType, "valor_atual" | "id_categoria">;
type DemoCategory = { id: number; id_departamento: number; nome: string; descricao: string; padrao: number; assets: DemoAsset[] };

let nextAssetId = 1;
const asset = (nome: string, codigo: string, valor: number, data: string, local: string, descricao: string, taxa: number): DemoAsset => ({
    id: 70000 + nextAssetId++,
    nome,
    codigo_patrimonio: codigo,
    valor_inicial: valor,
    data_aquisicao: data,
    localizacao: local,
    descricao,
    tempo_depreciacao: taxa,
    status: "ativo",
});

const CATEGORIES: DemoCategory[] = [
    // Operations
    {
        id: 8101, id_departamento: 9001, nome: "Laptops", descricao: "Laptops assigned to the office team.", padrao: 1, assets: [
            asset("MacBook Pro 14\"", "CYB-0142", 2400, "2025-05-14", "Desk 12", "M3 Pro, 18 GB RAM, 512 GB", 20),
            asset("Dell XPS 13", "CYB-0156", 1800, "2023-11-03", "Desk 4", "Core i7, 16 GB RAM, 1 TB", 20),
            asset("ThinkPad T14", "CYB-0171", 1500, "2026-05-20", "Desk 7", "Ryzen 7, 32 GB RAM", 20),
            asset("MacBook Air", "CYB-0188", 1200, "2024-11-08", "Reception", "M2, 8 GB RAM, 256 GB", 20),
        ],
    },
    {
        id: 8102, id_departamento: 9001, nome: "Furniture", descricao: "Desks, chairs and meeting room furniture.", padrao: 2, assets: [
            asset("Standing desk", "CYB-0051", 900, "2024-11-11", "Open space", "Electric, 160×80 cm", 10),
            asset("Ergonomic chair", "CYB-0318", 650, "2022-11-02", "Desk 12", "Mesh back, lumbar support", 10),
            asset("Meeting table", "CYB-0322", 2100, "2020-11-16", "Room A", "Oak, 8 seats", 10),
            asset("Lounge sofa", "CYB-0330", 1400, "2023-06-01", "Lobby", "3 seats, fabric", 10),
        ],
    },
    {
        id: 8103, id_departamento: 9001, nome: "Vehicles", descricao: "Company vans and cars.", padrao: 3, assets: [
            asset("Ford Transit", "CYB-0233", 38000, "2025-11-04", "Garage", "2.0 diesel, 2025", 20),
            asset("Toyota Corolla", "CYB-0241", 24000, "2022-04-19", "Garage", "Hybrid, sales team car", 20),
        ],
    },
    { id: 8104, id_departamento: 9001, nome: "Kitchen", descricao: "Appliances for the staff kitchen.", padrao: 4, assets: [] },
    // IT
    {
        id: 8201, id_departamento: 9002, nome: "Servers", descricao: "Rack servers in the server room.", padrao: 1, assets: [
            asset("Dell R750 server", "CYB-0907", 14500, "2024-02-10", "Server room", "2× Xeon, 256 GB RAM", 20),
            asset("Synology NAS", "CYB-0912", 3200, "2023-09-25", "Server room", "48 TB raw", 20),
        ],
    },
    {
        id: 8202, id_departamento: 9002, nome: "Network", descricao: "Switches, routers and access points.", padrao: 5, assets: [
            asset("Network switch 48p", "CYB-0157", 2800, "2024-06-03", "Rack A", "PoE+, 48 ports", 20),
            asset("Wi-Fi access point", "CYB-0160", 450, "2025-01-15", "3rd floor", "Wi-Fi 6E", 20),
            asset("Firewall", "CYB-0163", 3900, "2022-10-07", "Rack A", "Next-gen, HA pair", 20),
        ],
    },
    {
        id: 8203, id_departamento: 9002, nome: "Monitors", descricao: "Displays handed out to the team.", padrao: 1, assets: [
            asset("27\" 4K monitor", "CYB-0420", 520, "2025-02-14", "Desk 3", "USB-C, 90 W", 20),
            asset("34\" ultrawide", "CYB-0421", 890, "2023-12-01", "Desk 9", "Curved, 144 Hz", 20),
        ],
    },
    // Warehouse
    {
        id: 8301, id_departamento: 9003, nome: "Machinery", descricao: "Lifting and handling equipment.", padrao: 4, assets: [
            asset("Forklift FX-2", "CYB-0388", 24000, "2023-05-22", "Building B", "2.5 t, electric", 10),
            asset("Pallet jack", "CYB-0815", 1100, "2024-08-30", "Dock 2", "Manual, 2.5 t", 10),
            asset("Laser cutter", "CYB-0077", 18000, "2024-11-12", "Workshop", "CO₂, 130 W", 10),
        ],
    },
    {
        id: 8302, id_departamento: 9003, nome: "Tools", descricao: "Workshop tools.", padrao: 6, assets: [
            asset("Air compressor", "CYB-0999", 3200, "2021-11-05", "Workshop", "200 L, 10 bar", 15),
            asset("Cordless drill kit", "CYB-1003", 380, "2025-03-18", "Workshop", "18 V, 2 batteries", 15),
        ],
    },
];

const DEMO_INVITES: ConviteDetalhadoType[] = [
    {
        id: 99001,
        id_departamentos: 9004,
        id_remetente: PEOPLE.joao.id,
        id_destinatario: DEMO_USER.id,
        status: "pendente",
        criado_em: "2026-11-06 10:24:00",
        departamento_titulo: "Marketing",
        remetente_nome: PEOPLE.joao.nome,
    },
];

const withValue = (a: DemoAsset, categoryId: number): PatrimonioType => ({
    ...a,
    id_categoria: categoryId,
    valor_atual: calcularValorDepreciado(a.valor_inicial, a.tempo_depreciacao, a.data_aquisicao),
});

const findRoom = (id: number) => ROOMS.find((r) => r.id_departamentos === Number(id)) ?? null;
const findCategory = (id: number) => CATEGORIES.find((c) => c.id === Number(id)) ?? null;
const toRoom = ({ members, ...room }: (typeof ROOMS)[number]): DepartamentoType => ({ ...room, num_participantes: members.length, status: "ativo" });

export const demo = {
    rooms: (): DepartamentoType[] => ROOMS.map(toRoom),
    room: (id: number): DepartamentoType | null => {
        const room = findRoom(id);
        return room ? toRoom(room) : null;
    },
    role: (roomId: number): Role | null => findRoom(roomId)?.role ?? null,
    members: (roomId: number) =>
        (findRoom(roomId)?.members ?? []).map((m) => ({ ...m, avatar_url: null, ultimo_login: null, created_at: null })),
    host: (roomId: number): UserType | null => {
        const owner = findRoom(roomId)?.members.find((m) => m.role === "owner");
        return owner ? { id: owner.id, nome: owner.nome, email: owner.email } : null;
    },
    padroes: (): PadraoDepreciacaoType[] => PADROES,
    categories: (roomId: number): CategoriaType[] =>
        CATEGORIES.filter((c) => c.id_departamento === Number(roomId)).map((c) => ({
            id: c.id,
            id_departamento: c.id_departamento,
            nome: c.nome,
            descricao: c.descricao,
            padrao_depreciacao_id: c.padrao,
            status: "ativo",
        })),
    category: (id: number): CategoriaType | null => {
        const c = findCategory(id);
        return c ? { id: c.id, id_departamento: c.id_departamento, nome: c.nome, descricao: c.descricao, padrao_depreciacao_id: c.padrao, status: "ativo" } : null;
    },
    categoriesWithTotals: (roomId: number): CategoriaComPatrimoniosType[] =>
        CATEGORIES.filter((c) => c.id_departamento === Number(roomId)).map((c) => {
            const assets = c.assets.map((a) => withValue(a, c.id));
            const initial = assets.reduce((s, a) => s + a.valor_inicial, 0);
            const current = assets.reduce((s, a) => s + a.valor_atual, 0);
            const padrao = PADROES.find((p) => p.id === c.padrao);
            return {
                id: c.id,
                nome: c.nome,
                descricao: c.descricao,
                padrao_depreciacao_id: c.padrao,
                padrao_categoria: padrao?.categoria ?? null,
                taxa_anual_percent: padrao?.taxa_anual_percent ?? null,
                total_patrimonios: assets.length,
                valor_total: current,
                percentual_valor: initial ? Math.round((100 * current) / initial) : null,
            };
        }),
    assets: (categoryId: number): PatrimonioType[] => {
        const c = findCategory(categoryId);
        return c ? c.assets.map((a) => withValue(a, c.id)) : [];
    },
    asset: (id: number): PatrimonioType | null => {
        for (const c of CATEGORIES) {
            const a = c.assets.find((x) => x.id === Number(id));
            if (a) return withValue(a, c.id);
        }
        return null;
    },
    summary: (roomId: number) => {
        const assets = CATEGORIES.filter((c) => c.id_departamento === Number(roomId)).flatMap((c) => c.assets.map((a) => withValue(a, c.id)));
        return {
            total_patrimonios: assets.length,
            valor_total_inicial: assets.reduce((s, a) => s + a.valor_inicial, 0),
            valor_total_atual: assets.reduce((s, a) => s + a.valor_atual, 0),
        };
    },
    invites: (): ConviteDetalhadoType[] => DEMO_INVITES,
    account: () => ({ nome: DEMO_USER.name, email: DEMO_USER.email, temSenha: false, temGoogle: false, emailVerificado: true }),
};
