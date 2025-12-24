// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FootballTeams from './components/home';
import TeamStatistics from './components/teamstats';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FootballTeams />} />
        <Route path="/team-stats/:teamId" element={<TeamStatistics />} />
      </Routes>
    </Router>
  );
}

export default App;