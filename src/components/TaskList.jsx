const TaskList = ({ loading, taskList, setTaskList }) => {
  if (loading) {
    return <h1>Loading in progress...</h1>;
  }

  const onTaskCheckChange = (task) => {
    // Make a POST request here with the updated task isChecked value
    fetch(`https://task-api-m07f.onrender.com/tasks/${task._id}/check`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTaskList((prevTaskList) =>
          prevTaskList.map((item) =>
            item._id === task._id ? updatedTask : item
          )
        );
      })
      .catch((err) => {
        console.error("Failed to update task:", err);
      });
  };

  return (
    <section className="tasks">
      {taskList
        .filter((task) => !task.isChecked)
        .slice()
        .reverse()
        .sort((a, b) => b.date - a.date)
        .map((task) => (
          <div key={task._id} className="task">
            <div className="check">
              <input
                onChange={() => onTaskCheckChange(task)}
                type="checkbox"
                checked={task.isChecked}
              />
            </div>

            <div className="list-item">
              <h4>{task.description}</h4>
              {/* format the date */}
              <p>
                <i className="fa-regular fa-calendar"></i>
                {new Date(task.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="dotted-menu">
              <i className="fa-solid fa-ellipsis-vertical"></i>
              <i className="fa-solid fa-ellipsis-vertical fa-lg"></i>
            </div>
          </div>
        ))}
    </section>
  );
};

export default TaskList;