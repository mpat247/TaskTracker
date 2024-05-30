const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const listRoutes = require('./routes/listRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://admin:admin@TaskTracker.nksfoxj.mongodb.net/tasktracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(cors());
app.use(bodyParser.json());

app.use('/tasks', taskRoutes);
app.use('/lists', listRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
