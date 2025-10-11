import { useState, useEffect } from "react";
import { Leapfrog } from 'ldrs/react'
import 'ldrs/react/Leapfrog.css'

function Battle(){
// assignation des variables stockant les pokemons
    const [pokemonJ, setPokemonJ] = useState(null);
    const [pokemonO, setPokemonO] = useState(null);
    const [hpJ, setHpJ] = useState(null);
    const [hpO, setHpO] = useState(null);

// fetch des pokemons (statiques pour le moment)    
    useEffect(() => {
        const fetchpkmCombat = async () => {
            const playerPromise = fetch('https://pokeapi.co/api/v2/pokemon/1').then(res => res.json());
            const opponentPromise = fetch('https://pokeapi.co/api/v2/pokemon/4').then(res => res.json());

            const [playerData, opponentData] = await Promise.all([playerPromise, opponentPromise]);

            setPokemonJ(playerData);
            setPokemonO(opponentData);

            const playerInitialHP = playerData.stats.find(stat => stat.stat.name === 'hp').base_stat;
            const opponentInitialHP = opponentData.stats.find(stat => stat.stat.name === 'hp').base_stat;

            setHpJ(playerInitialHP);
            setHpO(opponentInitialHP);
        };
        

        fetchpkmCombat();
    }, []);

// Gestionnaire des attaques
        async function handlePlayerAttack(move){
            const reponse = await fetch(move.move.url);

            const moveDetails = await reponse.json();
            console.log("puissance de l'attaque", moveDetails.power);
            
        };


// affichage global conditionnel
    if (!pokemonJ || !pokemonO){
        return(
            <main>
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
            <div>
                <h2>Votre pokemon</h2>
                <img src={pokemonJ.sprites.front_default} alt={pokemonJ.name} />
                <p>{pokemonJ.name}</p>
                <p>PV : {hpJ}</p>
                <div>
                    {pokemonJ.moves.slice(0, 4).map(move=>(
                        <button 
                        className = "border m-1 p-2"
                        onClick={() =>handlePlayerAttack(move)} 
                        key={move.move.name}>
                            {move.move.name}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h2>Pokemon adverse</h2>
                <img src={pokemonO.sprites.front_default} alt={pokemonO.name} />
                <p>{pokemonO.name}</p>
                <p>PV : {hpO}</p>
                <div>
                    {pokemonO.moves.slice(0, 4).map(move=>(
                        <button key={move.move.name}>{move.move.name}</button>
                    ))}
                </div>
            </div>
        </main>
    )
}
// juste export ça devrait pas changer
export default Battle;