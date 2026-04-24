import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { UndoDeletion } from "./Undo";

export const Tasks = ({ filter }) => {
  const [taskList, setTaskList] = useState([]);
  // define the setting state functions
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [showForm, setShowForm] = useState(false);


  const [lastDeleted, setLastDeleted] = useState(null);

  /*filters/sorting*/
  const filteredTasks = taskList.filter((task) => {
    if (filter === "current") return !task.isChecked;
    if (filter === "completed") return task.isChecked;
    return true;
  });

  // fetch API, json = "tasks", setTaskList to be the json content (setTaskList)
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

  //set isChecked on task locally when checkbox is clicked. save state in lastDeleted
  const handleTaskCheck = (taskId) => {
    const task = taskList.find((t) => t._id === taskId);
    if (!task) return;

    setTaskList((prev) =>
      prev.map((t) =>
        t._id === taskId ? { ...t, isChecked: true } : t
      )
    );
    setLastDeleted(task);
  };

  // handle undo message box
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


  //
  const handleExpire = () => {
    if (!lastDeleted) return;

    const taskId = lastDeleted._id;
    setLastDeleted(null);

    // Call backend to permanently mark this task as isChecked: true.
    // The backend sets isChecked = true and returns the updated task.
    fetch(`https://task-api-m07f.onrender.com/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isChecked: true,
      }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        // Replace local task with backend-confirmed version
        setTaskList((prev) =>
          prev.map((task) =>
            task._id === taskId ? updatedTask : task
          )
        );

        // only remove undo AFTER success

      })
      .catch((err) => {
        console.error("Failed to update task:", err);
      });
  }


  /* remove default submit, and json content rests in createTask. In setTaskList add the newly created task to old list.*/
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
        //Add the createdtask to after previous
        setTaskList((prev) => [...prev, createdTask]);
        //Clear the input field
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
    setNewTodo("");
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
              {filter === "current"
                ? "Active Tasks"
                : filter === "completed"
                  ? "Completed Tasks"
                  : "All Tasks"}
            </h1>
            {/*Set the number of tasks to be the amount of taskt in the array with .length*/}
            <div className="counter-container">
              <span>{taskList.filter((task) => !task.isChecked).length} Tasks</span>
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