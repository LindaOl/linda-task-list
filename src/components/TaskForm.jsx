const TaskForm = ({ newTodo,
  onNewTodoChange,
  onFormSubmit,
  onCloseForm,
  filteredSuggestions, onSuggestionCreate
}) => {
  return (
    <section className="form-wrapper">
      <article className="form-frame">

        <div className="add-task-title-container">
          <div className="close-button-container">
            <i
              className="fa-regular fa-circle-xmark fa-xl"
              onClick={onCloseForm}
            ></i>
          </div>

          <h1><img src="./images/diddo.png" alt="Diddo icon" />Diddo</h1>
          <h2>Add Task</h2>
        </div>
        <form onSubmit={onFormSubmit}>
          <input type="text"
            className="text-input"
            value={newTodo}
            onChange={onNewTodoChange}
            placeholder="Type a task.."
          />
          {/* Show matching previous tasks underneath the input */}
          {filteredSuggestions.length > 0 && (
            <div className="suggestion-box">
              <div className="suggestion-list">
                {filteredSuggestions.map((task) => (
                  <div
                    key={task._id}
                    className="suggestion-item"
                    onClick={() => onSuggestionCreate(task.description)}
                  >
                    <i class="fa-regular fa-square-plus fa-lg"></i>{task.description}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit">Add New Task</button>
        </form>
      </article>
    </section>
  );
};

export default TaskForm;