import React, { useEffect, useState } from "react";
import NavBar from "./navbar";
import { useNavigate } from "react-router-dom";
import { ImStatsBars } from "react-icons/im";

function FootballTeams() {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate(); // Inicializa el hook

  const fetchteams = async () => {
    console.log("Función fetchLeagues llamada");
    const API_KEY = process.env.REACT_APP_API_FOOTBALL_KEY;
    const API_URL = process.env.REACT_APP_API_FOOTBALL_URL;

    try {
      const response = await fetch(
        `${API_URL}/teams?league=239&season=2023`,
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
      const teamsData = data.response || [];
      console.log(teamsData);
      setTeams(teamsData);
    } catch (error) {
      console.error("Error en fetchLeagues:", error);
    }
  };

  useEffect(() => {
    fetchteams();
  }, []);

  // Función para manejar el clic del botón
  const handleViewStats = (teamId, teamName) => {
    console.log(`Ver estadísticas del equipo: ${teamName} (ID: ${teamId})`);
    navigate(`/team-stats/${teamId}`);
  };

  return (
    <div className="football-app">
      <NavBar />
      <div className="container mt-4">
        <h1 className="mb-4">Colombian League Teams</h1>
        <div className="row">
          {teams.map((item, index) => (
            <div className="col-md-4 mb-3" key={index}>
              <div className="card h-100">
                <div className="card-body">
                  {item.team.logo && (
                    <img
                      src={item.team.logo}
                      alt={item.team.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        marginRight: "10px",
                        float: "left",
                      }}
                    />
                  )}
                  <h5 className="card-title">{item.team.name}</h5>
                  <p className="card-text">
                    <strong>ID:</strong> {item.team.id}
                    <br />
                    <strong>Country:</strong> {item.team.country}
                    <br />
                    <strong>Foundation Year:</strong>{" "}
                    {item.team.founded || "Desconocido"}
                  </p>

                  <button
                    className="btn btn-info btn-sm mt-2"
                    onClick={() =>
                      handleViewStats(item.team.id, item.team.name)
                    }
                    style={{
                      width: "100%",
                    }}
                  >
                    <b> Stats view </b>
                    <ImStatsBars />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FootballTeams;
