"use client";

import { useState, useEffect } from "react";
import "../styles/blind-auditions.css";

export default function BlindAuditions({
  coaches,
  candidates,
  teams,
  setTeams,
  onNext,
}) {
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const [interestedCoaches, setInterestedCoaches] = useState([]);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [auditionComplete, setAuditionComplete] = useState(false);

  const currentCandidate = candidates[currentCandidateIndex];

  useEffect(() => {
    const initialTeams = {};
    coaches.forEach((coach) => {
      initialTeams[coach.id] = [];
    });
    setTeams(initialTeams);
  }, [coaches, setTeams]);

  const handleCoachInterest = (coach) => {
    if (!interestedCoaches.find((c) => c.id === coach.id)) {
      setInterestedCoaches([...interestedCoaches, coach]);
    }
  };

  const removeCoachInterest = (coach) => {
    setInterestedCoaches(interestedCoaches.filter((c) => c.id !== coach.id));
  };

  const handleCandidateChoice = (chosenCoach) => {
    const newTeams = { ...teams };
    newTeams[chosenCoach.id] = [...newTeams[chosenCoach.id], currentCandidate];
    setTeams(newTeams);
    nextCandidate();
  };

  const rejectCandidate = () => {
    nextCandidate();
  };

  const nextCandidate = () => {
    setInterestedCoaches([]);
    setShowChoiceModal(false);

    if (currentCandidateIndex < candidates.length - 1) {
      setCurrentCandidateIndex(currentCandidateIndex + 1);
    } else {
      setAuditionComplete(true);
    }
  };

  const balanceTeams = () => {
    const newTeams = { ...teams };
    const allAssignedCandidates = Object.values(newTeams).flat();
    const unassignedCandidates = candidates.filter(
      (c) => !allAssignedCandidates.find((ac) => ac.id === c.id)
    );

    unassignedCandidates.forEach((candidate, index) => {
      const coachId = coaches[index % coaches.length].id;
      newTeams[coachId] = [...newTeams[coachId], candidate];
    });

    setTeams(newTeams);
    onNext();
  };

  if (auditionComplete) {
    return (
      <div className="audition-complete">
        <div className="completion-header">
          <h2>Auditions Terminées !</h2>
          <p>Voici la répartition des équipes</p>
        </div>

        <div className="teams-summary">
          {coaches.map((coach) => (
            <div
              key={coach.id}
              className="team-summary"
              style={{ "--coach-color": coach.color }}
            >
              <div className="team-header">
                <div className="coach-avatar">
                  {coach.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <h3>Équipe {coach.name}</h3>
              </div>
              <div className="team-count">
                {teams[coach.id]?.length || 0} candidats
              </div>
            </div>
          ))}
        </div>

        <button onClick={balanceTeams} className="continue-btn">
          Équilibrer et Continuer
        </button>
      </div>
    );
  }

  if (!currentCandidate) return null;

  return (
    <div className="blind-auditions">
      <div className="audition-header">
        <h2>Auditions à l'Aveugle</h2>
        <div className="progress-info">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${
                  ((currentCandidateIndex + 1) / candidates.length) * 100
                }%`,
              }}
            ></div>
          </div>
          <span>
            Candidat {currentCandidateIndex + 1} / {candidates.length}
          </span>
        </div>
      </div>

      <div className="audition-stage">
        <div className="candidate-section">
          <div className="candidate-spotlight">
            <div className="candidate-avatar">
              {currentCandidate.name.charAt(0).toUpperCase()}
            </div>
            <h3>{currentCandidate.name}</h3>
            <p className="song-title">🎵 {currentCandidate.song}</p>
          </div>
        </div>

        <div className="coaches-section">
          <h4>Coaches</h4>
          <div className="coaches-grid">
            {coaches.map((coach) => {
              const isInterested = interestedCoaches.find(
                (c) => c.id === coach.id
              );
              return (
                <div key={coach.id} className="coach-station">
                  <div
                    className={`coach-chair ${
                      isInterested ? "interested" : ""
                    }`}
                    style={{ "--coach-color": coach.color }}
                  >
                    <div className="coach-avatar">
                      {coach.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    {isInterested && (
                      <div className="interest-badge">Intéressé</div>
                    )}
                  </div>

                  <div className="coach-info">
                    <h5>{coach.name}</h5>
                    <div className="coach-actions">
                      {!isInterested ? (
                        <button
                          onClick={() => handleCoachInterest(coach)}
                          className="interest-btn"
                          style={{ backgroundColor: coach.color }}
                        >
                          Je te veux !
                        </button>
                      ) : (
                        <button
                          onClick={() => removeCoachInterest(coach)}
                          className="remove-interest-btn"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="audition-controls">
        {interestedCoaches.length === 0 && (
          <button onClick={rejectCandidate} className="reject-btn">
            Aucun Coach Intéressé - Suivant
          </button>
        )}

        {interestedCoaches.length === 1 && (
          <button
            onClick={() => handleCandidateChoice(interestedCoaches[0])}
            className="auto-assign-btn"
            style={{ backgroundColor: interestedCoaches[0].color }}
          >
            Rejoindre l'équipe {interestedCoaches[0].name}
          </button>
        )}

        {interestedCoaches.length > 1 && (
          <button
            onClick={() => setShowChoiceModal(true)}
            className="choice-btn"
          >
            {interestedCoaches.length} coaches intéressés - Choisir
          </button>
        )}
      </div>

      {showChoiceModal && (
        <div className="choice-modal">
          <div
            className="modal-overlay"
            onClick={() => setShowChoiceModal(false)}
          ></div>
          <div className="modal-content">
            <h3>Choisis ton coach, {currentCandidate.name} !</h3>
            <div className="coach-choices">
              {interestedCoaches.map((coach) => (
                <button
                  key={coach.id}
                  onClick={() => handleCandidateChoice(coach)}
                  className="coach-choice"
                  style={{ "--coach-color": coach.color }}
                >
                  <div className="coach-avatar">
                    {coach.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <span>{coach.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
