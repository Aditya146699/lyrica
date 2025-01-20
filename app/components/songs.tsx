"use client"
import React, { useState } from 'react';
import menu from './songs.json';
import Player from './player';

interface Song {
  song: string; // URL of the audio file
  image: string; // URL of the song image
  name: string; // Song name
  artist: string; // Artist name
}

const Songs: React.FC = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);

  const handleSongClick = (index: number) => {
    setCurrentSongIndex(index);
  };

  const handleNext = () => {
    if (currentSongIndex !== null && currentSongIndex < menu.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else {
      setCurrentSongIndex(0); // Loop back to the first song
    }
  };

  const handlePrevious = () => {
    if (currentSongIndex !== null && currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    } else {
      setCurrentSongIndex(menu.length - 1); // Loop to the last song
    }
  };

  return (
    <div>
      <menu className="flex flex-wrap justify-center p-2">
        {menu.map((song, index) => (
          <div
            key={index}
            className="card glass w-60 m-5 max-[600px]:m-1 max-[600px]:flex max-[600px]:flex-row max-[600px]:w-full max-[600px]:h-20 cursor-pointer"
            onClick={() => handleSongClick(index)}
          >
            <figure>
              <img
                className="max-[600px]:w-[60px] max-[600px]:ml-4 max-[600px]:mr-4"
                src={song.image}
                alt=""
              />
            </figure>
            <div className="card-body max-[600px]:p-1 max-[600px]:w-1/2 max-[600px]:mr-2">
              <h2 className="card-title overflow-hidden text-ellipsis text-nowrap">{song.name}</h2>
              <p>{song.artist}</p>
            </div>
          </div>
        ))}
      </menu>

      {/* Render the Player component */}
      <Player
        currentSong={currentSongIndex !== null ? menu[currentSongIndex] : null}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
};

export default Songs;