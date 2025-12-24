import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./navbar";

function TeamStatistics() {
  const { teamId } = useParams(); // Obtener el teamId de la URL
  const navigate = useNavigate();

  // Estados para los datos
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parámetros fijos para la liga colombiana 2023
  const leagueId = 239;
  const season = 2023;

  useEffect(() => {
    // Mover la función DENTRO del useEffect
    const fetchTeamStats = async () => {
      try {
        setLoading(true);
        const API_KEY = process.env.REACT_APP_API_FOOTBALL_KEY;
        const API_URL = process.env.REACT_APP_API_FOOTBALL_URL;
        
        console.log("Solicitando estadísticas para equipo:", teamId);
        console.log("API_URL:", API_URL);
        
        const response = await fetch(
          `${API_URL}/teams/statistics?league=${leagueId}&season=${season}&team=${teamId}`,
          {
            method: "GET",
            headers: {
              "x-apisports-key": API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Estadísticas obtenidas:", data);
        setStats(data.response || {});
        setError(null);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      fetchTeamStats();
    } else {
      console.error("teamId es undefined");
      setError("No se especificó un equipo en la URL");
      setLoading(false);
    }
  }, [teamId]); // Solo teamId como dependencia

  // Procesar la cadena de forma (W=Win, D=Draw, L=Loss)
  const processFormString = (formString) => {
    if (!formString) return [];

    return formString.split("").map((char, index) => {
      let className = "";
      let label = "";

      switch (char) {
        case "W":
          className = "win";
          label = "Win";
          break;
        case "D":
          className = "draw";
          label = "Draw";
          break;
        case "L":
          className = "loss";
          label = "Loss";
          break;
        default:
          className = "unknown";
          label = "Unknown";
      }

      return { char, className, label };
    });
  };

  // Calcular porcentaje
  const calculatePercentage = (part, total) => {
    if (!total || total === 0) return "0%";
    return `${Math.round((part / total) * 100)}%`;
  };

  if (loading) {
    return (
      <div className="football-app">
        <NavBar />
        <div className="container mt-4 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="football-app">
        <NavBar />
        <div className="container mt-4">
          <div className="alert alert-danger">
            <h4>Error Loading Statistics</h4>
            <p>{error || "No se pudieron cargar las estadísticas"}</p>
            <button className="btn btn-warning" onClick={() => navigate(-1)}>
              Volver atrás
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formResults = processFormString(stats.form);
  const fixtures = stats.fixtures || {};
  const goals = stats.goals || {};
  const cleanSheet = stats.clean_sheet || {};
  const penalty = stats.penalty || {};
  const lineups = stats.lineups || [];
  const cards = stats.cards || {};
  const biggest = stats.biggest || {};

  return (
    <div className="football-app">
      <NavBar />

      <div className="container">
        
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body text-center">
                <div className="row align-items-center">
                  <div className="col-md-3">
                    {stats.league?.logo && (
                      <img
                        src={stats.league.logo}
                        alt={stats.league.name}
                        className="league-logo mb-2"
                        style={{ maxHeight: "60px", maxWidth: "60px" }}
                      />
                    )}
                    <h5>{stats.league?.name || "Liga desconocida"}</h5>
                    <p className="text-muted">
                      {stats.league?.country || "País desconocido"}
                    </p>
                    <p>Season: {stats.league?.season || season}</p>
                  </div>
                  <div className="col-md-6">
                    <h1 className="display-4">
                      {stats.team?.name || "Equipo desconocido"}
                    </h1>
                    {stats.team?.logo && (
                      <img
                        src={stats.team.logo}
                        alt={stats.team.name}
                        className="team-logo mt-2"
                        style={{ maxHeight: "100px", maxWidth: "100px" }}
                      />
                    )}
                  </div>
                  <div className="col-md-3">
                    <h5>Recent Form</h5>
                    <div className="mt-2">
                      {formResults.slice(0, 10).map((result, index) => (
                        <span
                          key={index}
                          className={`form-badge ${result.className}`}
                          title={result.label}
                          style={{
                            display: "inline-block",
                            width: "30px",
                            height: "30px",
                            lineHeight: "30px",
                            textAlign: "center",
                            borderRadius: "4px",
                            fontWeight: "bold",
                            margin: "2px",
                            color:
                              result.className === "draw" ? "#000" : "white",
                            backgroundColor:
                              result.className === "win"
                                ? "#28a745"
                                : result.className === "draw"
                                ? "#ffc107"
                                : result.className === "loss"
                                ? "#dc3545"
                                : "#6c757d",
                          }}
                        >
                          {result.char}
                        </span>
                      ))}
                    </div>
                    <small className="text-muted">Last 10 matches</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="row mb-4">
          
          <div className="col-md-3 mb-3">
            <div
              className="card stat-card border-primary"
              style={{ transition: "transform 0.2s", height: "100%" }}
            >
              <div className="card-body text-center">
                <h5 className="card-title">Fixtures</h5>
                <h2 className="text-primary">{fixtures.played?.total || 0}</h2>
                <div className="row">
                  <div className="col-6">
                    <small>Wins</small>
                    <h4 className="text-success">
                      {fixtures.wins?.total || 0}
                    </h4>
                  </div>
                  <div className="col-6">
                    <small>Losses</small>
                    <h4 className="text-danger">
                      {fixtures.loses?.total || 0}
                    </h4>
                  </div>
                  <div className="col-6">
                    <small>Draws</small>
                    <h4>{fixtures.draws?.total || 0}</h4>
                  </div>
                  <div className="col-6">
                    <small>Win %</small>
                    <h4>
                      {calculatePercentage(
                        fixtures.wins?.total || 0,
                        fixtures.played?.total || 0
                      )}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Goals Card */}
          <div className="col-md-3 mb-3">
            <div
              className="card stat-card border-success"
              style={{ transition: "transform 0.2s", height: "100%" }}
            >
              <div className="card-body text-center">
                <h5 className="card-title">Goals</h5>
                <h2 className="text-success">{goals.for?.total?.total || 0}</h2>
                <div className="row">
                  <div className="col-6">
                    <small>For</small>
                    <h4>{goals.for?.average?.total || 0}</h4>
                    <small>avg/match</small>
                  </div>
                  <div className="col-6">
                    <small>Against</small>
                    <h4 className="text-danger">
                      {goals.against?.total?.total || 0}
                    </h4>
                    <small>avg: {goals.against?.average?.total || 0}</small>
                  </div>
                </div>
                <div className="mt-2">
                  <small>
                    GD:{" "}
                    {(goals.for?.total?.total || 0) -
                      (goals.against?.total?.total || 0)}
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Sheets */}
          <div className="col-md-3 mb-3">
            <div
              className="card stat-card border-warning"
              style={{ transition: "transform 0.2s", height: "100%" }}
            >
              <div className="card-body text-center">
                <h5 className="card-title">Defense</h5>
                <h2 className="text-warning">{cleanSheet.total || 0}</h2>
                <p>Clean Sheets</p>
                <div className="row">
                  <div className="col-6">
                    <small>Home</small>
                    <h5>{cleanSheet.home || 0}</h5>
                  </div>
                  <div className="col-6">
                    <small>Away</small>
                    <h5>{cleanSheet.away || 0}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Penalties Card */}
          <div className="col-md-3 mb-3">
            <div
              className="card stat-card border-info"
              style={{ transition: "transform 0.2s", height: "100%" }}
            >
              <div className="card-body text-center">
                <h5 className="card-title">Penalties</h5>
                <h2 className="text-info">
                  {penalty.scored?.total || 0}/{penalty.total || 0}
                </h2>
                <p>Scored/Missed</p>
                <div
                  className="progress"
                  style={{ height: "20px", marginBottom: "10px" }}
                >
                  <div
                    className="progress-bar bg-success"
                    style={{ width: penalty.scored?.percentage || "0%" }}
                  >
                    {penalty.scored?.percentage || "0%"}
                  </div>
                </div>
                <small>Success Rate</small>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tables */}
        <div className="row">
          {/* Goals Distribution */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>Goals by Minute</h5>
              </div>
              <div className="card-body">
                <div
                  className="minute-distribution"
                  style={{
                    borderLeft: "4px solid #007bff",
                    paddingLeft: "15px",
                    marginBottom: "20px",
                  }}
                >
                  <h6>Goals For</h6>
                  {goals.for?.minute &&
                    Object.entries(goals.for.minute).map(([minute, data]) => {
                      if (data.total > 0) {
                        return (
                          <div key={`for-${minute}`} className="mb-2">
                            <small>
                              {minute}: {data.total} goals ({data.percentage})
                            </small>
                            <div
                              className="progress"
                              style={{ height: "20px", marginBottom: "10px" }}
                            >
                              <div
                                className="progress-bar bg-success"
                                style={{ width: data.percentage }}
                              >
                                {data.percentage}
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                </div>
                <div
                  className="minute-distribution"
                  style={{
                    borderLeft: "4px solid #007bff",
                    paddingLeft: "15px",
                  }}
                >
                  <h6>Goals Against</h6>
                  {goals.against?.minute &&
                    Object.entries(goals.against.minute).map(
                      ([minute, data]) => {
                        if (data.total > 0) {
                          return (
                            <div key={`against-${minute}`} className="mb-2">
                              <small>
                                {minute}: {data.total} goals ({data.percentage})
                              </small>
                              <div
                                className="progress"
                                style={{ height: "20px", marginBottom: "10px" }}
                              >
                                <div
                                  className="progress-bar bg-danger"
                                  style={{ width: data.percentage }}
                                >
                                  {data.percentage}
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Lineups */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>Most Used Formations</h5>
              </div>
              <div className="card-body">
                <table className="table table-striped stats-table">
                  <thead>
                    <tr>
                      <th>Formation</th>
                      <th>Matches</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineups.map((lineup, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{lineup.formation}</strong>
                        </td>
                        <td>{lineup.played}</td>
                        <td>
                          <div className="progress" style={{ height: "20px" }}>
                            <div
                              className="progress-bar bg-info"
                              style={{
                                width: calculatePercentage(
                                  lineup.played,
                                  fixtures.played?.total || 0
                                ),
                              }}
                            >
                              {calculatePercentage(
                                lineup.played,
                                fixtures.played?.total || 0
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Statistics */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h5>Disciplinary Record</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Yellow Cards</h6>
                    {cards.yellow &&
                      Object.entries(cards.yellow).map(([minute, data]) => {
                        if (data.total > 0) {
                          return (
                            <div key={`yellow-${minute}`} className="mb-2">
                              <small>
                                {minute}: {data.total} cards ({data.percentage})
                              </small>
                              <div
                                className="progress"
                                style={{ height: "20px", marginBottom: "10px" }}
                              >
                                <div
                                  className="progress-bar bg-warning"
                                  style={{ width: data.percentage }}
                                >
                                  {data.percentage}
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                  </div>
                  <div className="col-md-6">
                    <h6>Red Cards</h6>
                    {cards.red &&
                      Object.entries(cards.red).map(([minute, data]) => {
                        if (data.total > 0) {
                          return (
                            <div key={`red-${minute}`} className="mb-2">
                              <small>
                                {minute}: {data.total} cards ({data.percentage})
                              </small>
                              <div
                                className="progress"
                                style={{ height: "20px", marginBottom: "10px" }}
                              >
                                <div
                                  className="progress-bar bg-danger"
                                  style={{ width: data.percentage }}
                                >
                                  {data.percentage}
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Biggest Results */}
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h5>Biggest Results</h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-3">
                    <h6>Biggest Win</h6>
                    <h4 className="text-success">
                      {biggest.wins?.home || "N/A"}
                    </h4>
                    <small>Home</small>
                  </div>
                  <div className="col-md-3">
                    <h6>Biggest Win</h6>
                    <h4 className="text-success">
                      {biggest.wins?.away || "N/A"}
                    </h4>
                    <small>Away</small>
                  </div>
                  <div className="col-md-3">
                    <h6>Biggest Loss</h6>
                    <h4 className="text-danger">
                      {biggest.loses?.home || "N/A"}
                    </h4>
                    <small>Home</small>
                  </div>
                  <div className="col-md-3">
                    <h6>Biggest Loss</h6>
                    <h4 className="text-danger">
                      {biggest.loses?.away || "N/A"}
                    </h4>
                    <small>Away</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-5 py-3 bg-light">
        <div className="container text-center">
          <p className="mb-0">
            Data provided by{" "}
            <a
              href="https://www.api-football.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              API-Football
            </a>
          </p>
          <p className="mb-0">
            Developed by{" "}
            <a
              href="https://github.com/Reyes-code"
              target="_blank"
              rel="noopener noreferrer"
            >
              Santiago Reyes - Reyes Code
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default TeamStatistics;
