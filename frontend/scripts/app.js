class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentUser = null;
        this.currentEditId = null;
        this.currentDeleteId = null;
        this.token = localStorage.getItem('jwt_token');
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuth();
    }

    bindEvents() {
        // Authentication events
        document.getElementById('loginForm').querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        document.getElementById('registerForm').querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.register();
        });

        document.getElementById('showRegister').addEventListener('click', () => {
            this.showRegisterForm();
        });

        document.getElementById('showLogin').addEventListener('click', () => {
            this.showLoginForm();
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Task form submission
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Edit form submission
        document.getElementById('editTaskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEditTask();
        });

        // Modal events
        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.closeEditModal();
        });

        document.getElementById('cancelDelete').addEventListener('click', () => {
            this.closeDeleteModal();
        });

        document.getElementById('confirmDelete').addEventListener('click', () => {
            this.deleteTask(this.currentDeleteId);
        });

        // Close modals when clicking outside
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeEditModal();
            }
        });

        document.getElementById('deleteModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeDeleteModal();
            }
        });
    }

    getAuthHeaders() {
        if (!this.token) {
            return {};
        }
        return {
            'Authorization': `Bearer ${this.token}`
        };
    }

    async checkAuth() {
        if (!this.token) {
            this.showAuth();
            return;
        }

        try {
            const response = await fetch('/api/auth/me', {
                headers: this.getAuthHeaders()
            });
            
            if (response.ok) {
                const data = await response.json();
                this.currentUser = data.user;
                this.showApp();
                this.loadTasks();
            } else {
                this.clearToken();
                this.showAuth();
            }
        } catch (error) {
            console.error('Auth check error:', error);
            this.clearToken();
            this.showAuth();
        }
    }

    async login() {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!username || !password) {
            this.showError('Please enter both username and password');
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                this.currentUser = data.user;
                localStorage.setItem('jwt_token', this.token);
                this.showApp();
                this.loadTasks();
                this.showSuccess('Login successful!');
            } else {
                this.showError(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Network error. Please try again.');
        }
    }

    async register() {
        const username = document.getElementById('registerUsername').value.trim();
        const password = document.getElementById('registerPassword').value;

        if (!username || !password) {
            this.showError('Please enter both username and password');
            return;
        }

        if (username.length < 3) {
            this.showError('Username must be at least 3 characters long');
            return;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters long');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                this.currentUser = data.user;
                localStorage.setItem('jwt_token', this.token);
                this.showApp();
                this.loadTasks();
                this.showSuccess('Registration successful!');
            } else {
                this.showError(data.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showError('Network error. Please try again.');
        }
    }

    logout() {
        this.clearToken();
        this.currentUser = null;
        this.tasks = [];
        this.showAuth();
        this.showSuccess('Logged out successfully');
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('jwt_token');
    }

    showAuth() {
        document.getElementById('authContainer').classList.remove('hidden');
        document.getElementById('appContainer').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        
        // Clear forms
        document.getElementById('loginForm').querySelector('form').reset();
        document.getElementById('registerForm').querySelector('form').reset();
    }

    showApp() {
        document.getElementById('authContainer').classList.add('hidden');
        document.getElementById('appContainer').classList.remove('hidden');
        
        if (this.currentUser) {
            document.getElementById('welcomeMessage').textContent = `Welcome, ${this.currentUser.username}!`;
        }
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
    }

    showRegisterForm() {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.remove('hidden');
    }

    async handleApiResponse(response) {
        if (response.status === 401) {
            // Token expired or invalid
            this.clearToken();
            this.showAuth();
            this.showError('Session expired. Please login again.');
            return null;
        }
        return response;
    }

    async loadTasks() {
        try {
            this.showLoading(true);
            const response = await fetch('/api/tasks', {
                headers: this.getAuthHeaders()
            });
            
            const handledResponse = await this.handleApiResponse(response);
            if (!handledResponse) return;
            
            if (!response.ok) {
                throw new Error('Failed to load tasks');
            }
            
            const data = await response.json();
            this.tasks = data.tasks;
            this.renderTasks();
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.showError('Failed to load tasks. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async addTask() {
        const formData = new FormData(document.getElementById('taskForm'));
        const taskData = {
            task: formData.get('task').trim(),
            description: formData.get('description').trim() || null,
            deadline: formData.get('deadline') || null
        };

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders()
                },
                body: JSON.stringify(taskData)
            });

            const handledResponse = await this.handleApiResponse(response);
            if (!handledResponse) return;

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to add task');
            }

            const newTask = await response.json();
            this.tasks.push(newTask);
            this.renderTasks();
            this.resetForm();
            this.showSuccess('Task added successfully!');
        } catch (error) {
            console.error('Error adding task:', error);
            this.showError(error.message);
        }
    }

    async updateTask(id, updates) {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders()
                },
                body: JSON.stringify(updates)
            });

            const handledResponse = await this.handleApiResponse(response);
            if (!handledResponse) return;

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update task');
            }

            const updatedTask = await response.json();
            const index = this.tasks.findIndex(task => task.id === id);
            if (index !== -1) {
                this.tasks[index] = updatedTask;
                this.renderTasks();
            }
        } catch (error) {
            console.error('Error updating task:', error);
            this.showError(error.message);
        }
    }

    async deleteTask(id) {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            const handledResponse = await this.handleApiResponse(response);
            if (!handledResponse) return;

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete task');
            }

            this.tasks = this.tasks.filter(task => task.id !== id);
            this.renderTasks();
            this.closeDeleteModal();
            this.showSuccess('Task deleted successfully!');
        } catch (error) {
            console.error('Error deleting task:', error);
            this.showError(error.message);
        }
    }

    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        const noTasks = document.getElementById('noTasks');

        if (this.tasks.length === 0) {
            tasksList.innerHTML = '';
            noTasks.classList.remove('hidden');
            return;
        }

        noTasks.classList.add('hidden');
        
        // Sort tasks by deadline (ascending), then by created_at (descending)
        const sortedTasks = [...this.tasks].sort((a, b) => {
            if (a.deadline && b.deadline) {
                return new Date(a.deadline) - new Date(b.deadline);
            }
            if (a.deadline && !b.deadline) return -1;
            if (!a.deadline && b.deadline) return 1;
            return new Date(b.created_at) - new Date(a.created_at);
        });

        tasksList.innerHTML = sortedTasks.map(task => this.renderTask(task)).join('');
    }

    renderTask(task) {
        const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !task.completed;
        const deadlineText = task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline';
        const taskCardClass = task.completed ? 'task-card completed' : (isOverdue ? 'task-card overdue' : 'task-card');
        
        return `
            <div class="${taskCardClass} p-6 m-4 rounded-2xl animate-fadeInUp">
                <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-4 flex-1">
                        <div class="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 transition-all duration-200 hover:border-blue-400">
                            <input type="checkbox" 
                                   ${task.completed ? 'checked' : ''} 
                                   onchange="app.toggleTaskCompletion(${task.id})"
                                   class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-0 rounded transition-all duration-200">
                        </div>
                        <div class="flex-1">
                            <h3 class="text-lg font-semibold ${task.completed ? 'line-through text-slate-500' : 'text-slate-800'} mb-2">
                                ${this.escapeHtml(task.task)}
                            </h3>
                            ${task.description ? `<p class="text-slate-600 mt-2 ${task.completed ? 'line-through' : ''} leading-relaxed">${this.escapeHtml(task.description)}</p>` : ''}
                            <div class="flex items-center space-x-6 mt-4 text-sm">
                                <span class="flex items-center text-slate-500">
                                    <i class="fas fa-calendar-alt mr-2 text-blue-500"></i>
                                    ${deadlineText}
                                </span>
                                ${isOverdue ? '<span class="flex items-center text-red-500 font-semibold"><i class="fas fa-exclamation-triangle mr-2"></i>Overdue</span>' : ''}
                                <span class="flex items-center text-slate-500">
                                    <i class="fas fa-clock mr-2 text-cyan-500"></i>
                                    ${new Date(task.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="flex space-x-2 ml-4">
                        <button onclick="app.openEditModal(${task.id})" 
                                class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600 hover:from-blue-100 hover:to-cyan-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="app.openDeleteModal(${task.id})" 
                                class="w-10 h-10 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 text-red-600 hover:from-red-100 hover:to-pink-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    toggleTaskCompletion(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            this.updateTask(id, { completed: !task.completed });
        }
    }

    openEditModal(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        this.currentEditId = id;
        document.getElementById('editTaskName').value = task.task;
        document.getElementById('editTaskDescription').value = task.description || '';
        document.getElementById('editTaskDeadline').value = task.deadline || '';
        
        document.getElementById('editModal').classList.remove('hidden');
    }

    closeEditModal() {
        this.currentEditId = null;
        document.getElementById('editModal').classList.add('hidden');
        document.getElementById('editTaskForm').reset();
    }

    saveEditTask() {
        if (!this.currentEditId) return;

        const formData = new FormData(document.getElementById('editTaskForm'));
        const updates = {
            task: formData.get('task').trim(),
            description: formData.get('description').trim() || null,
            deadline: formData.get('deadline') || null
        };

        this.updateTask(this.currentEditId, updates);
        this.closeEditModal();
    }

    openDeleteModal(id) {
        this.currentDeleteId = id;
        document.getElementById('deleteModal').classList.remove('hidden');
    }

    closeDeleteModal() {
        this.currentDeleteId = null;
        document.getElementById('deleteModal').classList.add('hidden');
    }

    resetForm() {
        document.getElementById('taskForm').reset();
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        errorText.textContent = message;
        errorDiv.classList.remove('hidden');
        
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    }

    showSuccess(message) {
        const successDiv = document.getElementById('successMessage');
        const successText = document.getElementById('successText');
        successText.textContent = message;
        successDiv.classList.remove('hidden');
        
        setTimeout(() => {
            successDiv.classList.add('hidden');
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app
const app = new TodoApp();