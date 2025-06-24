"use client";

import { useState } from "react";
import "../styles/lives.css";

export default function Lives({
  coaches,
  teams,
  setTeams,
  eliminatedCandidates,
  setEliminatedCandidates,
  onNext,
}) {
  const [currentRound, setCurrentRound] = useState(1);
  const [eliminationInProgress, setEliminationInProgress] = useState(false);
  const [selectedEliminations, setSelectedEliminations] = useState({});

  const maxRounds = Math.max(
    ...coaches.map((coach) => teams[coach.id]?.length || 0)
  );
  const isLastRound = currentRound >= maxRounds;

  const handleElimination = (coachId, candidateId) => {
    setSelectedEliminations({
      ...selectedEliminations,
      [coachId]: candidateId,
    });
  };

  const confirmEliminations = () => {
    const newTeams = { ...teams };
    const newEliminated = [...eliminatedCandidates];

    Object.entries(selectedEliminations).forEach(([coachId, candidateId]) => {
      const coach = coaches.find((c) => c.id === Number.parseInt(coachId));
      const candidate = newTeams[coachId].find((c) => c.id === candidateId);

      if (candidate) {
        newTeams[coachId] = newTeams[coachId].filter(
          (c) => c.id !== candidateId
        );
        newEliminated.push({
          ...candidate,
          eliminatedIn: `lives-round-${currentRound}`,
          eliminatedBy: coach.name,
        });
      }
    });

    setTeams(newTeams);
    setEliminatedCandidates(newEliminated);
    setSelectedEliminations({});
    setEliminationInProgress(false);

    if (isLastRound) {
      onNext();
    } else {
      setCurrentRound(currentRound + 1);
    }
  };

  const canEliminate = coaches.every((coach) => {
    const teamSize = teams[coach.id]?.length || 0;
    return teamSize <= 1 || selectedEliminations[coach.id];
  });

  return (
    <div className="lives">
      <div className="lives-header">
        <h2>Les Lives</h2>
        <div className="round-info">
          Round {currentRound} / {maxRounds}
          {isLastRound && <span className="final-round">ROUND FINAL</span>}
        </div>
      </div>

      <div className="teams-elimination">
        {coaches.map((coach) => {
          const team = teams[coach.id] || [];
          const needsElimination = team.length > 1;

          return (
            <div
              key={coach.id}
              className="team-elimination"
              style={{ borderColor: coach.color }}
            >
              <div
                className="team-header"
                style={{ backgroundColor: coach.color }}
              >
                <h3>Équipe {coach.name}</h3>
                <p>
                  {team.length} candidat{team.length > 1 ? "s" : ""}
                </p>
              </div>

              <div className="team-candidates">
                {team.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={`candidate-card ${
                      selectedEliminations[coach.id] === candidate.id
                        ? "selected-for-elimination"
                        : ""
                    }`}
                  >
                    <div className="candidate-avatar">
                      {candidate.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="candidate-info">
                      <h4>{candidate.name}</h4>
                      <p>🎵 {candidate.song}</p>
                      <span className="genre">{candidate.genre}</span>
                    </div>
                    {needsElimination && (
                      <button
                        onClick={() =>
                          handleElimination(coach.id, candidate.id)
                        }
                        className={`elimination-btn ${
                          selectedEliminations[coach.id] === candidate.id
                            ? "selected"
                            : ""
                        }`}
                      >
                        {selectedEliminations[coach.id] === candidate.id
                          ? "Sélectionné"
                          : "Éliminer"}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {!needsElimination && team.length === 1 && (
                <div className="qualified-notice">
                  <p>🏆 Qualifié pour la finale !</p>
                </div>
              )}

              {team.length === 0 && (
                <div className="no-candidates">
                  <p>Aucun candidat restant</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="elimination-controls">
        {!eliminationInProgress &&
          Object.keys(selectedEliminations).length === 0 && (
            <button
              onClick={() => setEliminationInProgress(true)}
              className="start-elimination-btn"
            >
              Commencer les Éliminations du Round {currentRound}
            </button>
          )}

        {(eliminationInProgress ||
          Object.keys(selectedEliminations).length > 0) && (
          <div className="elimination-actions">
            <p className="elimination-instruction">
              Sélectionnez un candidat à éliminer dans chaque équipe qui en a
              plus d'un
            </p>
            <button
              onClick={confirmEliminations}
              disabled={!canEliminate}
              className={`confirm-btn ${canEliminate ? "ready" : "disabled"}`}
            >
              {isLastRound ? "Aller à la Finale" : `Confirmer les Éliminations`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
