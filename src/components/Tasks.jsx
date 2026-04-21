import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";


export const Tasks = () => {
  const [taskList, setTaskList] = useState([]);
  // define the setting state functions
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [showForm, setShowForm] = useState(false);


  // fetch API, json = "tasks", setTaskList to be the json content (setTaskList)
  const fetchTasks = () => {
    setLoading(true);
    fetch("https://task-api-m07f.onrender.com/tasks")
      .then((res) => res.json())
      .then((tasks) => {
        console.log(tasks);
        setTaskList(tasks);
      })
      .catch((err) => {
        console.error("Failed to fetch tasks:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  // Text input sets the new todo state.
  const handleNewTodoChange = (event) => {
    setNewTodo(event.target.value);
  };


  // create a task directly from a suggestion
  const handleSuggestionCreate = (description) => {
    setLoading(true);

    fetch("https://task-api-m07f.onrender.com/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
        isChecked: false,
        date: Date.now(),
      }),
    })
      .then((res) => res.json())
      .then((createdTask) => {
        setTaskList((prev) => [...prev, createdTask]);
        setNewTodo("");
        setShowForm(false);
      })
      .catch((err) => {
        console.error("Failed to add task from suggestion:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  // remove default submit, and json content rests in createTask. In setTaskList add the newly created task to old list.
  const onFormSubmit = (event) => {
    event.preventDefault();
    if (!newTodo.trim()) return;
    setLoading(true);

    fetch("https://task-api-m07f.onrender.com/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: newTodo,
        isChecked: false,
        date: Date.now(),
      }),
    })
      .then((res) => res.json())
      .then((createdTask) => {
        /*Add the createdtask to after previous*/
        setTaskList((prev) => [...prev, createdTask]);
        /*Clear the input field*/
        setNewTodo("");
        setShowForm(false);
      })
      .catch((err) => {
        console.error("Failed to add task:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  useEffect(() => {
    fetchTasks();
  }, []);


  /*open TaskForm*/
  const enableForm = () => {
    setShowForm(true);
  };


  /*close TaskForm*/
  const removeForm = () => {
    setShowForm(false);
  };


  // filter in previous tasks fi they include text input
  const filteredSuggestions = taskList
    .filter((task) =>
      task.description.toLowerCase().includes(newTodo.toLowerCase())
    )
    // don't show suggestions if input is empty
    .filter(() => newTodo.trim() !== "")
    // avoid showing exact same text as the only suggestion
    .filter((task) => task.description.toLowerCase() !== newTodo.toLowerCase())
    //avoid duplicates
    .filter(
      (task, index, array) =>
        index ===
        array.findIndex(
          (item) =>
            item.description.toLowerCase() === task.description.toLowerCase()
        )
    );


  return (
    <section className="wrapper">
      <header>
        <div className="header-container">
          <div className="task-header">
            <h1>
              <i className="fa-solid fa-bars fa-sm"></i>
              All Tasks
            </h1>
            {/*Set the number of tasks to be the amount of taskt in the array with .length*/}
            <div className="counter-container">
              <span>{taskList.length} Tasks</span>
            </div>
          </div>

          <div className="add-button-container">
            <button id="add-task" onClick={enableForm}>
              <div>+</div>
              <div>ADD</div>
            </button>
          </div>
        </div>
      </header>

      <TaskList
        loading={loading}
        taskList={taskList}
        setTaskList={setTaskList}
      />

      {showForm && (
        <TaskForm
          newTodo={newTodo}
          onNewTodoChange={handleNewTodoChange}
          onFormSubmit={onFormSubmit}
          onCloseForm={removeForm}
          filteredSuggestions={filteredSuggestions}
          onSuggestionCreate={handleSuggestionCreate}
        />
      )}
    </section>
  );
};