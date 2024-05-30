import React, { useState, useEffect } from 'react';
import BigCalendar from './BigCalendar';
import TaskModal from './TaskModal';
import axios from 'axios';
import './TaskListAndFilters.css';

const TaskListAndFilters = () => {
  const [tasks, setTasks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [listColors, setListColors] = useState({});

  useEffect(() => {
    fetchTasks();
    fetchLists();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get('http://localhost:5000/tasks');
    setTasks(response.data);
  };

  const fetchLists = async () => {
    const response = await axios.get('http://localhost:5000/lists');
    setLists(response.data);
    generateListColors(response.data);
  };

  const generateListColors = (lists) => {
    const colors = {};
    lists.forEach(list => {
      colors[list._id] = `hsl(${Math.random() * 360}, 100%, 70%)`;
    });
    setListColors(colors);
  };

  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      await axios.post('http://localhost:5000/tasks', { title: newTaskTitle });
      setNewTaskTitle('');
      fetchTasks();
    }
  };

  const handleTaskClick = (task) => {
    setCurrentTask(task);
    setOpenModal(true);
  };

  const handleDeleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  const handleAddList = async () => {
    if (newListName.trim()) {
      await axios.post('http://localhost:5000/lists', { name: newListName });
      setNewListName('');
      fetchLists();
    }
  };

  const applyFilter = (tasks) => {
    switch (filter) {
      case 'creation-date':
        return tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'due-date':
        return tasks.sort((a, b) => new Date(a.dateDue) - new Date(b.dateDue));
      case 'priority':
        return tasks.sort((a, b) => a.priority - b.priority);
      case 'list':
        return tasks.filter(task => task.list === selectedList);
      default:
        return tasks;
    }
  };

  const filteredTasks = applyFilter(tasks);

  const events = filteredTasks.map(task => ({
    title: task.title,
    start: new Date(task.dateDue),
    end: new Date(task.dateDue),
  }));

  return (
    <div className="task-list-and-filters">
      <div className="calendar-container">
        <BigCalendar events={events} />
      </div>
      <div className="tasks-container">
        <h2>Tasks</h2>
        <div className="add-task-container">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add new task"
            className="add-task-input"
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <button onClick={handleAddTask}>✔</button>
          <button onClick={() => setOpenModal(true)}>Advanced</button>
        </div>
        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              className="task-item"
              style={{ borderLeftColor: listColors[task.list] }}
            >
              <div className="task-content" onClick={() => handleTaskClick(task)}>
                <h3 className="task-title">{task.title}</h3>
                {task.dateDue && (
                  <p className="task-date">Due: {new Date(task.dateDue).toLocaleDateString()}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="filters-container">
        <h3>Filters</h3>
        <div className="filter-buttons">
          <button className={filter === 'creation-date' ? 'active' : ''} onClick={() => setFilter('creation-date')}>Creation Date</button>
          <button className={filter === 'due-date' ? 'active' : ''} onClick={() => setFilter('due-date')}>Due Date</button>
          <button className={filter === 'priority' ? 'active' : ''} onClick={() => setFilter('priority')}>Priority</button>
        </div>
        <h3>Lists</h3>
        <ul className="list-filters">
          {lists.map(list => (
            <li key={list._id}>
              <button
                className={selectedList === list._id ? 'active' : ''}
                onClick={() => { setFilter('list'); setSelectedList(list._id); }}
                style={{ backgroundColor: listColors[list._id] }}
              >
                {list.name}
              </button>
            </li>
          ))}
        </ul>
        <div className="add-list-container">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Add new list"
            className="add-list-input"
            onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
          />
          <button onClick={handleAddList}>Add List</button>
        </div>
      </div>
      <TaskModal
        open={openModal}
        handleClose={() => {
          setOpenModal(false);
          setCurrentTask(null);
        }}
        fetchTasks={fetchTasks}
        task={currentTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default TaskListAndFilters;
