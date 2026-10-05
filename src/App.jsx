import React, { useState, useRef, useEffect } from 'react';
import { initialSongs } from './mockData';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, 
  Search, Home, Library, Heart, Disc3 
} from 'lucide-react';

export default function App() {
  const [songs] = useState(initialSongs);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [volume, setVolume] = useState(0.8);
  const [likedSongs, setLikedSongs] = useState([]);

  const audioRef = useRef(new Audio(songs[0].audioSrc));
  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSongIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => handleNext();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSongIndex]);

  const playSong = (index) => {
    if (currentSongIndex === index) {
      setIsPlaying(!isPlaying);
    } else {
      audioRef.current.pause();
      audioRef.current.src = songs[index].audioSrc;
      audioRef.current.load();
      setCurrentSongIndex(index);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    playSong((currentSongIndex + 1) % songs.length);
  };

  const handlePrev = () => {
    playSong((currentSongIndex - 1 + songs.length) % songs.length);
  };

  const handleSeek = (e) => {
    const newTime = Number(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolume = (e) => {
    const newVol = Number(e.target.value);
    setVolume(newVol);
    audioRef.current.volume = newVol;
  };

  const toggleLike = (id) => {
    setLikedSongs(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const filteredSongs = songs.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
      <div className="flex-1 flex overflow-hidden p-2 gap-2">
        <aside className="w-64 bg-spotify-black rounded-lg flex flex-col gap-4 p-4 hidden md:flex">
          <div className="flex items-center gap-2 px-2 text-spotify-green font-bold text-xl">
            <Disc3 className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Spotify Clone</span>
          </div>

          <div className="flex flex-col gap-3 mt-4 text-spotify-grey font-medium text-sm">
            <button className="flex items-center gap-4 hover:text-white transition">
              <Home className="w-6 h-6" /> Trang chủ
            </button>
            <button className="flex items-center gap-4 hover:text-white transition">
              <Library className="w-6 h-6" /> Thư viện
            </button>
          </div>

          <div className="h-[1px] bg-spotify-lightdark my-2"></div>

          <div className="flex-1 overflow-y-auto">
            <span className="text-xs uppercase text-spotify-grey font-semibold tracking-wider">Danh sách phát</span>
            <div className="mt-3 flex flex-col gap-2 text-sm text-spotify-grey">
              <p className="hover:text-white cursor-pointer transition">Top Bài Hát Việt</p>
              <p className="hover:text-white cursor-pointer transition">Acoustic Chill</p>
              <p className="hover:text-white cursor-pointer transition">Đã thích ({likedSongs.length})</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-gradient-to-b from-emerald-950 via-spotify-black to-spotify-black rounded-lg overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="relative w-72">
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-zinc-400" />
              <input 
                type="text"
                placeholder="Bạn muốn nghe bài gì?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-spotify-lightdark text-sm rounded-full py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-white transition"
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-600 to-teal-800 p-6 rounded-lg mb-8 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-emerald-200">Đang phát</p>
              <h1 className="text-3xl md:text-5xl font-extrabold mt-2 mb-2">{currentSong.title}</h1>
              <p className="text-sm text-emerald-100 font-medium">{currentSong.artist}</p>
            </div>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-spotify-green hover:scale-105 p-4 rounded-full text-black shadow-lg transition"
            >
              {isPlaying ? <Pause fill="black" className="w-8 h-8" /> : <Play fill="black" className="w-8 h-8 ml-0.5" />}
            </button>
          </div>

          <h2 className="text-xl font-bold mb-4">Gợi ý cho bạn</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredSongs.map((song) => {
              const isSelected = song.id === currentSong.id;
              return (
                <div 
                  key={song.id}
                  onClick={() => playSong(songs.findIndex(s => s.id === song.id))}
                  className={`group p-4 rounded-lg bg-spotify-dark hover:bg-spotify-lightdark transition cursor-pointer relative ${isSelected ? 'border border-spotify-green' : ''}`}
                >
                  <div className="relative mb-3 aspect-square rounded-md overflow-hidden bg-zinc-800">
                    <img src={song.cover} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <button 
                      className={`absolute right-2 bottom-2 bg-spotify-green p-3 rounded-full text-black shadow-lg transition duration-200 ${isSelected && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'}`}
                    >
                      {isSelected && isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
                    </button>
                  </div>
                  <h3 className="font-semibold text-sm truncate">{song.title}</h3>
                  <p className="text-xs text-spotify-grey truncate mt-1">{song.artist}</p>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <footer className="h-20 bg-spotify-black border-t border-spotify-lightdark px-4 flex items-center justify-between">
        <div className="flex items-center gap-3 w-1/4 min-w-[160px]">
          <img src={currentSong.cover} alt={currentSong.title} className="w-14 h-14 rounded object-cover" />
          <div className="truncate">
            <h4 className="text-sm font-medium hover:underline cursor-pointer truncate">{currentSong.title}</h4>
            <p className="text-xs text-spotify-grey truncate">{currentSong.artist}</p>
          </div>
          <button 
            onClick={() => toggleLike(currentSong.id)}
            className="text-spotify-grey hover:text-white ml-2 transition"
          >
            <Heart className={`w-5 h-5 ${likedSongs.includes(currentSong.id) ? 'fill-spotify-green text-spotify-green' : ''}`} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-xl">
          <div className="flex items-center gap-6">
            <button onClick={handlePrev} className="text-spotify-grey hover:text-white transition">
              <SkipBack className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white p-2 rounded-full text-black hover:scale-105 transition"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
            </button>
            <button onClick={handleNext} className="text-spotify-grey hover:text-white transition">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full flex items-center gap-2 text-xs text-spotify-grey font-mono">
            <span>{formatTime(currentTime)}</span>
            <input 
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-spotify-green"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 w-1/4">
          <Volume2 className="w-5 h-5 text-spotify-grey" />
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolume}
            className="w-24 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-spotify-green"
          />
        </div>
      </footer>
    </div>
  );
}