"use client";

import { useState } from "react";
import "../styles/coach-setup.css";

export default function CoachSetup({ coaches, setCoaches, onNext }) {
  const [newCoach, setNewCoach] = useState({ name: "", color: "#FFD700" });

  const professionalColors = [
    "#FFD700", // Gold
    "#FF1493", // Deep Pink
    "#00BFFF", // Deep Sky Blue
    "#32CD32", // Lime Green
    "#FF6347", // Tomato
    "#9370DB", // Medium Purple
    "#FF8C00", // Dark Orange
    "#20B2AA", // Light Sea Green
  ];

  const addCoach = () => {
    if (newCoach.name.trim()) {
      setCoaches([...coaches, { ...newCoach, id: Date.now() }]);
      setNewCoach({
        name: "",
        color:
          professionalColors[(coaches.length + 1) % professionalColors.length],
      });
    }
  };

  const removeCoach = (id) => {
    setCoaches(coaches.filter((coach) => coach.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addCoach();
    }
  };

  return (
    <div className="coach-setup">
      <div className="studio-backdrop">
        <div className="stage-spotlights">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`spotlight spotlight-${i + 1}`}></div>
          ))}
        </div>
      </div>

      <div className="setup-container">
        <div className="setup-header">
          <h1>CONFIGURATION DES COACHES</h1>
          <p>
            Créez l'équipe de coaches qui va découvrir les talents de demain
          </p>
          <div className="requirement-badge">Minimum 2 coaches requis</div>
        </div>

        <div className="coach-creator">
          <div className="creator-panel">
            <h3>Nouveau Coach</h3>
            <div className="creator-form">
              <div className="input-section">
                <label>Nom du Coach</label>
                <input
                  type="text"
                  placeholder="Ex: John Doe"
                  value={newCoach.name}
                  onChange={(e) =>
                    setNewCoach({ ...newCoach, name: e.target.value })
                  }
                  onKeyPress={handleKeyPress}
                  className="coach-name-input"
                />
              </div>

              <div className="color-section">
                <label>Couleur d'Équipe</label>
                <div className="color-palette">
                  {professionalColors.map((color) => (
                    <button
                      key={color}
                      className={`color-swatch ${
                        newCoach.color === color ? "selected" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewCoach({ ...newCoach, color })}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={addCoach}
                className="add-coach-btn"
                disabled={!newCoach.name.trim()}
              >
                <span>+</span> Ajouter Coach
              </button>
            </div>
          </div>
        </div>

        {coaches.length > 0 && (
          <div className="coaches-lineup">
            <h3>Ligne-up des Coaches ({coaches.length})</h3>
            <div className="coaches-grid">
              {coaches.map((coach) => (
                <div
                  key={coach.id}
                  className="coach-card"
                  style={{ "--coach-color": coach.color }}
                >
                  <div className="coach-spotlight"></div>
                  <div className="coach-chair">
                    <div className="chair-back"></div>
                    <div className="coach-avatar">
                      {coach.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  </div>
                  <div className="coach-info">
                    <h4>{coach.name}</h4>
                    <div
                      className="coach-team-color"
                      style={{ backgroundColor: coach.color }}
                    ></div>
                  </div>
                  <button
                    onClick={() => removeCoach(coach.id)}
                    className="remove-coach-btn"
                    title="Retirer ce coach"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {coaches.length >= 2 && (
          <div className="proceed-panel">
            <div className="ready-indicator">
              <div className="ready-light"></div>
              <span>PLATEAU PRÊT</span>
            </div>
            <button onClick={onNext} className="proceed-btn">
              LANCER LE CASTING
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
