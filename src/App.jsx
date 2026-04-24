import "./App.css";
import { Tasks } from "./components/Tasks";
import { useState, useEffect } from "react";

export const App = () => {
  // state to enable/disable dark mode for color theme
  const [theme, setTheme] = useState("light");

  /*state for filters*/
  const [filter, setFilter] = useState("current");




  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };



  return (
    <div className="app-wrapper">
      <div className="main-container">
        <section className="mobile-header">
          <img src="./images/diddo.png" alt="Diddo icon" />
          <h1>Diddo</h1>

          <button className="dark-mode-mobile" onClick={toggleTheme}>
            <i className="fa-regular fa-moon"></i>
            Dark Mode
            <i className="fa-solid fa-toggle-on fa-2xl"></i>
            <i className="fa-solid fa-toggle-on fa-flip-horizontal fa-2xl"></i>
          </button>
        </section>

        <section className="menu">
          <div className="title">
            <img src="./images/diddo.png" alt="Diddo icon" />
            <h1>Diddo</h1>
          </div>

          <div className="filter-container">
            <ul className="menu-filters">
              <li className="menu-item" onClick={() => setFilter("current")}>
                <i className="fa-solid fa-bars"></i>Current Tasks
              </li>
              <li className="menu-item" onClick={() => setFilter("all")}>
                <i className="fa-solid fa-check-double"></i>All Tasks
              </li>
              <li className="menu-item" onClick={() => setFilter("completed")}>
                <i className="fa-regular fa-circle-check"></i>Completed Tasks
              </li>
            </ul>
          </div>

          <button className="dark-mode" onClick={toggleTheme}>
            <div className="dark-mode-first-row">
              <i className="fa-regular fa-moon"></i>
              Dark Mode
            </div>
            <div className="toggle-container">
              <i className="fa-solid fa-toggle-on fa-2xl fa-flip-on"></i>
              <i className="fa-solid fa-toggle-on fa-flip-horizontal fa-2xl"></i>
            </div>
          </button>
        </section>

        <Tasks filter={filter} setFilter={setFilter} />
      </div >
    </div >
  );
};