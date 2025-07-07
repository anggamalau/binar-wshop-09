function validateTask(req, res, next) {
  const { task, description, deadline } = req.body;
  
  // Task name validation
  if (!task || typeof task !== 'string') {
    return res.status(400).json({ error: 'Task name is required and must be a string' });
  }
  
  if (task.length > 200) {
    return res.status(400).json({ error: 'Task name must be 200 characters or less' });
  }
  
  // Description validation
  if (description && typeof description !== 'string') {
    return res.status(400).json({ error: 'Description must be a string' });
  }
  
  if (description && description.length > 500) {
    return res.status(400).json({ error: 'Description must be 500 characters or less' });
  }
  
  // Deadline validation
  if (deadline && !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
    return res.status(400).json({ error: 'Deadline must be in YYYY-MM-DD format' });
  }
  
  if (deadline && isNaN(Date.parse(deadline))) {
    return res.status(400).json({ error: 'Deadline must be a valid date' });
  }
  
  next();
}

function validateTaskUpdate(req, res, next) {
  const { task, description, deadline, completed } = req.body;
  
  // Task name validation (optional for updates)
  if (task !== undefined) {
    if (!task || typeof task !== 'string') {
      return res.status(400).json({ error: 'Task name must be a non-empty string' });
    }
    
    if (task.length > 200) {
      return res.status(400).json({ error: 'Task name must be 200 characters or less' });
    }
  }
  
  // Description validation (optional for updates)
  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ error: 'Description must be a string' });
  }
  
  if (description && description.length > 500) {
    return res.status(400).json({ error: 'Description must be 500 characters or less' });
  }
  
  // Deadline validation (optional for updates)
  if (deadline !== undefined) {
    if (deadline && !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
      return res.status(400).json({ error: 'Deadline must be in YYYY-MM-DD format' });
    }
    
    if (deadline && isNaN(Date.parse(deadline))) {
      return res.status(400).json({ error: 'Deadline must be a valid date' });
    }
  }
  
  // Completed validation (optional for updates)
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be a boolean' });
  }
  
  next();
}

module.exports = {
  validateTask,
  validateTaskUpdate
};