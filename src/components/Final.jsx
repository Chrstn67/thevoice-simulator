"use client";

import { useState } from "react";
import "../styles/final.css";

export default function Final({ coaches, teams }) {
  const [votes, setVotes] = useState({});
  const [votingPhase, setVotingPhase] = useState("setup");
  const [publicSize, setPublicSize] = useState("");
  const [winner, setWinner] = useState(null);
  const [tiedFinalists, setTiedFinalists] = useState([]);
  const [runoffVotes, setRunoffVotes] = useState({});

  const finalists = coaches
    .map((coach) => ({
      coach,
      finalist: teams[coach.id]?.[0] || null,
    }))
    .filter((item) => item.finalist);

  const totalVotes = Object.values(votes).reduce(
    (sum, vote) => sum + (Number.parseInt(vote) || 0),
    0
  );
  const remainingVotes = Number.parseInt(publicSize) - totalVotes;

  const totalRunoffVotes = Object.values(runoffVotes).reduce(
    (sum, vote) => sum + (Number.parseInt(vote) || 0),
    0
  );
  const remainingRunoffVotes = Number.parseInt(publicSize) - totalRunoffVotes;

  const handlePublicSizeSubmit = () => {
    if (Number.parseInt(publicSize) > 0) {
      const initialVotes = {};
      finalists.forEach((item) => {
        initialVotes[item.finalist.id] = 0;
      });
      setVotes(initialVotes);
      setVotingPhase("voting");
    }
  };

  // Version corrigée avec validation moins restrictive
  const handleVoteChange = (finalistId, voteCount) => {
    const newVotes = { ...votes };

    // Permettre les valeurs vides pour la saisie en cours
    if (voteCount === "") {
      newVotes[finalistId] = "";
      setVotes(newVotes);
      return;
    }

    const newVote = Number.parseInt(voteCount) || 0;

    // Empêcher les valeurs négatives
    if (newVote < 0) return;

    const otherVotes = Object.entries(newVotes)
      .filter(([id]) => id !== finalistId)
      .reduce((sum, [, vote]) => sum + (Number.parseInt(vote) || 0), 0);

    // Option 1: Validation permissive - permet de dépasser temporairement
    // La validation finale se fait au moment du calcul des résultats
    newVotes[finalistId] = newVote;
    setVotes(newVotes);

    // Option 2: Si vous préférez l'auto-ajustement, décommentez ces lignes et commentez les lignes au-dessus
    /*
    if (otherVotes + newVote <= Number.parseInt(publicSize)) {
      // Saisie normale
      newVotes[finalistId] = newVote;
    } else {
      // Auto-ajustement au maximum possible
      const maxPossible = Math.max(0, Number.parseInt(publicSize) - otherVotes);
      newVotes[finalistId] = maxPossible;
    }
    setVotes(newVotes);
    */
  };

  // Version corrigée pour le second tour
  const handleRunoffVoteChange = (finalistId, voteCount) => {
    const newVotes = { ...runoffVotes };

    // Permettre les valeurs vides pour la saisie en cours
    if (voteCount === "") {
      newVotes[finalistId] = "";
      setRunoffVotes(newVotes);
      return;
    }

    const newVote = Number.parseInt(voteCount) || 0;

    // Empêcher les valeurs négatives
    if (newVote < 0) return;

    const otherVotes = Object.entries(newVotes)
      .filter(([id]) => id !== finalistId)
      .reduce((sum, [, vote]) => sum + (Number.parseInt(vote) || 0), 0);

    // Validation permissive - permet de dépasser temporairement
    newVotes[finalistId] = newVote;
    setRunoffVotes(newVotes);

    // Option alternative avec auto-ajustement (décommentez si préféré)
    /*
    if (otherVotes + newVote <= Number.parseInt(publicSize)) {
      newVotes[finalistId] = newVote;
    } else {
      const maxPossible = Math.max(0, Number.parseInt(publicSize) - otherVotes);
      newVotes[finalistId] = maxPossible;
    }
    setRunoffVotes(newVotes);
    */
  };

  const findTiedFinalists = () => {
    const maxVotes = Math.max(
      ...Object.values(votes).map((v) => Number.parseInt(v) || 0)
    );

    const tied = finalists.filter(
      (item) => (Number.parseInt(votes[item.finalist.id]) || 0) === maxVotes
    );

    return tied.length > 1 ? tied : [];
  };

  const calculateResults = () => {
    if (totalVotes !== Number.parseInt(publicSize)) {
      alert(
        `Attention: ${Math.abs(remainingVotes)} votes ${
          remainingVotes > 0 ? "manquants" : "en trop"
        } !`
      );
      return;
    }

    const tied = findTiedFinalists();

    if (tied.length > 1) {
      setTiedFinalists(tied);
      setVotingPhase("runoff-setup");
    } else {
      const winnerCandidate = finalists.reduce((prev, current) => {
        const prevVotes = Number.parseInt(votes[prev.finalist.id]) || 0;
        const currentVotes = Number.parseInt(votes[current.finalist.id]) || 0;
        return prevVotes > currentVotes ? prev : current;
      });

      setWinner(winnerCandidate);
      setVotingPhase("results");
    }
  };

  const startRunoff = () => {
    const initialRunoffVotes = {};
    tiedFinalists.forEach((item) => {
      initialRunoffVotes[item.finalist.id] = 0;
    });
    setRunoffVotes(initialRunoffVotes);
    setVotingPhase("runoff-voting");
  };

  const calculateRunoffResults = () => {
    if (totalRunoffVotes !== Number.parseInt(publicSize)) {
      alert(
        `Attention: ${Math.abs(remainingRunoffVotes)} votes ${
          remainingRunoffVotes > 0 ? "manquants" : "en trop"
        } pour le second tour !`
      );
      return;
    }

    const winnerCandidate = tiedFinalists.reduce((prev, current) => {
      const prevVotes = Number.parseInt(runoffVotes[prev.finalist.id]) || 0;
      const currentVotes =
        Number.parseInt(runoffVotes[current.finalist.id]) || 0;
      return prevVotes > currentVotes ? prev : current;
    });

    setWinner(winnerCandidate);
    setVotingPhase("runoff-results");
  };

  const getVotePercentage = (finalistId, isRunoff = false) => {
    if (Number.parseInt(publicSize) === 0) return 0;
    const voteCount = isRunoff ? runoffVotes[finalistId] : votes[finalistId];
    return Math.round(
      (Number.parseInt(voteCount) / Number.parseInt(publicSize)) * 100
    );
  };

  return (
    <div className="final">
      <div className="final-stage">
        <div className="stage-lights">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`spotlight spotlight-${i + 1}`}></div>
          ))}
        </div>
      </div>

      <div className="final-header">
        <h1>🏆 LA GRANDE FINALE 🏆</h1>
        <p>Le moment de vérité : qui sera le gagnant de The Voice ?</p>
        {votingPhase.includes("runoff") && (
          <div className="runoff-indicator">
            <span className="runoff-badge">SECOND TOUR DÉCISIF</span>
          </div>
        )}
      </div>

      {votingPhase === "setup" && (
        <div className="voting-setup">
          <div className="setup-panel">
            <h2>Configuration du Vote Public</h2>
            <p>Combien de personnes sont présentes dans le public ?</p>
            <div className="public-size-input">
              <input
                type="number"
                min="1"
                max="10000"
                placeholder="Ex: 500"
                value={publicSize}
                onChange={(e) => setPublicSize(e.target.value)}
                className="size-input"
              />
              <span className="input-label">personnes dans le public</span>
            </div>
            <button
              onClick={handlePublicSizeSubmit}
              disabled={!publicSize || Number.parseInt(publicSize) <= 0}
              className="start-voting-btn"
            >
              COMMENCER LE VOTE
            </button>
          </div>
        </div>
      )}

      {votingPhase === "voting" && (
        <div className="voting-interface">
          <div className="voting-header">
            <h2>📊 SAISIE DES VOTES DU PUBLIC - PREMIER TOUR</h2>
            <div className="vote-progress">
              <span className="votes-counted">{totalVotes}</span>
              <span className="votes-separator">/</span>
              <span className="total-votes">{publicSize}</span>
              <span className="votes-label">votes comptabilisés</span>
            </div>
            {remainingVotes !== 0 && (
              <div
                className={`remaining-votes ${
                  remainingVotes < 0 ? "over-limit" : ""
                }`}
              >
                <span className="remaining-count">
                  {Math.abs(remainingVotes)}
                </span>
                {remainingVotes > 0 ? " votes restants" : " votes en trop"}
              </div>
            )}
          </div>

          <div className="vote-input-grid">
            {finalists.map(({ coach, finalist }) => (
              <div
                key={coach.id}
                className="vote-input-card"
                style={{ "--coach-color": coach.color }}
              >
                <div className="finalist-info">
                  <div className="finalist-avatar">
                    {finalist.name.charAt(0).toUpperCase()}
                  </div>
                  <h3>{finalist.name}</h3>
                  <p>Équipe {coach.name}</p>
                </div>

                <div className="vote-input-section">
                  <label>Nombre de votes</label>
                  <input
                    type="number"
                    min="0"
                    value={votes[finalist.id] || ""}
                    onChange={(e) =>
                      handleVoteChange(finalist.id, e.target.value)
                    }
                    className="vote-input"
                    placeholder="0"
                  />
                  <div className="vote-percentage">
                    {getVotePercentage(finalist.id)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="voting-controls">
            <button
              onClick={calculateResults}
              className={`calculate-btn ${
                totalVotes === Number.parseInt(publicSize)
                  ? "ready"
                  : "incomplete"
              }`}
            >
              {totalVotes === Number.parseInt(publicSize)
                ? "RÉVÉLER LES RÉSULTATS"
                : remainingVotes > 0
                ? `${remainingVotes} VOTES MANQUANTS`
                : `${Math.abs(remainingVotes)} VOTES EN TROP`}
            </button>
          </div>
        </div>
      )}

      {votingPhase === "runoff-setup" && (
        <div className="runoff-setup">
          <div className="runoff-panel">
            <h2>🔥 ÉGALITÉ DÉTECTÉE !</h2>
            <p>
              Les finalistes suivants sont à égalité et doivent s'affronter au
              second tour :
            </p>

            <div className="tied-finalists">
              {tiedFinalists.map(({ coach, finalist }) => (
                <div
                  key={coach.id}
                  className="tied-finalist"
                  style={{ "--coach-color": coach.color }}
                >
                  <div className="finalist-avatar">
                    {finalist.name.charAt(0).toUpperCase()}
                  </div>
                  <h3>{finalist.name}</h3>
                  <div className="tie-votes">
                    {votes[finalist.id]} votes ({getVotePercentage(finalist.id)}
                    %)
                  </div>
                </div>
              ))}
            </div>

            <div className="runoff-explanation">
              <p>
                Le public va maintenant voter uniquement entre ces{" "}
                {tiedFinalists.length} finalistes.
              </p>
              <p>Celui qui obtiendra le plus de votes remportera The Voice !</p>
            </div>

            <button onClick={startRunoff} className="start-runoff-btn">
              LANCER LE SECOND TOUR
            </button>
          </div>
        </div>
      )}

      {votingPhase === "runoff-voting" && (
        <div className="voting-interface runoff-voting">
          <div className="voting-header">
            <h2>🔥 SECOND TOUR DÉCISIF</h2>
            <div className="vote-progress">
              <span className="votes-counted">{totalRunoffVotes}</span>
              <span className="votes-separator">/</span>
              <span className="total-votes">{publicSize}</span>
              <span className="votes-label">votes comptabilisés</span>
            </div>
            {remainingRunoffVotes !== 0 && (
              <div
                className={`remaining-votes ${
                  remainingRunoffVotes < 0 ? "over-limit" : ""
                }`}
              >
                <span className="remaining-count">
                  {Math.abs(remainingRunoffVotes)}
                </span>{" "}
                {remainingRunoffVotes > 0 ? "votes restants" : "votes en trop"}
              </div>
            )}
          </div>

          <div className="vote-input-grid">
            {tiedFinalists.map(({ coach, finalist }) => (
              <div
                key={coach.id}
                className="vote-input-card runoff-card"
                style={{ "--coach-color": coach.color }}
              >
                <div className="finalist-info">
                  <div className="finalist-avatar">
                    {finalist.name.charAt(0).toUpperCase()}
                  </div>
                  <h3>{finalist.name}</h3>
                  <p>Équipe {coach.name}</p>
                  <div className="first-round-result">
                    1er tour: {votes[finalist.id]} votes (
                    {getVotePercentage(finalist.id)}%)
                  </div>
                </div>

                <div className="vote-input-section">
                  <label>Votes 2ème tour</label>
                  <input
                    type="number"
                    min="0"
                    value={runoffVotes[finalist.id] || ""}
                    onChange={(e) =>
                      handleRunoffVoteChange(finalist.id, e.target.value)
                    }
                    className="vote-input"
                    placeholder="0"
                  />
                  <div className="vote-percentage">
                    {getVotePercentage(finalist.id, true)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="voting-controls">
            <button
              onClick={calculateRunoffResults}
              className={`calculate-btn ${
                totalRunoffVotes === Number.parseInt(publicSize)
                  ? "ready"
                  : "incomplete"
              }`}
            >
              {totalRunoffVotes === Number.parseInt(publicSize)
                ? "RÉVÉLER LE GAGNANT"
                : remainingRunoffVotes > 0
                ? `${remainingRunoffVotes} VOTES MANQUANTS`
                : `${Math.abs(remainingRunoffVotes)} VOTES EN TROP`}
            </button>
          </div>
        </div>
      )}

      {(votingPhase === "results" || votingPhase === "runoff-results") && (
        <>
          <div className="finalists-arena">
            {(votingPhase === "runoff-results" ? tiedFinalists : finalists).map(
              ({ coach, finalist }) => (
                <div
                  key={coach.id}
                  className={`finalist-podium ${
                    winner && winner.coach.id === coach.id ? "winner" : ""
                  }`}
                  style={{ "--coach-color": coach.color }}
                >
                  <div className="podium-lights">
                    <div className="light-ring"></div>
                  </div>

                  <div className="coach-section">
                    <div className="coach-throne">
                      <div className="coach-avatar">
                        {coach.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <h3>COACH {coach.name.toUpperCase()}</h3>
                  </div>

                  <div className="finalist-showcase">
                    <div className="finalist-avatar">
                      {finalist.name.charAt(0).toUpperCase()}
                    </div>
                    <h2>{finalist.name}</h2>

                    <div className="vote-results">
                      {votingPhase === "runoff-results" && (
                        <div className="round-results">
                          <div className="round-result">
                            <span className="round-label">1er tour:</span>
                            <span className="round-votes">
                              {votes[finalist.id]} votes (
                              {getVotePercentage(finalist.id)}
                              %)
                            </span>
                          </div>
                          <div className="round-result final-round">
                            <span className="round-label">2ème tour:</span>
                            <span className="round-votes">
                              {runoffVotes[finalist.id]} votes (
                              {getVotePercentage(finalist.id, true)}%)
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="vote-count">
                        <span className="vote-number">
                          {votingPhase === "runoff-results"
                            ? runoffVotes[finalist.id]
                            : votes[finalist.id]}
                        </span>
                        <span className="vote-text">
                          votes{" "}
                          {votingPhase === "runoff-results"
                            ? "(2ème tour)"
                            : ""}
                        </span>
                      </div>
                      <div
                        className="vote-percentage"
                        style={{ "--vote-color": coach.color }}
                      >
                        {getVotePercentage(
                          finalist.id,
                          votingPhase === "runoff-results"
                        )}
                        %
                      </div>
                      <div className="vote-bar">
                        <div
                          className="vote-fill"
                          style={{
                            width: `${getVotePercentage(
                              finalist.id,
                              votingPhase === "runoff-results"
                            )}%`,
                            backgroundColor: coach.color,
                          }}
                        ></div>
                      </div>
                      <div className="vote-label">VOTES DU PUBLIC</div>
                    </div>

                    {winner && winner.coach.id === coach.id && (
                      <div className="winner-celebration">
                        <div className="crown-animation">👑</div>
                        <div className="winner-title">
                          GAGNANT THE VOICE
                          {votingPhase === "runoff-results" && (
                            <div className="runoff-winner">
                              VICTOIRE AU 2ÈME TOUR
                            </div>
                          )}
                        </div>
                        <div className="confetti">🎉</div>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          <div className="final-stats">
            <h3>RÉSULTATS DÉTAILLÉS</h3>
            <div className="detailed-results">
              <div className="public-info">
                <div className="stat-item">
                  <span className="stat-number">{publicSize}</span>
                  <span className="stat-label">Personnes dans le public</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {votingPhase === "runoff-results"
                      ? totalRunoffVotes
                      : totalVotes}
                  </span>
                  <span className="stat-label">
                    Votes exprimés{" "}
                    {votingPhase === "runoff-results" ? "(2ème tour)" : ""}
                  </span>
                </div>
                {votingPhase === "runoff-results" && (
                  <div className="stat-item">
                    <span className="stat-number">{tiedFinalists.length}</span>
                    <span className="stat-label">Finalistes au 2ème tour</span>
                  </div>
                )}
              </div>

              <div className="results-breakdown">
                {(votingPhase === "runoff-results"
                  ? tiedFinalists.sort(
                      (a, b) =>
                        (Number.parseInt(runoffVotes[b.finalist.id]) || 0) -
                        (Number.parseInt(runoffVotes[a.finalist.id]) || 0)
                    )
                  : finalists.sort(
                      (a, b) =>
                        (Number.parseInt(votes[b.finalist.id]) || 0) -
                        (Number.parseInt(votes[a.finalist.id]) || 0)
                    )
                ).map(({ coach, finalist }, index) => (
                  <div
                    key={coach.id}
                    className="result-row"
                    style={{ "--coach-color": coach.color }}
                  >
                    <div className="position">#{index + 1}</div>
                    <div className="finalist-name">{finalist.name}</div>
                    <div className="vote-details">
                      {votingPhase === "runoff-results" ? (
                        <>
                          <span className="votes">
                            {runoffVotes[finalist.id]} votes (2ème tour)
                          </span>
                          <span className="percentage">
                            ({getVotePercentage(finalist.id, true)}%)
                          </span>
                          <span className="first-round">
                            1er tour: {votes[finalist.id]} votes
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="votes">
                            {votes[finalist.id]} votes
                          </span>
                          <span className="percentage">
                            ({getVotePercentage(finalist.id)}%)
                          </span>
                        </>
                      )}
                    </div>
                    {index === 0 && <div className="winner-badge">🏆</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {finalists.length === 0 && (
        <div className="no-finalists">
          <div className="empty-icon">🎭</div>
          <h3>Aucun finaliste</h3>
          <p>La simulation n'est pas complète</p>
        </div>
      )}
    </div>
  );
}
