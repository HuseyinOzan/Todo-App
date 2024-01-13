import { useState, useRef } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const inputRef = useRef(null);

  const addTask = () => {
    if (!newTask.trim()) {
      setShowAlert(true);
      return;
    }
    setTasks([...tasks, { text: newTask, id: Date.now() }]);
    setNewTask("");
  };

  const clearTasks = () => {
    setTasks([]);
  }

  const startEditing = (index, task) => {
    setEditing(index);
    setEditedTask(task.text);
    setTimeout(() => {
      inputRef.current.focus();
    }, 0);
  };

  const saveTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, text: editedTask } : task
    );
    setTasks(updatedTasks);
    setEditing(null);
  };

  const handleInputKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      saveTask(index);
    }
  };

  const toggleTaskSelection = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const deleteSelectedTasks = () => {
    const updatedTasks = tasks.filter(task => !selectedTasks.includes(task.id));
    setTasks(updatedTasks);
    setSelectedTasks([]);
  };

  return (
    <div className="app-container">
      <div className={showAlert ? "alert show" : "alert"}>Lütfen bir görev girin!</div>
      <div className="input-container">
        <input
          type="text"
          value={newTask}
          onChange={(e) => {
            setNewTask(e.target.value);
            if (showAlert) {
              setShowAlert(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addTask();
            }
          }}
        />
        <button onClick={addTask}>Ekle</button>
        <button onClick={clearTasks}>Tümünü Sil</button>
        {selectedTasks.length > 0 && (
          <button onClick={deleteSelectedTasks}>Seçilenleri Sil</button>
        )}
      </div>
      <ul>
        {tasks.map((task, index) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={selectedTasks.includes(task.id)}
              onChange={() => toggleTaskSelection(task.id)}
            />
            {editing === index ? (
              <input
                type="text"
                value={editedTask}
                onChange={(e) => setEditedTask(e.target.value)}
                ref={inputRef}
                onKeyDown={(e) => handleInputKeyDown(e, index)}
              />
            ) : (
              task.text
            )}
            <div className="button-group">
              {editing === index ? (
                <button onClick={() => saveTask(index)}>Kaydet</button>
              ) : (
                <button onClick={() => startEditing(index, task)}>Düzenle</button>
              )}
              <button onClick={() => setTasks(tasks.filter((_, i) => i !== index))}>Sil</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
