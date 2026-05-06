export default function TaskList ({ tasks, onRun }) {
  return (
    <div className="card">
      <h3>Tasks</h3>
      <div className="task-grid">
        {tasks.map((task) => (
          <article key={task._id} className="task-item">
            <div className="task-head">
              <strong>{task.title}</strong>
              <span className={`status ${task.status}`}>{task.status}</span>
            </div>
            <p><b>Operation:</b> {task.operation}</p>
            <p><b>Input:</b> {task.inputText}</p>
            <p><b>Result:</b> {task.result || '-'}</p>
            <p><b>Logs:</b> {task.logs?.join(' | ') || '-'}</p>
            {task.error && <p className="error">Error: {task.error}</p>}
            <button onClick={() => onRun(task._id)}>Run</button>
          </article>
        ))}
      </div>
    </div>
  );
}
