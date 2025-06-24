"use client";

import { useState } from "react";
import "../styles/battles.css";

export default function Battles({
  coaches,
  teams,
  setTeams,
  eliminatedCandidates,
  setEliminatedCandidates,
  onNext,
}) {
  const [currentCoachIndex, setCurrentCoachIndex] = useState(0);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [battleResult, setBattleResult] = useState(null);
  const [battlesComplete, setBattlesComplete] = useState(false);
  const [qualifiedCandidates, setQualifiedCandidates] = useState(new Set());

  const currentCoach = coaches[currentCoachIndex];
  const currentTeam =
    teams[currentCoach?.id]?.filter((c) => !qualifiedCandidates.has(c.id)) ||
    [];

  const canCreateBattle =
    currentTeam.length >= 2 &&
    selectedCandidates.length >= 2 &&
    selectedCandidates.length <= 3;
  const canProceedToNext = currentTeam.length <= 1;

  const toggleCandidateSelection = (candidate) => {
    if (selectedCandidates.find((c) => c.id === candidate.id)) {
      setSelectedCandidates(
        selectedCandidates.filter((c) => c.id !== candidate.id)
      );
    } else if (selectedCandidates.length < 3) {
      setSelectedCandidates([...selectedCandidates, candidate]);
    }
  };

  const startBattle = () => {
    setBattleResult({
      candidates: selectedCandidates,
      winner: null,
    });
  };

  const selectWinner = (winner) => {
    const losers = selectedCandidates.filter((c) => c.id !== winner.id);

    // Marquer le gagnant comme qualifié
    setQualifiedCandidates((prev) => new Set([...prev, winner.id]));

    // Retirer les perdants de l'équipe
    const newTeams = { ...teams };
    newTeams[currentCoach.id] = newTeams[currentCoach.id].filter(
      (c) => !losers.find((l) => l.id === c.id)
    );
    setTeams(newTeams);

    // Ajouter aux éliminés
    const newEliminated = losers.map((loser) => ({
      ...loser,
      eliminatedIn: "battles",
      eliminatedBy: currentCoach.name,
    }));
    setEliminatedCandidates([...eliminatedCandidates, ...newEliminated]);

    setBattleResult({ ...battleResult, winner });
    setSelectedCandidates([]);
  };

  const nextCoach = () => {
    setBattleResult(null);
    setSelectedCandidates([]);

    if (currentCoachIndex < coaches.length - 1) {
      setCurrentCoachIndex(currentCoachIndex + 1);
    } else {
      // Vérifier si toutes les équipes sont prêtes
      const allTeamsReady = coaches.every((coach) => {
        const availableTeam =
          teams[coach.id]?.filter((c) => !qualifiedCandidates.has(c.id)) || [];
        return availableTeam.length <= 1;
      });

      if (allTeamsReady) {
        setBattlesComplete(true);
      } else {
        setCurrentCoachIndex(0); // Nouveau tour
      }
    }
  };

  if (battlesComplete) {
    return (
      <div className="battles-complete">
        <div className="completion-header">
          <h1>BATTLES TERMINÉES</h1>
          <p>Les qualifiés pour les Lives sont déterminés</p>
        </div>

        <div className="qualified-showcase">
          {coaches.map((coach) => {
            const qualified =
              teams[coach.id]?.filter((c) => qualifiedCandidates.has(c.id)) ||
              [];
            return (
              <div
                key={coach.id}
                className="qualified-team"
                style={{ "--coach-color": coach.color }}
              >
                <div className="team-header">
                  <div className="coach-avatar">
                    {coach.name.charAt(0).toUpperCase()}
                  </div>
                  <h3>ÉQUIPE {coach.name.toUpperCase()}</h3>
                </div>
                <div className="qualified-count">
                  {qualified.length} QUALIFIÉS
                </div>
                <div className="qualified-list">
                  {qualified.map((candidate) => (
                    <div key={candidate.id} className="qualified-card">
                      <div className="candidate-avatar">
                        {candidate.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{candidate.name}</span>
                      <div className="qualified-badge">✓</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={onNext} className="proceed-btn">
          <span>🔥</span> LANCER LES LIVES
        </button>
      </div>
    );
  }

  if (!currentCoach) return null;

  return (
    <div className="battles">
      <div className="battle-header">
        <h1>LES BATTLES</h1>
        <div
          className="coach-indicator"
          style={{ "--coach-color": currentCoach.color }}
        >
          <div className="coach-avatar">
            {currentCoach.name.charAt(0).toUpperCase()}
          </div>
          <div className="coach-info">
            <span className="coach-name">
              ÉQUIPE {currentCoach.name.toUpperCase()}
            </span>
            <span className="coach-turn">
              Tour {currentCoachIndex + 1}/{coaches.length}
            </span>
          </div>
        </div>
      </div>

      <div className="battle-arena">
        <div className="team-section">
          <h3>TALENTS DISPONIBLES</h3>
          <div className="available-talents">
            {currentTeam.map((candidate) => (
              <div
                key={candidate.id}
                className={`talent-card ${
                  selectedCandidates.find((c) => c.id === candidate.id)
                    ? "selected"
                    : ""
                }`}
                onClick={() => toggleCandidateSelection(candidate)}
              >
                <div className="talent-avatar">
                  {candidate.name.charAt(0).toUpperCase()}
                </div>
                <div className="talent-info">
                  <h4>{candidate.name}</h4>
                  <div className="talent-status">DISPONIBLE</div>
                </div>
                {selectedCandidates.find((c) => c.id === candidate.id) && (
                  <div className="selection-badge">✓</div>
                )}
              </div>
            ))}
          </div>

          {currentTeam.length < 2 && (
            <div className="no-battle-available">
              <div className="info-icon">ℹ️</div>
              <p>Pas assez de talents disponibles pour une battle</p>
              <button onClick={nextCoach} className="skip-btn">
                PASSER AU COACH SUIVANT
              </button>
            </div>
          )}
        </div>

        {selectedCandidates.length > 0 && (
          <div className="selection-panel">
            <h4>SÉLECTION POUR LA BATTLE</h4>
            <div className="selected-talents">
              {selectedCandidates.map((candidate) => (
                <div key={candidate.id} className="selected-talent">
                  <div className="talent-avatar">
                    {candidate.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{candidate.name}</span>
                </div>
              ))}
            </div>
            <div className="selection-info">
              {selectedCandidates.length}/3 talents sélectionnés
            </div>
          </div>
        )}
      </div>

      {battleResult && (
        <div className="battle-modal">
          <div className="modal-backdrop"></div>
          <div className="battle-content">
            <h2>🥊 BATTLE EN COURS</h2>
            <div className="battle-ring">
              {battleResult.candidates.map((candidate) => (
                <div key={candidate.id} className="battle-contestant">
                  <div className="contestant-avatar">
                    {candidate.name.charAt(0).toUpperCase()}
                  </div>
                  <h4>{candidate.name}</h4>
                  {!battleResult.winner && (
                    <button
                      onClick={() => selectWinner(candidate)}
                      className="winner-btn"
                      style={{ backgroundColor: currentCoach.color }}
                    >
                      CHOISIR GAGNANT
                    </button>
                  )}
                  {battleResult.winner?.id === candidate.id && (
                    <div className="winner-crown">👑 GAGNANT</div>
                  )}
                </div>
              ))}
            </div>

            {battleResult.winner && (
              <div className="battle-result">
                <h3>🏆 {battleResult.winner.name} remporte la battle !</h3>
                <button onClick={nextCoach} className="continue-btn">
                  CONTINUER
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="battle-controls">
        {canCreateBattle && !battleResult && (
          <button onClick={startBattle} className="battle-btn">
            <span>⚔️</span>
            LANCER LA BATTLE ({selectedCandidates.length} talents)
          </button>
        )}

        {canProceedToNext && !battleResult && (
          <button onClick={nextCoach} className="skip-btn">
            PASSER AU COACH SUIVANT
          </button>
        )}
      </div>
    </div>
  );
}
