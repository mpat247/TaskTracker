import React, { useState, useEffect } from 'react';
import BigCalendar from './BigCalendar';
import TaskModal from './TaskModal';
import axios from 'axios';
import { FormControl, FormControlLabel, Radio, RadioGroup, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
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
    const response = await axios.get('http://localhost:5005/tasks');
    setTasks(response.data);
  };

  const fetchLists = async () => {
    const response = await axios.get('http://localhost:5005/lists');
    setLists(response.data);
    generateListColors(response.data);
  };

  const generateListColors = (lists) => {
    const usedColors = new Set();
    const colors = {};

    const generateUniqueColor = () => {
      let color;
      do {
        color = `hsl(${Math.random() * 360}, 100%, 70%)`;
      } while (usedColors.has(color));
      usedColors.add(color);
      return color;
    };

    lists.forEach(list => {
      colors[list._id] = list.color || generateUniqueColor();
    });

    setListColors(colors);
  };



  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      await axios.post('http://localhost:5005/tasks', { title: newTaskTitle });
      setNewTaskTitle('');
      fetchTasks();
    }
  };

  const handleTaskClick = (task) => {
    setCurrentTask(task);
    setOpenModal(true);
  };

  const handleDeleteTask = async (id) => {
    await axios.delete(`http://localhost:5005/tasks/${id}`);
    fetchTasks();
  };

  const handleToggleComplete = async (task) => {
    await axios.put(`http://localhost:5005/tasks/${task._id}`, { completed: !task.completed });
    fetchTasks();
  };


  const handleAddList = async () => {
    if (newListName.trim()) {
      const color = generateUniqueColor();
      const response = await axios.post('http://localhost:5005/lists', { name: newListName, color });
      if (response.data) {
        setNewListName('');
        fetchLists();
      }
    }
  };


  const generateUniqueColor = () => {
    let color;
    const usedColors = Object.values(listColors);
    do {
      color = `hsl(${Math.random() * 360}, 100%, 70%)`;
    } while (usedColors.includes(color));
    return color;
  };

  const applyFilter = (tasks) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const endOfWeek = new Date();
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

    switch (filter) {
      case 'creation-date':
        return tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'due-date':
        return tasks.sort((a, b) => new Date(a.dateDue) - new Date(b.dateDue));
      case 'priority':
        return tasks.sort((a, b) => a.priority - b.priority);
      case 'due-today':
        return tasks.filter(task => new Date(task.dateDue).toDateString() === today.toDateString());
      case 'due-tomorrow':
        return tasks.filter(task => new Date(task.dateDue).toDateString() === tomorrow.toDateString());
      case 'due-this-week':
        return tasks.filter(task => new Date(task.dateDue) <= endOfWeek);
      case 'no-due-date':
        return tasks.filter(task => !task.dateDue);
      case 'list':
        return tasks.filter(task => task.list === selectedList); // Correct comparison for list ID
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
        <h2 style={{ textAlign: "center" }}>Tasks</h2>
        <div className="add-task-container">
          <TextField
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add new task"
            className="add-task-input"
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            fullWidth
          />
          <Button onClick={() => setOpenModal(true)}>Advanced</Button>
        </div>
        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              className="task-item"
              style={{ borderLeftColor: listColors[task.list], backgroundColor: task.completed ? '#d4edda' : '#e9ecef' }}
            >
              <div className="task-content" onClick={() => handleTaskClick(task)}>
                <h3 className="task-title">{task.title}</h3>
                {task.dateDue && (
                  <p className="task-date">Due: {new Date(task.dateDue).toLocaleDateString()}</p>
                )}
              </div>
              <div className="task-actions">
                <Button onClick={() => handleToggleComplete(task)}>
                  <CheckIcon style={{ color: task.completed ? 'green' : 'gray' }} />
                </Button>
                <Button onClick={() => handleDeleteTask(task._id)}>
                  <DeleteIcon />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="filters-container">
        <h3 style={{ textAlign: "center" }}>Filters</h3>
        <FormControl component="fieldset" style={{ marginTop: "-2vh" }}>
          <RadioGroup value={filter} onChange={(e) => setFilter(e.target.value)}>
            <FormControlLabel
              value="all-tasks"
              control={<Radio />}
              label={<span style={{ fontSize: '0.8rem' }}>All Tasks</span>}
            />
            <FormControlLabel
              value="creation-date"
              control={<Radio />}
              label={<span style={{ fontSize: '0.8rem' }}>Creation Date</span>}
            />
            <FormControlLabel
              value="due-date"
              control={<Radio />}
              label={<span style={{ fontSize: '0.8rem' }}>Due Date</span>}
            />
            <FormControlLabel
              value="priority"
              control={<Radio />}
              label={<span style={{ fontSize: '0.8rem' }}>Priority</span>}
            />
            <FormControlLabel
              value="due-today"
              control={<Radio />}
              label={<span style={{ fontSize: '0.8rem' }}>Due Today</span>}
            />
            <FormControlLabel
              value="due-tomorrow"
              control={<Radio />}
              label={<span style={{ fontSize: '0.8rem' }}>Due Tomorrow</span>}
            />
            <FormControlLabel
              value="due-this-week"
              control={<Radio />}
              label={<span style={{ fontSize: '0.8rem' }}>Due This Week</span>}
            />
            <FormControlLabel
              value="no-due-date"
              control={<Radio />}
              label={<span style={{ fontSize: '0.8rem' }}>No Due Date</span>}
            />
            <FormControlLabel
              value="complete"
              control={<Radio />}
              label={<span style={{ fontSize: '0.8rem' }}>Complete</span>}
            />
          </RadioGroup>
        </FormControl>
        <div style={{ marginTop: "2vh", marginBottom: '-1vh' }}>
          <h3 style={{ textAlign: 'center' }}>Lists</h3>
        </div>
        <ul className="list-filters">
          {lists.map(list => (
            <li key={list._id}>
              <Button
                className={selectedList === list._id ? 'active' : ''}
                onClick={() => { setFilter('list'); setSelectedList(list._id); }}
                style={{ backgroundColor: listColors[list._id], color: '#fff', fontSize: '0.8rem', lineHeight: '1.2' }}
              >
                {list.name}
              </Button>
            </li>
          ))}
        </ul>
        <div className="add-list-container" style={{ marginTop: "3vh" }}>
          <TextField
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Add new list"
            className="add-list-input"
            onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
            fullWidth
            InputProps={{ style: { fontSize: '0.8rem', lineHeight: '1.2', padding: '8px 12px', height: '36px' } }}
          />
        </div>
        <Button onClick={handleAddList} style={{ fontSize: '0.8rem', padding: '8px 12px' }}>Add List</Button>
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
        lists={lists}
      />
    </div>
  );
};

export default TaskListAndFilters;

