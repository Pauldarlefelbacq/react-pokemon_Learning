import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Leapfrog } from 'ldrs/react'
import 'ldrs/react/Leapfrog.css'

function PokemonDetails(){

// espace définition des variables utiles
    let pkm = useParams();
    const [pokemonData, SetPokemonData] = useState(null);


// en dessous on vient choper les pokemons
        useEffect(() => {
            fetch(`https://pokeapi.co/api/v2/pokemon/${pkm.pokemonName}`)
            .then(response => response.json())
            .then(data => {
                SetPokemonData(data);
                console.log(data);
                });  
            }, [pkm.pokemonName]);



// return en dessous            
    if (pokemonData === null){
        return(
            <main className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-3xl font-bold mb-8 text-slate-800">Chargement en cours</h1>
                <Leapfrog
                size="100"
                speed="1.5"
                color="#dc2626" 
                />
                <a
                className="text-lg font-semibold mt-8 text-red-600 hover:text-red-700 transition-colors" 
                href="/">← Retour au Pokedex</a>
            </main>
        )
    }
    return(
        <main className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
            <a
                className="inline-block mb-6 text-slate-600 hover:text-slate-800 font-medium transition-colors" 
                href="/">← Retour au Pokedex
            </a>
            
            <h1 className="text-4xl font-bold text-center text-slate-800 capitalize mb-8">{pkm.pokemonName}</h1>
            
            <div className="flex justify-center gap-8 mb-12 flex-wrap">
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-slate-200">
                    <h2 className="font-semibold text-slate-700 text-center mb-3">Forme normale</h2>
                    <img 
                        src={pokemonData.sprites.front_default} 
                        alt={pokemonData.name}
                        className="w-48 h-48 object-contain" 
                    />
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-yellow-400">
                    <h2 className="font-semibold text-slate-700 text-center mb-3">Forme Chromatique</h2>
                    <img 
                        src={pokemonData.sprites.front_shiny} 
                        alt={pokemonData.name}
                        className="w-48 h-48 object-contain" 
                    />
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Types</h2>
                <div className="flex gap-3 justify-center">
                    {pokemonData.types.map(type =>(
                        <span 
                            key={type.type.name}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full font-semibold capitalize shadow-md"
                        >
                            {type.type.name}
                        </span>
                    ))}
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Attaques</h2>
                <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                    {pokemonData.moves.map(move =>(
                        <li 
                            key={move.move.name}
                            className="bg-slate-100 px-4 py-2 rounded-lg text-slate-700 font-medium text-sm hover:bg-slate-200 transition-colors capitalize"
                        >
                            {move.move.name.replace('-', ' ')}
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    )
}

// juste export ça devrait pas changer
export default PokemonDetails;