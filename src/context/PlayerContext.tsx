import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Player, GameType, AvatarType } from '../types';
import { loginOrRegisterPlayer, fetchPlayer } from '../services/api';
import { soundManager } from '../utils/audio';

interface ToastData {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'badge' | 'streak';
}

interface PlayerContextType {
  player: Player | null;
  isLoadingPlayer: boolean;
  login: (nickname: string, avatar: AvatarType) => Promise<Player>;
  logout: () => void;
  refreshPlayer: () => Promise<void>;
  updatePlayerState: (updated: Player) => void;
  
  // Navigation
  currentView: 'home' | 'games' | 'leaderboard' | 'explorer' | 'profile' | 'admin';
  setCurrentView: (view: 'home' | 'games' | 'leaderboard' | 'explorer' | 'profile' | 'admin') => void;
  selectedGame: GameType | null;
  selectGame: (game: GameType | null) => void;
  
  // Expo Mode
  isExpoMode: boolean;
  toggleExpoMode: () => void;
  inactivityRemaining: number;
  resetInactivity: () => void;

  // Sound
  isSoundMuted: boolean;
  toggleSound: () => void;

  // Modals & Toasts
  isPlayerModalOpen: boolean;
  openPlayerModal: () => void;
  closePlayerModal: () => void;
  toasts: ToastData[];
  showToast: (title: string, message: string, type?: ToastData['type']) => void;
  removeToast: (id: string) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const INACTIVITY_TIMEOUT = 50; // seconds for expo mode reset

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoadingPlayer, setIsLoadingPlayer] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<'home' | 'games' | 'leaderboard' | 'explorer' | 'profile' | 'admin'>('home');
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [isExpoMode, setIsExpoMode] = useState<boolean>(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(soundManager.getMuted());
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [inactivityRemaining, setInactivityRemaining] = useState<number>(INACTIVITY_TIMEOUT);

  // Load stored player on initial render
  useEffect(() => {
    const savedPlayerId = localStorage.getItem('nihongo_active_player_id');
    if (savedPlayerId) {
      fetchPlayer(savedPlayerId)
        .then((p) => {
          setPlayer(p);
        })
        .catch(() => {
          localStorage.removeItem('nihongo_active_player_id');
        })
        .finally(() => {
          setIsLoadingPlayer(false);
        });
    } else {
      setIsLoadingPlayer(false);
    }
  }, []);

  // Inactivity countdown in Expo Mode
  useEffect(() => {
    if (!isExpoMode) return;

    const timer = setInterval(() => {
      setInactivityRemaining((prev) => {
        if (prev <= 1) {
          // Timeout reached: automatically return to home and invite next player
          setCurrentView('home');
          setSelectedGame(null);
          return INACTIVITY_TIMEOUT;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExpoMode]);

  const resetInactivity = useCallback(() => {
    setInactivityRemaining(INACTIVITY_TIMEOUT);
  }, []);

  // Listen to mouse/touch interactions to reset inactivity
  useEffect(() => {
    if (!isExpoMode) return;

    const handleActivity = () => {
      resetInactivity();
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [isExpoMode, resetInactivity]);

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsSoundMuted(muted);
    showToast(muted ? 'Sound Muted' : 'Sound Enabled', muted ? 'Audio is now off' : 'Audio effects ready', 'info');
  };

  const toggleExpoMode = () => {
    setIsExpoMode((prev) => {
      const next = !prev;
      if (next) {
        showToast('🎪 EXPO MODE ACTIVATED', 'Large screen optimization & auto-reset enabled', 'success');
      } else {
        showToast('Standard Mode', 'Exited Expo Mode', 'info');
      }
      return next;
    });
  };

  const login = async (nickname: string, avatar: AvatarType): Promise<Player> => {
    const registered = await loginOrRegisterPlayer(nickname, avatar);
    setPlayer(registered);
    localStorage.setItem('nihongo_active_player_id', registered.id);
    setIsPlayerModalOpen(false);
    showToast(`ようこそ、${registered.nickname}!`, `Welcome to Nihongo AI Lab! Points: ${registered.totalPoints}`, 'success');
    soundManager.playCorrect();
    return registered;
  };

  const logout = () => {
    setPlayer(null);
    localStorage.removeItem('nihongo_active_player_id');
    setCurrentView('home');
    setSelectedGame(null);
    showToast('Session Reset', 'Ready for the next challenger', 'info');
  };

  const refreshPlayer = async () => {
    if (!player) return;
    try {
      const refreshed = await fetchPlayer(player.id);
      setPlayer(refreshed);
    } catch (err) {
      console.error(err);
    }
  };

  const updatePlayerState = (updated: Player) => {
    setPlayer(updated);
  };

  const showToast = (title: string, message: string, type: ToastData['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev.slice(-3), { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const selectGame = (game: GameType | null) => {
    setSelectedGame(game);
    if (game) {
      setCurrentView('games');
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        player,
        isLoadingPlayer,
        login,
        logout,
        refreshPlayer,
        updatePlayerState,
        currentView,
        setCurrentView,
        selectedGame,
        selectGame,
        isExpoMode,
        toggleExpoMode,
        inactivityRemaining,
        resetInactivity,
        isSoundMuted,
        toggleSound,
        isPlayerModalOpen,
        openPlayerModal: () => setIsPlayerModalOpen(true),
        closePlayerModal: () => setIsPlayerModalOpen(false),
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
