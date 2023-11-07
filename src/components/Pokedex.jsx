// src/components/Pokedex.jsx
import React, { useState } from 'react';
import './Pokedex.css';
import Swal from 'sweetalert2'

const Pokedex = () => {
  const [query, setQuery] = useState('');
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPokemonDescription = async (speciesUrl) => {
    try {
      const response = await fetch(speciesUrl);
      if (!response.ok) throw new Error('Failed to fetch the species info.');

      const data = await response.json();
      const flavorTextEntries = data.flavor_text_entries;
      const englishFlavorText = flavorTextEntries.find((flavor) => flavor.language.name === 'en');

      return englishFlavorText ? englishFlavorText.flavor_text : 'No description available.';
    } catch (error) {
      console.error('Error fetching Pokémon description:', error);
      return 'Description not available.';
    }
  };

  const fetchPokemon = async () => {
    if (!query) return;

    setLoading(true);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
      if (!response.ok) throw new Error(`No Pokemon found for "${query}"`);

      const data = await response.json();

      const description = await fetchPokemonDescription(data.species.url);
      setPokemon({
        ...data,
        description: description
      });
      setError(null);
    } catch (error) {
      setError(error.message);
      setPokemon(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (pokemon) {
      Swal.fire({
        title: pokemon.name,
        text: pokemon.description,
        imageUrl: pokemon.sprites.front_default,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: pokemon.name
      });
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchPokemon();
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-500">
      <div className="DivBranca bg-white rounded-lg p-8 flex flex-col items-center">
        {/*Pokémon*/}
        <div className="text-center pokemon-display mb-4">
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {pokemon && (
            <div className='justify-center'>
              <h2 className="text-center text-xl font-bold capitalize">{pokemon.name}</h2>
              <img className='w-[10rem] cursor-pointer ' onClick={handleClick} src={pokemon.sprites.front_default} alt={pokemon.name} />
            </div>
          )}
        </div>

        {/*Buscar*/}
        <form className="search-area w-full" onSubmit={handleSubmit}>
          <div className='DivInput rounded-full'>
            <input 
              type="text" 
              placeholder="Search your Pokemon..."
              value={query}
              onChange={(e) => setQuery(e.target.value)} 
              className="rounded-full flex-1 px-6 py-4 text-gray-700 focus:outline-none"
            />
            <button className="bg-indigo-500 text-white rounded-full font-semibold px-8 py-4 hover:bg-indigo-400 focus:bg-indigo-600 focus:outline-none">Search</button>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default Pokedex;
