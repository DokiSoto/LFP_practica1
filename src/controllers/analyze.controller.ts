import { Request, Response } from "express";
import { LexicalAnalyzer } from "../Analyzer/LexicalAnalyzer";

interface PokemonData {
    name: string;
    type: string;
    health: number;
    attack: number;
    defense: number;
    ivs: number;
}

export const analyze = (req: Request, res: Response) => {
    const input = req.body;
    let lexicalAnalyzer: LexicalAnalyzer = new LexicalAnalyzer();

    let tokenList = lexicalAnalyzer.scanner(input);
    let errorList = lexicalAnalyzer.getErrorList();

    // Procesar equipo Pokémon solo si no hay errores
    let teamData = null;
    if (errorList.length === 0) {
        teamData = extractPokemonData(input);
    }

    res.json({
        tokens: tokenList,
        errors: errorList,
        team: teamData // Añadimos los datos del equipo a la respuesta
    });
};

function extractPokemonData(input: string): { player: string; pokemons: PokemonData[] } | null {
    try {
        // Extraer nombre del jugador
        const playerMatch = input.match(/Jugador:\s*"([^"]+)"/);
        if (!playerMatch) return null;
        
        const player = playerMatch[1];
        const pokemons: PokemonData[] = [];

        // Expresión regular para extraer datos de cada Pokémon
const pokemonRegex = /"([^"]+)"\[([^\]]+)\]\s*:=\s*\(\s*\[salud\]\s*=\s*(\d+)\s*;\s*\[ataque\]\s*=\s*(\d+)\s*;\s*\[defensa\]\s*=\s*(\d+)\s*;/g;
        
        let match;
        while ((match = pokemonRegex.exec(input)) !== null) {
            const name = match[1];
            const type = match[2].toLowerCase();
            const health = parseInt(match[3]);
            const attack = parseInt(match[4]);
            const defense = parseInt(match[5]);
            
            // Calcular IVs (según la fórmula del enunciado)
            const ivs = ((health + attack + defense) / 45) * 100;
            
            pokemons.push({
                name,
                type,
                health,
                attack,
                defense,
                ivs
            });
        }

        // Seleccionar los 6 mejores Pokémon (sin repetir tipos)
        const bestTeam = selectBestTeam(pokemons);

        return {
            player,
            pokemons: bestTeam
        };
    } catch (error) {
        console.error('Error al extraer datos de Pokémon:', error);
        return null;
    }
}

function selectBestTeam(pokemons: PokemonData[]): PokemonData[] {
    // Ordenar por IVs (de mayor a menor)
    const sorted = [...pokemons].sort((a, b) => b.ivs - a.ivs);
    
    const uniqueTypes: Record<string, PokemonData> = {};
    
    // Seleccionar los mejores de cada tipo
    for (const pokemon of sorted) {
        if (!uniqueTypes[pokemon.type] && Object.keys(uniqueTypes).length < 6) {
            uniqueTypes[pokemon.type] = pokemon;
        }
    }
    
    return Object.values(uniqueTypes);
}

export const home = (req: Request, res: Response) => {
    res.render('pages/menu', { name: "duko" });
};
