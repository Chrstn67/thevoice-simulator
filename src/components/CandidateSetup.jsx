"use client";

import { useState } from "react";
import "../styles/candidate-setup.css";

export default function CandidateSetup({ candidates, setCandidates, onNext }) {
  const [newCandidate, setNewCandidate] = useState({ name: "" });

  const addCandidate = () => {
    if (newCandidate.name.trim()) {
      setCandidates([
        ...candidates,
        { ...newCandidate, id: Date.now(), status: "waiting" },
      ]);
      setNewCandidate({ name: "" });
    }
  };

  const removeCandidate = (id) => {
    setCandidates(candidates.filter((candidate) => candidate.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addCandidate();
    }
  };

  return (
    <div className="candidate-setup">
      <div className="casting-backdrop">
        <div className="stage-lights">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`stage-light light-${i + 1}`}></div>
          ))}
        </div>
      </div>

      <div className="setup-container">
        <div className="setup-header">
          <h1>CASTING DES TALENTS</h1>
          <p>Découvrez les voix qui vont marquer cette saison</p>
          <div className="requirement-badge">Minimum 4 talents requis</div>
        </div>

        <div className="talent-registration">
          <div className="registration-panel">
            <h3>Nouveau Talent</h3>
            <div className="registration-form">
              <div className="input-group">
                <label>Nom du Talent</label>
                <input
                  type="text"
                  placeholder="Ex: Sarah Martin"
                  value={newCandidate.name}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, name: e.target.value })
                  }
                  onKeyPress={handleKeyPress}
                  className="talent-name-input"
                />
              </div>

              <button
                onClick={addCandidate}
                className="register-talent-btn"
                disabled={!newCandidate.name.trim()}
              >
                <span>🎤</span> Inscrire au Casting
              </button>
            </div>
          </div>
        </div>

        {candidates.length > 0 && (
          <div className="talents-gallery">
            <h3>Talents Inscrits ({candidates.length})</h3>
            <div className="talents-grid">
              {candidates.map((candidate, index) => (
                <div key={candidate.id} className="talent-card">
                  <div className="talent-number">#{index + 1}</div>
                  <div className="talent-spotlight"></div>
                  <div className="talent-avatar">
                    {candidate.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="talent-info">
                    <h4>{candidate.name}</h4>
                    <div className="talent-status">
                      <span className="status-light"></span>
                      EN ATTENTE
                    </div>
                  </div>
                  <button
                    onClick={() => removeCandidate(candidate.id)}
                    className="remove-talent-btn"
                    title="Retirer du casting"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {candidates.length >= 4 && (
          <div className="proceed-panel">
            <div className="casting-ready">
              <div className="ready-indicator">
                <div className="ready-light"></div>
                <span>CASTING COMPLET</span>
              </div>
              <div className="talent-count">
                {candidates.length} talents prêts pour l'audition
              </div>
            </div>
            <button onClick={onNext} className="start-auditions-btn">
              DÉMARRER LES AUDITIONS À L'AVEUGLE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
