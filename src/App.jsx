import "./App.css";
import { Tasks } from "./components/Tasks";

export const App = () => {
  return (
    <div className="app-wrapper">
      <div className="main-container">
        <section className="mobile-header">
          <img src="./images/diddo.png" alt="Diddo icon" />
          <h1>Diddo</h1>
        </section>

        <section className="menu">
          <div className="title">
            <img src="./images/diddo.png" alt="Diddo icon" />
            <h1>Diddo</h1>
          </div>

          <div className="filter-container">
            <ul className="menu-filters">
              <li className="menu-item"><i className="fa-solid fa-bars"></i>All Tasks</li>
              <li className="menu-item"><i className="fa-regular fa-circle-check"></i>Completed Tasks</li>
              <li className="menu-item"><i className="fa-regular fa-trash-can"></i>Trash</li>
            </ul>
          </div>

          <div className="dark-mode">

            <i className="fa-regular fa-moon"></i>

            Dark Mode


            <i className="fa-solid fa-toggle-on fa-2xl"></i>
            <i className="fa-solid fa-toggle-on fa-flip-horizontal fa-2xl"></i>
          </div>
        </section>

        <Tasks />
      </div >
    </div >
  );
};