import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { UndoDeletion } from "./Undo";

export const Tasks = ({ filter, setFilter }) => {
  // state
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [lastDeleted, setLastDeleted] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);


  // filter tasks based on selected view
  const filteredTasks = taskList.filter((task) => {
    if (filter === "current") return !task.isChecked;
    if (filter === "completed") return task.isChecked;
    return true;
  });


  // count visible tasks
  const count = filteredTasks.length;


  // fetch tasks from API
  const fetchTasks = () => {
    setLoading(true);
    fetch("https://task-api-m07f.onrender.com/tasks")
      .then((res) => res.json())
      .then((tasks) => {
        setTaskList(tasks);
      })
      .catch((err) => {
        console.error("Failed to fetch tasks:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  // update input value
  const handleNewTodoChange = (event) => {
    setNewTodo(event.target.value);
  };


  // create new task (used by form + suggestions)
  const createTask = (description) => {
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
        console.error("Failed to add task:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  // submit form to create task
  const onFormSubmit = (event) => {
    event.preventDefault();
    if (!newTodo.trim()) return;

    createTask(newTodo);
  };


  // create task from suggestion click
  const handleSuggestionCreate = (description) => {
    createTask(description);
  };


  // mark task as completed + store for undo
  const handleTaskCheck = (taskId) => {
    setTaskList((prev) => {
      const task = prev.find((t) => t._id === taskId);
      if (!task) return prev;

      setLastDeleted(task);

      return prev.map((t) =>
        t._id === taskId ? { ...t, isChecked: true } : t
      );
    });
  };


  // undo last completed task
  const handleUndo = () => {
    if (!lastDeleted) return;

    setTaskList((prev) =>
      prev.map((task) =>
        task._id === lastDeleted._id
          ? { ...task, isChecked: false }
          : task
      )
    );

    setLastDeleted(null);
  };


  // finalize completion after undo timer
  const handleExpire = () => {
    if (!lastDeleted) return;

    const taskId = lastDeleted._id;

    setLastDeleted(null);

    fetch(`https://task-api-m07f.onrender.com/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isChecked: true }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTaskList((prev) =>
          prev.map((task) =>
            task._id === taskId ? updatedTask : task
          )
        );
      })
      .catch((err) => {
        console.error("Failed to update task:", err);
      });
  };


  // fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);


  // open/close form
  const enableForm = () => {
    setShowForm(true);
  };

  const removeForm = () => {
    setShowForm(false);
    setNewTodo("");
  };


  // build suggestions from existing tasks
  const filteredSuggestions = taskList
    .filter((task) =>
      task.description.toLowerCase().includes(newTodo.toLowerCase())
    )
    .filter(() => newTodo.trim() !== "")
    .filter((task) => task.description.toLowerCase() !== newTodo.toLowerCase())
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
              <i
                className="fa-solid fa-bars fa-sm main-bars"
                onClick={() => setShowMobileMenu((prev) => !prev)}
              ></i>
              {filter === "current"
                ? "Active Tasks"
                : filter === "completed"
                  ? "Completed Tasks"
                  : "All Tasks"}
            </h1>

            {showMobileMenu && (
              <div className="mobile-dropdown">
                <div
                  className="mobile-menu-item"
                  onClick={() => {
                    setFilter("current");
                    setShowMobileMenu(false);
                  }}
                >
                  <i className="fa-solid fa-bars mobile-bars"></i>
                  <h4>Current Tasks</h4>
                </div>

                <div
                  className="mobile-menu-item"
                  onClick={() => {
                    setFilter("all");
                    setShowMobileMenu(false);
                  }}
                >
                  <i className="fa-solid fa-check-double"></i>
                  <h4>All Tasks</h4>
                </div>

                <div
                  className="mobile-menu-item"
                  onClick={() => {
                    setFilter("completed");
                    setShowMobileMenu(false);
                  }}
                >
                  <i className="fa-regular fa-circle-check"></i>
                  <h4>Completed Tasks</h4>
                </div>
              </div>
            )}

            <div className="counter-container">
              <span>{count} {count === 1 ? "Task" : "Tasks"}</span>
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
        taskList={filteredTasks}
        onTaskCheck={handleTaskCheck}
      />

      {lastDeleted && (
        <UndoDeletion
          key={lastDeleted._id}
          onUndo={handleUndo}
          onExpire={handleExpire}
          taskText={lastDeleted.description}
        />
      )}

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