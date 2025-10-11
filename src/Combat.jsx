import { useState, useEffect } from "react";
import { Leapfrog } from 'ldrs/react'
import 'ldrs/react/Leapfrog.css'

function Battle(){
// assignation des variables stockant les pokemons
    const [pokemonJ, setPokemonJ] = useState(null);
    const [pokemonO, setPokemonO] = useState(null);
    const [hpJ, setHpJ] = useState(null);
    const [hpO, setHpO] = useState(null);
    const [atkJ, setAtkJ] = useState(null);
    const [atkO, setAtkO] = useState(null);
    const [defenseJ, setDefenseJ] = useState(null);
    const [defenseO, setDefenseO] = useState(null);

    const [gameStatus, setGameStatus] = useState('en cours');

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

            const playerInitialAtk = playerData.stats.find(stat => stat.stat.name === 'attack').base_stat;
            const opponentInitialAtk = opponentData.stats.find(stat => stat.stat.name === 'attack').base_stat;

            const playerInitialDefense = playerData.stats.find(stat => stat.stat.name === 'defense').base_stat;
            const opponentInitialDefense = opponentData.stats.find(stat => stat.stat.name === 'defense').base_stat;

            setHpJ(playerInitialHP);
            setHpO(opponentInitialHP);

            setAtkJ(playerInitialAtk);
            setAtkO(opponentInitialAtk);
            
            setDefenseJ(playerInitialDefense);
            setDefenseO(playerInitialDefense);
            console.log(playerInitialDefense)
            
        };
        

        fetchpkmCombat();
    }, []);

// Gestionnaire des attaques
        async function handlePlayerAttack(move){
            const reponse = await fetch(move.move.url);
            const moveDetails = await reponse.json();
            console.log(moveDetails);
            console.log("Points de vie enlevés", atkJ * (moveDetails.power / 100));
            const DgtJ = Math.round(((atkJ * (moveDetails.power / 100))/defenseJ)+2);
            const newOpponentHP = hpO - DgtJ;
            if (newOpponentHP > 0){
                setHpO(hpO - DgtJ);
            }
            else{
                setHpO(0);
                alert("Vous avez gagné");
                setGameStatus('gagné')
            }

            const opponentMoves = pokemonO.moves.slice(0, 4);
            const randomAtk = Math.floor(Math.random() * 4);
            const randomMove = await fetch(opponentMoves[randomAtk].move.url);
            const randomDetails = await randomMove.json()
            const DgtO = Math.round(((atkO * (randomDetails.power / 100))/defenseO)+2);
            const newPlayerHP = hpJ - DgtO;
            if (newPlayerHP > 0){
                setHpJ(hpJ - DgtO );
            }
            else{
                setHpJ(0);
                alert("Vous avez perdu");
                setGameStatus('perdu')
            }
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
    if(gameStatus !== "en cours"){
        return(
            <main>
                <div>
                    <h1>Vous avez {gameStatus} !</h1>
                    <button>Recommencer</button>
                </div>
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
                        disabled={gameStatus !== 'en cours'}
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