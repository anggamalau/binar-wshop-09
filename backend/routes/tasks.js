const express = require('express');
const { getDatabase } = require('../database/init');
const { validateTask, validateTaskUpdate } = require('../middleware/validation');
const { requireAuth, getUserId } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// GET /api/tasks - Retrieve all tasks
router.get('/', (req, res) => {
  const db = getDatabase();
  const userId = getUserId(req);
  
  db.all('SELECT * FROM tasks WHERE user_id = ? ORDER BY deadline ASC, created_at DESC', [userId], (err, rows) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    res.json({ tasks: rows });
  });
  
  db.close();
});

// GET /api/tasks/:id - Get specific task
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  const userId = getUserId(req);
  
  db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId], (err, row) => {
    if (err) {
      console.error('Error fetching task:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    
    res.json(row);
  });
  
  db.close();
});

// POST /api/tasks - Create new task
router.post('/', validateTask, (req, res) => {
  const { task, description, deadline } = req.body;
  const db = getDatabase();
  const userId = getUserId(req);
  
  const query = `
    INSERT INTO tasks (user_id, task, description, deadline, completed)
    VALUES (?, ?, ?, ?, FALSE)
  `;
  
  db.run(query, [userId, task, description || null, deadline || null], function(err) {
    if (err) {
      console.error('Error creating task:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    // Get the created task
    db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('Error fetching created task:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      
      res.status(201).json(row);
    });
  });
  
  db.close();
});

// PUT /api/tasks/:id - Update specific task
router.put('/:id', validateTaskUpdate, (req, res) => {
  const { id } = req.params;
  const { task, description, deadline, completed } = req.body;
  const db = getDatabase();
  const userId = getUserId(req);
  
  // First check if task exists and belongs to user
  db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId], (err, row) => {
    if (err) {
      console.error('Error fetching task:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    
    // Build update query dynamically
    const updates = [];
    const values = [];
    
    if (task !== undefined) {
      updates.push('task = ?');
      values.push(task);
    }
    
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    
    if (deadline !== undefined) {
      updates.push('deadline = ?');
      values.push(deadline);
    }
    
    if (completed !== undefined) {
      updates.push('completed = ?');
      values.push(completed);
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
    
    db.run(query, values, function(err) {
      if (err) {
        console.error('Error updating task:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      
      // Get the updated task
      db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, updatedRow) => {
        if (err) {
          console.error('Error fetching updated task:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        
        res.json(updatedRow);
      });
    });
  });
  
  db.close();
});

// DELETE /api/tasks/:id - Delete specific task
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  const userId = getUserId(req);
  
  // First check if task exists and belongs to user
  db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId], (err, row) => {
    if (err) {
      console.error('Error fetching task:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    
    // Delete the task
    db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      
      res.status(204).send();
    });
  });
  
  db.close();
});

module.exports = router;