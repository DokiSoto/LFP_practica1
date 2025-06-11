export interface Pokemon {
    name: string;
    type: string;
    stats: {
        salud: number;
        ataque: number;
        defensa: number;
    };
    iv?: number;
    sprite?: string;
}