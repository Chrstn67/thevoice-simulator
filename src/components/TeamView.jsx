"use client";

import { useState } from "react";
import "../styles/team-view.css";

export default function TeamView({
  coaches,
  teams,
  setTeams,
  eliminatedCandidates,
  onNext,
}) {
  const [draggedCandidate, setDraggedCandidate] = useState(null);
  const [dragOverTeam, setDragOverTeam] = useState(null);

  const handleDragStart = (e, candidate, fromTeamId) => {
    setDraggedCandidate({ candidate, fromTeamId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, teamId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverTeam(teamId);
  };

  const handleDragLeave = () => {
    setDragOverTeam(null);
  };

  const handleDrop = (e, toTeamId) => {
    e.preventDefault();
    setDragOverTeam(null);

    if (!draggedCandidate || draggedCandidate.fromTeamId === toTeamId) {
      setDraggedCandidate(null);
      return;
    }

    const newTeams = { ...teams };

    // Retirer le candidat de l'ancienne équipe
    newTeams[draggedCandidate.fromTeamId] = newTeams[
      draggedCandidate.fromTeamId
    ].filter((c) => c.id !== draggedCandidate.candidate.id);

    // Ajouter le candidat à la nouvelle équipe
    if (!newTeams[toTeamId]) newTeams[toTeamId] = [];
    newTeams[toTeamId] = [...newTeams[toTeamId], draggedCandidate.candidate];

    setTeams(newTeams);
    setDraggedCandidate(null);
  };

  const totalQualified = Object.values(teams).reduce(
    (sum, team) => sum + (team?.length || 0),
    0
  );

  return (
    <div className="team-view">
      <div className="studio-header">
        <div className="header-lights">
          <div className="light-beam"></div>
          <div className="light-beam"></div>
          <div className="light-beam"></div>
        </div>
        <h1>COMPOSITION DES ÉQUIPES</h1>
        <p>Réorganisez les équipes par glisser-déposer si nécessaire</p>
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">{totalQualified}</span>
            <span className="stat-label">Qualifiés</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{eliminatedCandidates.length}</span>
            <span className="stat-label">Éliminés</span>
          </div>
        </div>
      </div>

      <div className="teams-arena">
        {coaches.map((coach) => (
          <div
            key={coach.id}
            className={`team-zone ${
              dragOverTeam === coach.id ? "drag-over" : ""
            }`}
            onDragOver={(e) => handleDragOver(e, coach.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, coach.id)}
            style={{ "--coach-color": coach.color }}
          >
            <div className="team-header">
              <div className="coach-throne">
                <div className="throne-back"></div>
                <div className="coach-avatar">
                  {coach.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="team-info">
                <h3>ÉQUIPE {coach.name.toUpperCase()}</h3>
                <div className="team-count">
                  <span className="count-number">
                    {teams[coach.id]?.length || 0}
                  </span>
                  <span className="count-label">talents</span>
                </div>
              </div>
            </div>

            <div className="team-roster">
              {teams[coach.id]?.map((candidate) => (
                <div
                  key={candidate.id}
                  className="talent-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, candidate, coach.id)}
                >
                  <div className="talent-avatar">
                    {candidate.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="talent-info">
                    <h4>{candidate.name}</h4>
                    <div className="talent-status">QUALIFIÉ</div>
                  </div>
                  <div className="drag-handle">⋮⋮</div>
                </div>
              )) || (
                <div className="empty-team">
                  <div className="empty-icon">👥</div>
                  <p>Aucun talent dans cette équipe</p>
                  <span className="drop-hint">Glissez un talent ici</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {eliminatedCandidates.length > 0 && (
        <div className="eliminated-section">
          <h2>PARCOURS DES ÉLIMINATIONS</h2>
          <div className="elimination-timeline">
            {eliminatedCandidates.map((candidate, index) => (
              <div
                key={`${candidate.id}-${index}`}
                className="elimination-card"
              >
                <div className="elimination-number">#{index + 1}</div>
                <div className="eliminated-avatar">
                  {candidate.name.charAt(0).toUpperCase()}
                </div>
                <div className="elimination-info">
                  <h4>{candidate.name}</h4>
                  <div className="elimination-details">
                    <span className="elimination-phase">
                      {candidate.eliminatedIn}
                    </span>
                    <span className="elimination-by">
                      par {candidate.eliminatedBy}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="proceed-section">
        <button onClick={onNext} className="next-phase-btn">
          <span className="btn-icon">⚔️</span>
          LANCER LES BATTLES
        </button>
      </div>
    </div>
  );
}
