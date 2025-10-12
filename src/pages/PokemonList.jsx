import { Pokemon } from '../Pokemon';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';



function App(){
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    function handleChange(e){
        setSearch(e.target.value);
    }

    

    const [nb, setNb] = useState(1);
    async function handleClick(){
        const randomID= Math.floor(Math.random() * 1025)+1;
        setNb(randomID);
        const randomPromise = fetch(`https://pokeapi.co/api/v2/pokemon/${randomID}`).then(res => res.json());
        const  randomPkm = await (opponentPromise);
        navigate(`/pokemon/${randomPkm}`);
    }
    console.log(nb);
    
    

    return(
        <main className="m-2">
            <h1 className='text-4xl font-bold text-center my-12'>pokedex</h1>
            <div className='flex items-center justify-center mb-12 *:mx-5 '>
                <input 
                id='search'
                name='search'
                placeholder='Charmander'
                className="border p-1 mx-5 rounded-md "
                type="text" 
                value={search}
                onChange={handleChange}/>
                
                <button 
                className="border rounded-xl p-2 bg-gray-200"
                onClick={handleClick}>
                    Pokemon aléatoire
                </button>
            </div>
            <Link className='bg-blur p-2 text-red-600 hover:text-red-400 hover:text-xl hover:duration-300 font-bold' to="/combat">Aller aux combats</Link>
            <Pokemon select={search} />
        </main>
    )
    }

export default App;