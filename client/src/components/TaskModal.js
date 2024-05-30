import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const TaskModal = ({ open, handleClose, fetchTasks, task, onDelete, lists }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [list, setList] = useState('');
  const [dateDue, setDateDue] = useState('');
  const [priority, setPriority] = useState(0);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setList(task.list); // Ensure this is the list ID
      setDateDue(task.dateDue ? task.dateDue.split('T')[0] : '');
      setPriority(task.priority || 0);
    } else {
      setTitle('');
      setDescription('');
      setList('');
      setDateDue('');
      setPriority(0);
    }
  }, [task]);

  const handleSubmit = async () => {
    const taskData = {
      title,
      description,
      list,
      dateDue,
      priority,
      completed: task ? task.completed : false
    };
    if (task) {
      await axios.put(`http://localhost:5005/tasks/${task._id}`, taskData);
    } else {
      await axios.post('http://localhost:5005/tasks', taskData);
    }
    fetchTasks();
    handleClose();
  };

  const handleDelete = async () => {
    if (task) {
      await onDelete(task._id);
      handleClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" align="center">
          {task ? 'Edit Task' : 'Add New Task'}
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>List</InputLabel>
          <Select
            value={list}
            onChange={(e) => {
              setList(e.target.value);
            }}
          >
            {lists.map(listItem => (
              <MenuItem key={listItem._id} value={listItem._id}>
                {listItem.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          type="date"
          label="Due Date"
          InputLabelProps={{ shrink: true }}
          value={dateDue}
          onChange={(e) => setDateDue(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Priority"
          type="number"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />
        <Box display="flex" justifyContent="space-between" marginTop="20px">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {task ? 'Update Task' : 'Add Task'}
          </Button>
          {task && (
            <Button variant="contained" color="secondary" onClick={handleDelete}>
              Delete Task
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default TaskModal;
