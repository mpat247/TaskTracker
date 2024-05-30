import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
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

const TaskModal = ({ open, handleClose, fetchTasks, task, onDelete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [dateDue, setDateDue] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setCategory(task.category);
      setDateDue(task.dateDue ? task.dateDue.split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('');
      setDateDue('');
    }
  }, [task]);

  const handleSubmit = async () => {
    const taskData = { title, description, category, dateDue };
    if (task) {
      await axios.put(`http://localhost:5000/tasks/${task._id}`, taskData);
    } else {
      await axios.post('http://localhost:5000/tasks', taskData);
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
        <Typography variant="h6" component="h2">
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
        <TextField
          fullWidth
          margin="normal"
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          type="date"
          label="Due Date"
          InputLabelProps={{ shrink: true }}
          value={dateDue}
          onChange={(e) => setDateDue(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {task ? 'Update Task' : 'Add Task'}
        </Button>
        {task && (
          <Button variant="contained" color="secondary" onClick={handleDelete} style={{ marginTop: '10px' }}>
            Delete Task
          </Button>
        )}
      </Box>
    </Modal>
  );
};

export default TaskModal;
