import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Pokemon({select}){

    const [pokeURL, setPokeURL] = useState("https://pokeapi.co/api/v2/pokemon?limit=20");

    const [pokemonData, setPokemonData] = useState([]);
        useEffect(() => {
            fetch(pokeURL)
            .then(response => response.json())
            .then(data => {
                setPokemonData(data.results);
                console.log(data.results);
                });  
            }, []);
    console.log(pokemonData)

    const pokemonDataFiltered= pokemonData.filter((pkm) => pkm.name.toLowerCase().includes(select.toLowerCase()))

    if (pokemonData.length === 0) {
        return <h2>Chargement...</h2>;
    }

    return (
        <ul>
            {pokemonDataFiltered.map(pokemon => (
            <li key={pokemon.name}>
                <Link to={`/pokemon/${pokemon.name}`}>{pokemon.name}</Link>
            </li>
            ))}
        </ul>
    );
}