"use client";

import { useState } from "react";
import CoachSetup from "../components/CoachSetup";
import CandidateSetup from "../components/CandidateSetup";
import BlindAuditions from "../components/BlindAuditions";
import TeamView from "../components/TeamView";
import Battles from "../components/Battles";
import Lives from "../components/Lives";
import Final from "../components/Final";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/app.css";

export default function TheVoiceApp() {
  const [currentPhase, setCurrentPhase] = useState("setup-coaches");
  const [coaches, setCoaches] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [teams, setTeams] = useState({});
  const [eliminatedCandidates, setEliminatedCandidates] = useState([]);

  const phases = {
    "setup-coaches": "Configuration des Coaches",
    "setup-candidates": "Configuration des Candidats",
    "blind-auditions": "Auditions à l'Aveugle",
    teams: "Vue des Équipes",
    battles: "Les Battles",
    lives: "Les Lives",
    final: "La Finale",
  };

  const nextPhase = () => {
    const phaseOrder = Object.keys(phases);
    const currentIndex = phaseOrder.indexOf(currentPhase);
    if (currentIndex < phaseOrder.length - 1) {
      setCurrentPhase(phaseOrder[currentIndex + 1]);
    }
  };

  const goToPhase = (phase) => {
    setCurrentPhase(phase);
  };

  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case "setup-coaches":
        return (
          <CoachSetup
            coaches={coaches}
            setCoaches={setCoaches}
            onNext={nextPhase}
          />
        );
      case "setup-candidates":
        return (
          <CandidateSetup
            candidates={candidates}
            setCandidates={setCandidates}
            onNext={nextPhase}
          />
        );
      case "blind-auditions":
        return (
          <BlindAuditions
            coaches={coaches}
            candidates={candidates}
            teams={teams}
            setTeams={setTeams}
            onNext={nextPhase}
          />
        );
      case "teams":
        return (
          <TeamView
            coaches={coaches}
            teams={teams}
            setTeams={setTeams}
            eliminatedCandidates={eliminatedCandidates}
            onNext={nextPhase}
          />
        );
      case "battles":
        return (
          <Battles
            coaches={coaches}
            teams={teams}
            setTeams={setTeams}
            eliminatedCandidates={eliminatedCandidates}
            setEliminatedCandidates={setEliminatedCandidates}
            onNext={nextPhase}
          />
        );
      case "lives":
        return (
          <Lives
            coaches={coaches}
            teams={teams}
            setTeams={setTeams}
            eliminatedCandidates={eliminatedCandidates}
            setEliminatedCandidates={setEliminatedCandidates}
            onNext={nextPhase}
          />
        );
      case "final":
        return <Final coaches={coaches} teams={teams} />;
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <Header
        currentPhase={currentPhase}
        phases={phases}
        onPhaseChange={goToPhase}
      />
      <main className="main-content">{renderCurrentPhase()}</main>
      <Footer />
    </div>
  );
}
