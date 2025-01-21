import React, { useRef, useState, useEffect } from 'react';

interface Song {
  song: string; // URL of the audio file
  image: string; // URL of the song image
  name: string; // Song name
  artist: string; // Artist name
}

interface PlayerProps {
  currentSong: Song | null;
  onNext: () => void;
  onPrevious: () => void;
}

const Player: React.FC<PlayerProps> = ({ currentSong, onNext, onPrevious }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<HTMLDivElement>(null); // Ref for the player container
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false); // Fullscreen state

  // Auto-play when the current song changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.song;
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  }, [currentSong]);

  // Update current time and duration
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
      };
    }
  }, []);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle seeking on the progress bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = parseFloat(e.target.value);
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  // Format time (mm:ss)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (playerRef.current) {
      if (!isFullscreen) {
        if (playerRef.current.requestFullscreen) {
          playerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

// utils/randomColor.js
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  let color1 ='#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
    color1 += letters[Math.floor(Math.random() * 16)];
  }
  return `linear-gradient(to right, ${color}, ${color1})`;
};


  return (
    <div
    style= {isFullscreen ? {background : getRandomColor()} :{ } }  
      ref={playerRef}
      className="player glass fixed bottom-0 left-0 right-0 flex flex-col items-center shadow-lg" onDoubleClick={toggleFullscreen}>

      {currentSong && (
        <>
          <div className="flex flex-row w-full mt-5 px-2">

            <div>
              <img src={currentSong.image} alt={currentSong.name} className="w-12 h-12 rounded" />
            </div>

            <div className="flex-1 ml-2">
              <h3 className="text-lg font-semibold">{currentSong.name}</h3>
              <p className="text-sm">{currentSong.artist}</p>
            </div>

            <div className="flex items-center space-x-1">
              <button onClick={onPrevious} className="btn btn-ghost rounded-2xl">
                <b>◄◄</b>
              </button>
              <button onClick={togglePlayPause} className="btn btn-ghost rounded-2xl">
                {isPlaying ? <b>▐ ▌</b> : <b>►</b>}
              </button>
              <button onClick={onNext} className="btn btn-ghost rounded-2xl">
                <b>►►</b>
              </button>
            </div>

          </div>

          {/* Progress Bar and Timeline */}
          <div className="w-full max-w-4xl mt-4 mb-6 px-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm">{formatTime(currentTime)}</span>

              <div className="relative flex w-full h-[10px]">
                <progress
                  className="progress progress-secondary w-full h-2 bg-gray-700 rounded-lg appearance-none"
                  value={currentTime}
                  max={duration}
                ></progress>

                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute top-0 left-0 w-full h-2 bg-transparent appearance-none cursor-pointer"
                />
              </div>

              <span className="text-sm">{formatTime(duration)}</span>
            </div>
          </div>
        </>
      )}
      <audio ref={audioRef} onEnded={onNext} />
    </div>
  );
};

export default Player;
