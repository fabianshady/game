import React, { useState, useRef } from 'react';
import { Heart, Flame, MessageCircle, Sparkles, RefreshCw, Settings, X, ChevronRight, Upload, AlertCircle, FileJson } from 'lucide-react';

// --- BASE DE DATOS INICIAL VACÍA ---
const INITIAL_GAME_DATA = [];

const App = () => {
  const [started, setStarted] = useState(false);
  const [gameData, setGameData] = useState(INITIAL_GAME_DATA);
  const [currentCard, setCurrentCard] = useState(null);
  const [turn, setTurn] = useState(0); // 0 = Player 1, 1 = Player 2
  const [names, setNames] = useState(['Jugador 1', 'Jugador 2']);
  const [filters, setFilters] = useState({
    soft: true,
    deep: true,
    hot: true,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);

  const handleNameChange = (index, value) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const getFilteredDeck = () => {
    return gameData.filter(card => filters[card.category]);
  };

  const drawCard = () => {
    const deck = getFilteredDeck();
    if (deck.length === 0) return;

    setAnimating(true);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * deck.length);
      setCurrentCard(deck[randomIndex]);
      setTurn(prev => (prev === 0 ? 1 : 0));
      setAnimating(false);
    }, 300);
  };

  const toggleFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- LOGICA DE CARGA DE ARCHIVOS ---
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (Array.isArray(json) && json.length > 0 && json[0].text && json[0].category) {
          setGameData(json);
          setUploadStatus(`¡Vientos! Se cargaron ${json.length} cartas.`);
          setTimeout(() => setUploadStatus(''), 3000);
        } else {
          setUploadStatus('Nel, ese JSON no sirve. Revisa el formato.');
        }
      } catch (error) {
        setUploadStatus('Error: No pude leer ese archivo.');
      }
    };
    reader.readAsText(file);
  };

  const resetGameData = () => {
    setGameData([]);
    setUploadStatus('Mazo vaciado.');
    setCurrentCard(null);
    setTimeout(() => setUploadStatus(''), 3000);
  };

  const getCardColor = (category) => {
    switch(category) {
      case 'soft': return 'from-blue-500 to-cyan-400';
      case 'deep': return 'from-purple-600 to-indigo-500';
      case 'hot': return 'from-red-600 to-rose-500';
      default: return 'from-gray-500 to-gray-400';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'soft': return <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white" />;
      case 'deep': return <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />;
      case 'hot': return <Flame className="w-6 h-6 md:w-8 md:h-8 text-white" />;
      default: return null;
    }
  };

  const getCategoryLabel = (category) => {
    switch(category) {
      case 'soft': return 'DIVERSIÓN & CONEXIÓN';
      case 'deep': return 'PROFUNDO & ALMA';
      case 'hot': return 'FUEGO & PASIÓN';
      default: return '';
    }
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-slate-900 to-slate-900 z-0"></div>
        
        <div className="z-10 w-full max-w-md md:max-w-2xl text-center space-y-8">
          <div className="space-y-2">
            <Heart className="w-16 h-16 md:w-24 md:h-24 text-rose-500 mx-auto animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
              Vínculos & Deseos
            </h1>
            <p className="text-slate-400 text-lg">Una experiencia para parejas</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-slate-700 shadow-xl space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Nosotros somos</label>
              <input 
                type="text" 
                value={names[0]} 
                onChange={(e) => handleNameChange(0, e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-center focus:outline-none focus:border-rose-500 transition-colors text-lg"
                placeholder="Tu nombre"
              />
              <div className="text-slate-600 font-serif italic text-xl">&</div>
              <input 
                type="text" 
                value={names[1]} 
                onChange={(e) => handleNameChange(1, e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-center focus:outline-none focus:border-rose-500 transition-colors text-lg"
                placeholder="Su nombre"
              />
            </div>
          </div>

          <button 
            onClick={() => setStarted(true)}
            className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-purple-900/20 transform transition active:scale-95 flex items-center justify-center gap-2 text-lg md:text-xl"
          >
            Comenzar Experiencia <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  if (gameData.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-900/20 via-transparent to-transparent z-0 pointer-events-none"></div>
         
         <div className="z-10 w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-8 text-center shadow-2xl">
            <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileJson className="w-8 h-8 text-rose-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">¡Faltan las Cartas!</h2>
            <p className="text-slate-400 mb-6">Esta versión no tiene preguntas precargadas. Necesitas subir tu archivo JSON para empezar a jugar.</p>
            
            <button 
              onClick={() => fileInputRef.current.click()}
              className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-900/20"
            >
              <Upload className="w-5 h-5" /> Cargar Pack JSON
            </button>
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
            />

            {uploadStatus && (
              <div className={`mt-4 text-sm p-3 rounded-lg flex items-center justify-center gap-2 ${uploadStatus.includes('Error') || uploadStatus.includes('Nel') ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}`}>
                {uploadStatus.includes('Error') ? <AlertCircle className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                {uploadStatus}
              </div>
            )}
         </div>
      </div>
    );
  }

  return (
    // Agregamos 'items-center' aquí para forzar el centrado horizontal de todo
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-900/20 via-transparent to-transparent z-0 pointer-events-none"></div>
      
      {/* Header con w-full para que estire todo el ancho */}
      <header className="w-full z-10 flex justify-center bg-slate-900/50 backdrop-blur-sm border-b border-white/5">
        <div className="w-full max-w-5xl flex justify-between items-center p-4 md:p-6">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <span className="font-bold tracking-tight text-sm md:text-base">Vínculos & Deseos</span>
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Settings className="w-6 h-6 text-slate-300" />
          </button>
        </div>
      </header>

      {/* Main ajustado: w-full y max-w-5xl, el items-center del padre se encarga de centrarlo */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 z-10 w-full max-w-md md:max-w-5xl transition-all duration-300">
        
        <div className="mb-6 md:mb-8 text-center">
          <p className="text-slate-400 text-sm uppercase tracking-widest mb-1">Turno de</p>
          <h2 className={`text-3xl md:text-5xl font-bold transition-all duration-500 ${turn === 0 ? 'text-rose-300' : 'text-purple-300'}`}>
            {names[turn]}
          </h2>
        </div>

        <div className="w-full aspect-[4/5] md:aspect-video max-h-[70vh] relative perspective-1000">
          {currentCard ? (
            <div 
              className={`w-full h-full rounded-3xl shadow-2xl border border-white/10 p-8 md:p-16 flex flex-col justify-between text-center relative overflow-hidden transition-all duration-500 transform ${animating ? 'opacity-0 scale-95 rotate-y-90' : 'opacity-100 scale-100 rotate-y-0'} bg-gradient-to-br ${getCardColor(currentCard.category)}`}
            >
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="bg-white/20 p-3 md:p-4 rounded-full backdrop-blur-sm shadow-lg">
                  {getCategoryIcon(currentCard.category)}
                </div>
                <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-white/80">
                  {getCategoryLabel(currentCard.category)}
                </span>
              </div>

              <div className="relative z-10 flex-1 flex items-center justify-center py-4">
                <div className="w-full">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-black/20 text-xs md:text-sm font-bold uppercase mb-6 text-white/90 border border-white/10">
                    {currentCard.type === 'challenge' ? '🔥 Reto' : '❓ Pregunta'}
                  </span>
                  <p className="text-2xl md:text-4xl lg:text-5xl font-medium leading-snug drop-shadow-md max-w-4xl mx-auto">
                    {currentCard.text}
                  </p>
                </div>
              </div>

              <div className="relative z-10">
                <div className="w-16 h-1.5 bg-white/30 mx-auto rounded-full"></div>
              </div>

            </div>
          ) : (
            <div className="w-full h-full rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-8 text-center shadow-inner">
              <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-slate-600 mb-6" />
              <h3 className="text-2xl md:text-3xl font-semibold text-slate-300 mb-3">¡Pack Cargado!</h3>
              <p className="text-slate-500 text-lg">Todo listo, jefe. Presiona el botón para sacar la primera carta.</p>
            </div>
          )}
        </div>

        <div className="mt-8 md:mt-10 w-full max-w-md mx-auto">
          <button
            onClick={drawCard}
            disabled={animating}
            className="w-full bg-white text-slate-900 font-bold text-lg md:text-xl py-4 md:py-5 rounded-2xl shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {currentCard ? <><RefreshCw className={`w-6 h-6 ${animating ? 'animate-spin' : ''}`} /> Siguiente Carta</> : 'Sacar Primera Carta'}
          </button>
        </div>

      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-end md:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Configuración</h3>
              <button onClick={() => setShowSettings(false)} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm uppercase tracking-widest text-slate-500 font-bold">Intensidad (Filtros)</h4>
                {/* Soft Filter */}
                <div 
                  onClick={() => toggleFilter('soft')}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${filters.soft ? 'bg-blue-900/30 border-blue-500/50' : 'bg-slate-800 border-slate-700 opacity-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-blue-100">Tranquilo & Divertido</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${filters.soft ? 'border-blue-500 bg-blue-500' : 'border-slate-600'}`}>
                    {filters.soft && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>

                {/* Deep Filter */}
                <div 
                  onClick={() => toggleFilter('deep')}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${filters.deep ? 'bg-purple-900/30 border-purple-500/50' : 'bg-slate-800 border-slate-700 opacity-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-purple-100">Profundo & Conexión</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${filters.deep ? 'border-purple-500 bg-purple-500' : 'border-slate-600'}`}>
                    {filters.deep && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>

                {/* Hot Filter */}
                <div 
                  onClick={() => toggleFilter('hot')}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${filters.hot ? 'bg-rose-900/30 border-rose-500/50' : 'bg-slate-800 border-slate-700 opacity-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-600 rounded-lg">
                      <Flame className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-rose-100">Picante & Erótico</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${filters.hot ? 'border-rose-500 bg-rose-500' : 'border-slate-600'}`}>
                    {filters.hot && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
              </div>

              {/* Custom Pack Upload */}
              <div className="border-t border-slate-700 pt-6">
                <h4 className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-4">Pack Personalizado (JSON)</h4>
                
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-3">
                  <p className="text-xs text-slate-400">Sube un archivo .json para agregar tus propias preguntas al juego.</p>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => fileInputRef.current.click()}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-colors"
                    >
                      <Upload className="w-4 h-4" /> Cambiar Pack
                    </button>
                    <input 
                      type="file" 
                      accept=".json" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                    
                    <button 
                      onClick={resetGameData}
                      className="bg-slate-700 hover:bg-red-900/50 text-slate-300 hover:text-red-200 py-2 px-3 rounded-lg transition-colors"
                      title="Limpiar mazo"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  {uploadStatus && (
                    <div className={`text-xs p-2 rounded flex items-center gap-2 ${uploadStatus.includes('Error') || uploadStatus.includes('Nel') ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}`}>
                      <AlertCircle className="w-3 h-3" />
                      {uploadStatus}
                    </div>
                  )}
                  
                  <div className="text-[10px] text-slate-500 font-mono bg-black/30 p-2 rounded">
                    Formato esperado:<br/>
                    {`[{"type":"question", "category":"hot", "text":"..."}]`}
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowSettings(false)}
              className="w-full mt-6 bg-slate-100 text-slate-900 font-bold py-3 rounded-xl hover:bg-white transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;