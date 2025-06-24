"use client";

import "../styles/header.css";

export default function Header({ currentPhase, phases, onPhaseChange }) {
  const phaseSteps = [
    { key: "setup-coaches", icon: "👨‍🎤", label: "Coaches" },
    { key: "setup-candidates", icon: "🎤", label: "Talents" },
    { key: "blind-auditions", icon: "🎭", label: "Auditions" },
    { key: "teams", icon: "👥", label: "Équipes" },
    { key: "battles", icon: "⚔️", label: "Battles" },
    { key: "lives", icon: "🔥", label: "Lives" },
    { key: "final", icon: "👑", label: "Finale" },
  ];

  const currentIndex = phaseSteps.findIndex(
    (step) => step.key === currentPhase
  );

  return (
    <header className="header">
      <div className="studio-lights">
        <div className="light-strip"></div>
      </div>

      <div className="header-content">
        <div className="show-logo">
          <div className="logo-icon">🎤</div>
          <div className="logo-text">
            <span className="logo-main">THE VOICE</span>
            <span className="logo-sub">SIMULATION STUDIO</span>
          </div>
        </div>

        <nav className="phase-timeline">
          {phaseSteps.map((step, index) => (
            <button
              key={step.key}
              className={`timeline-step ${
                currentPhase === step.key ? "active" : ""
              } ${index < currentIndex ? "completed" : ""}`}
              onClick={() => onPhaseChange(step.key)}
              disabled={index > currentIndex + 1}
            >
              <div className="step-icon">{step.icon}</div>
              <span className="step-label">{step.label}</span>
              {index < phaseSteps.length - 1 && (
                <div className="step-connector"></div>
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
