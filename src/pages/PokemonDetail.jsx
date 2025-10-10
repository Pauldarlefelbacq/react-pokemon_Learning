import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

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
            <h1>Chargement du pokemon en cours</h1>
        )
    }
    return(
        <main>
            <h1>Fiche de {pkm.pokemonName}</h1>
            <div>
                <h2>Forme de base</h2>
                <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
            </div>
            <div>
                <h2>Forme Chromatique</h2>
                <img src={pokemonData.sprites.front_shiny} alt={pokemonData.name} />
            </div>
            <ul class="">
                {pokemonData.types.map(type =>(
                    <li key={type.type.name}>{type.type.name}</li>
                )
                )}
            </ul>
            <ul>
                {pokemonData.moves.map(move =>(
                    <li key={move.move.name}>{move.move.name}</li>
                ))}
            </ul>
        </main>
    )
}

// juste export ça devrait pas changer
export default PokemonDetails;