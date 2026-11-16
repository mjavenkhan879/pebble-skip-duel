/**
 * PebbleSkipDuel — screen state machine only.
 * No gameplay maths lives here: simulation and scoring stay in src/game.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, StatusBar, StyleSheet, View } from 'react-native';
import theme from './src/constants/theme';
import { DUEL_ROUNDS } from './src/constants/config';
import {
  DuelState,
  activePlayer,
  activeRound,
  applyTurn,
  createDuel,
  isFinished,
} from './src/game/duelRules';
import { Mode, ThrowRecording, ThrowResult } from './src/game/types';
import { newSessionSeed } from './src/utils/seededRandom';
import useFeedback from './src/hooks/useFeedback';
import useProgress, { ApplyInfo } from './src/hooks/useProgress';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import SkipReplayScreen from './src/screens/SkipReplayScreen';
import PassAndPlayScreen from './src/screens/PassAndPlayScreen';
import PebblePouchScreen from './src/screens/PebblePouchScreen';
import RecordsScreen from './src/screens/RecordsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

type Screen =
  | 'loader'
  | 'menu'
  | 'game'
  | 'gameover'
  | 'replay'
  | 'passAndPlay'
  | 'pouch'
  | 'records'
  | 'settings';

const NO_INFO: ApplyInfo = {
  newRecord: false,
  matched: false,
  previousBest: null,
  unlockedPebbleId: null,
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [lakeId, setLakeId] = useState(1);
  const [mode, setMode] = useState<Mode>('solo');
  const [roundCounter, setRoundCounter] = useState(1);
  const [duel, setDuel] = useState<DuelState | null>(null);
  const [duelSetup, setDuelSetup] = useState(false);
  const [duelId, setDuelId] = useState(0);
  const [result, setResult] = useState<ThrowResult | null>(null);
  const [info, setInfo] = useState<ApplyInfo>(NO_INFO);
  const [recording, setRecording] = useState<ThrowRecording | null>(null);

  const seedRef = useRef(newSessionSeed());
  const { progress, commitThrow, equip, setSound, setHaptics, reset } = useProgress();
  const tick = useFeedback(progress.haptics);

  const goMenu = useCallback(() => {
    setDuel(null);
    setDuelSetup(false);
    setScreen('menu');
  }, []);

  const startSolo = useCallback(() => {
    setRoundCounter(c => c + 1);
    setScreen('game');
  }, []);

  const handlePlay = useCallback(() => {
    if (mode === 'solo') {
      setDuel(null);
      startSolo();
      return;
    }
    setDuelId(id => id + 1);
    setDuel(createDuel(lakeId));
    setDuelSetup(true);
    setScreen('passAndPlay');
  }, [lakeId, mode, startSolo]);

  const handleGameOver = useCallback(
    (res: ThrowResult) => {
      const holder = duel ? 'Player ' + String(activePlayer(duel)) : 'Solo';
      const applied = commitThrow(res, holder);
      if (duel) {
        setDuel(applyTurn(duel, res.throwId, res.skips));
      }
      setResult(res);
      setInfo(applied);
      setRecording(res.recording);
      setScreen('gameover');
    },
    [commitThrow, duel],
  );

  const handleThrowAgain = useCallback(() => {
    if (duel && isFinished(duel)) {
      setDuelId(id => id + 1);
      setDuel(createDuel(duel.lakeId));
      setDuelSetup(true);
      setScreen('passAndPlay');
      return;
    }
    startSolo();
  }, [duel, startSolo]);

  const handleNextTurn = useCallback(() => {
    setDuelSetup(false);
    setScreen('passAndPlay');
  }, []);

  const handleReady = useCallback(() => {
    setScreen('game');
  }, []);

  const handleStartDuel = useCallback(() => {
    setDuelSetup(false);
  }, []);

  const handleSelectLakeFromRecords = useCallback((id: number) => {
    setLakeId(id);
    setScreen('menu');
  }, []);

  const handlePlayLakeFromPouch = useCallback((id: number) => {
    if (id > 0) {
      setLakeId(id);
    }
    setMode('solo');
    setScreen('menu');
  }, []);

  const handleReset = useCallback(() => {
    reset();
    setLakeId(1);
    setMode('solo');
    setResult(null);
    setInfo(NO_INFO);
    setRecording(null);
    setScreen('menu');
  }, [reset]);

  // Android Back follows the documented per-screen behaviour.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'menu' || screen === 'loader') {
        return false;
      }
      if (screen === 'replay') {
        setScreen(result ? 'gameover' : 'menu');
        return true;
      }
      if (screen === 'game') {
        return true;
      }
      goMenu();
      return true;
    });
    return () => sub.remove();
  }, [goMenu, result, screen]);

  const duelRoundCounter = duel ? duelId * 100 + activeRound(duel) : roundCounter;
  const best = progress.records[lakeId] ? progress.records[lakeId].best : 0;
  const activeLakeId = duel ? duel.lakeId : lakeId;
  const turnLabel = duel
    ? 'Player ' + String(activePlayer(duel)) + ' · Round ' +
      String(activeRound(duel)) + '/' + String(DUEL_ROUNDS)
    : 'Solo';

  let content: React.ReactNode = null;

  if (screen === 'loader') {
    content = <LoaderScreen onDone={() => setScreen('menu')} />;
  } else if (screen === 'menu') {
    content = (
      <MenuScreen
        progress={progress}
        lakeId={lakeId}
        mode={mode}
        onLakeChange={setLakeId}
        onModeChange={setMode}
        onPlay={handlePlay}
        onPouch={() => setScreen('pouch')}
        onRecords={() => setScreen('records')}
        onSettings={() => setScreen('settings')}
      />
    );
  } else if (screen === 'game') {
    content = (
      <GameScreen
        key={'throw-' + String(duelRoundCounter) + '-' + String(duel ? duel.activeIndex : 0)}
        lakeId={activeLakeId}
        sessionSeed={seedRef.current}
        roundCounter={duelRoundCounter}
        pebbleId={progress.equipped}
        best={best}
        duel={duel !== null}
        turnLabel={turnLabel}
        haptics={progress.haptics}
        onSkipFeedback={tick}
        onGameOver={handleGameOver}
        onHome={goMenu}
      />
    );
  } else if (screen === 'gameover' && result) {
    content = (
      <GameOverScreen
        result={result}
        previousBest={info.previousBest}
        newRecord={info.newRecord}
        matched={info.matched}
        unlockedPebbleId={info.unlockedPebbleId}
        duel={duel}
        onThrowAgain={handleThrowAgain}
        onNextTurn={handleNextTurn}
        onReplay={() => setScreen('replay')}
        onMenu={goMenu}
      />
    );
  } else if (screen === 'replay') {
    content = (
      <SkipReplayScreen
        recording={recording}
        onBack={() => setScreen(result ? 'gameover' : 'menu')}
        onPlay={() => {
          setScreen('menu');
        }}
      />
    );
  } else if (screen === 'passAndPlay' && duel) {
    content = (
      <PassAndPlayScreen
        duel={duel}
        setup={duelSetup}
        onStart={handleStartDuel}
        onReady={handleReady}
        onLeave={goMenu}
      />
    );
  } else if (screen === 'pouch') {
    content = (
      <PebblePouchScreen
        progress={progress}
        onEquip={equip}
        onPlayLake={handlePlayLakeFromPouch}
        onBack={goMenu}
      />
    );
  } else if (screen === 'records') {
    content = (
      <RecordsScreen
        progress={progress}
        onSelectLake={handleSelectLakeFromRecords}
        onBack={goMenu}
      />
    );
  } else if (screen === 'settings') {
    content = (
      <SettingsScreen
        progress={progress}
        onSound={setSound}
        onHaptics={setHaptics}
        onReset={handleReset}
        onBack={goMenu}
      />
    );
  } else {
    content = (
      <MenuScreen
        progress={progress}
        lakeId={lakeId}
        mode={mode}
        onLakeChange={setLakeId}
        onModeChange={setMode}
        onPlay={handlePlay}
        onPouch={() => setScreen('pouch')}
        onRecords={() => setScreen('records')}
        onSettings={() => setScreen('settings')}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={screen === 'loader' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
});
