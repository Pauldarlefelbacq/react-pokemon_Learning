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
        const  randomPkm = await (randomPromise);
        navigate(`/pokemon/${randomPkm.name}`);
        console.log(randomPkm);
        
    }
    console.log(nb);
    
    

    return(
        <main className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h1 className='text-5xl font-bold text-slate-800 mb-3 tracking-tight'>Pokédex</h1>
            </div>
            
            <div className='flex flex-wrap items-center justify-center gap-4 mb-8'>
                <input 
                id='search'
                name='search'
                placeholder='Search Pokemon...'
                className="input-field w-64"
                type="text" 
                value={search}
                onChange={handleChange}/>
                
                <button 
                className="btn-primary"
                onClick={handleClick}>
                    Pokemon aléatoire
                </button>
                
                <Link className='btn-secondary' to="/combat">Combat</Link>
            </div>
            
            <Pokemon select={search} />
        </main>
    )
    }

export default App;