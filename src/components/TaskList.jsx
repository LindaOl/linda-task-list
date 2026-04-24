const TaskList = ({ loading, taskList, onTaskCheck }) => {
  if (loading) {
    return <h1>Loading in progress...</h1>;
  }

  return (
    <section className="tasks">
      {taskList
        .slice()
        .sort((a, b) => b.date - a.date)
        .map((task) => (
          <div key={task._id} className="task">
            <div className="check">
              <input
                type="checkbox"
                checked={task.isChecked}
                onChange={() => onTaskCheck(task._id)}
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