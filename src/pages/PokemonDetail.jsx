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
                <h1 className="text-4xl font-bold my-12">Chargement du pokemon en cours</h1>
                <Leapfrog
                size="100"
                speed="1.5"
                color="black" 
                />
                <a
                className="text-2xl font-bold my-12 hover:text-blue-400" 
                href="/">Retour à la page d'accueil</a>
            </main>
        )
    }
    return(
        <main>
            <h1 className="text-4xl font-bold text-center">Fiche de {pkm.pokemonName}</h1>
            <div className="flex justify-evenly *:flex-column *:items-center">
                <div className="bg-yellow-100 rounded-md p-2">
                    <h2 className="font-bold">Forme de base</h2>
                    <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
                </div>
                <div className="bg-yellow-100 rounded-md p-2">
                    <h2 className="font-bold">Forme Chromatique</h2>
                    <img src={pokemonData.sprites.front_shiny} alt={pokemonData.name} />
                </div>
            </div>
            <ul className="my-11 flex flex-col items-center text-xl font-bold">
                {pokemonData.types.map(type =>(
                    <li key={type.type.name}>{type.type.name}</li>
                )
                )}
            </ul>
            <ul>
                {pokemonData.moves.map(move =>(
                    <li 
                    key={move.move.name}>
                        {move.move.name}
                    </li>
                ))}
            </ul>
        </main>
    )
}

// juste export ça devrait pas changer
export default PokemonDetails;