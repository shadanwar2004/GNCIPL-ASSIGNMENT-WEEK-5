import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created');

  const { user, logout } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterAndSortTasks();
  }, [tasks, filter, sortBy]);

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const isDueToday = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate).toDateString() === new Date().toDateString();
  };

  const filterAndSortTasks = () => {
    let filtered = [...tasks];
    switch (filter) {
      case 'completed':
        filtered = filtered.filter(task => task.isCompleted);
        break;
      case 'pending':
        filtered = filtered.filter(task => !task.isCompleted);
        break;
      case 'overdue':
        filtered = filtered.filter(task => !task.isCompleted && isOverdue(task.dueDate));
        break;
      case 'today':
        filtered = filtered.filter(task => isDueToday(task.dueDate));
        break;
      default:
        break;
    }

    switch (sortBy) {
      case 'dueDate':
        filtered.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
        break;
      case 'description':
        filtered.sort((a, b) => a.description.localeCompare(b.description));
        break;
      case 'status':
        filtered.sort((a, b) => a.isCompleted - b.isCompleted);
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredTasks(filtered);
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/task');
      setTasks(response.data.tasks);
    } catch {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const taskData = { description: newTask };
      if (newTaskDueDate) taskData.dueDate = newTaskDueDate;
      const response = await axios.post('/task', taskData);
      setTasks([...tasks, response.data.task]);
      setNewTask('');
      setNewTaskDueDate('');
      setSuccess('Task created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/task/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
      setSuccess('Task deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to delete task');
    }
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      const response = await axios.put(`/task/${taskId}`, { isCompleted: !currentStatus });
      setTasks(tasks.map(task => task._id === taskId ? response.data.task : task));
      setSuccess(`Task marked as ${!currentStatus ? 'completed' : 'pending'}!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to update task status');
    }
  };

  const handleEditTask = async (taskId) => {
    if (!editText.trim()) return;
    try {
      const updateData = { description: editText };
      if (editDueDate) updateData.dueDate = editDueDate;
      const response = await axios.put(`/task/${taskId}`, updateData);
      setTasks(tasks.map(task => task._id === taskId ? response.data.task : task));
      setEditingTask(null);
      setEditText('');
      setEditDueDate('');
      setSuccess('Task updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to update task');
    }
  };

  const startEditing = (task) => {
    setEditingTask(task._id);
    setEditText(task.description);
    setEditDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditText('');
    setEditDueDate('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-fuchsia-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-fuchsia-900 to-black text-gray-100">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-md border-b border-pink-500/30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Task Manager</h1>
            <p className="text-pink-300">Welcome back, {user?.name}!</p>
          </div>
          <button
            onClick={logout}
            className="bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Error / Success */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
            <button onClick={() => setError('')} className="float-right text-red-300 hover:text-red-100">×</button>
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 border border-green-500/40 text-green-200 px-4 py-3 rounded-lg mb-6">
            {success}
            <button onClick={() => setSuccess('')} className="float-right text-green-300 hover:text-green-100">×</button>
          </div>
        )}

        {/* Add Task */}
        <div className="bg-black/50 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-pink-500/30">
          <h2 className="text-xl font-semibold mb-4 text-white">Add New Task</h2>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter task description..."
                className="flex-1 px-4 py-3 bg-black/50 border border-pink-500/40 rounded-lg text-white placeholder-pink-300/50 focus:ring-2 focus:ring-pink-400 outline-none"
                required
              />
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="px-4 py-3 bg-black/50 border border-pink-500/40 rounded-lg text-white focus:ring-2 focus:ring-pink-400 outline-none"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>

        {/* Filters & Sorting */}
        <div className="bg-black/50 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-pink-500/30">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex flex-col sm:flex-row gap-6 flex-1">
              <div>
                <label className="block text-pink-300 text-sm mb-2">Filter:</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 bg-black/50 border border-pink-500/40 rounded-lg text-white focus:ring-2 focus:ring-pink-400"
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                  <option value="today">Due Today</option>
                </select>
              </div>
              <div>
                <label className="block text-pink-300 text-sm mb-2">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-black/50 border border-pink-500/40 rounded-lg text-white focus:ring-2 focus:ring-pink-400"
                >
                  <option value="created">Date Created</option>
                  <option value="dueDate">Due Date</option>
                  <option value="description">Description</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
            <div className="text-pink-300 text-sm">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-black/50 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-pink-500/30">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Your Tasks</h2>
            {tasks.length > 0 && (
              <div className="text-sm text-pink-300">
                {filteredTasks.length} of {tasks.length} tasks shown
              </div>
            )}
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-pink-300">
              {tasks.length === 0 ? 'No tasks yet — create your first task above!' : 'No tasks match your filter.'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className={`bg-black/50 border rounded-lg p-4 transition hover:border-pink-400/50 ${
                    task.isCompleted
                      ? 'border-green-500/40 bg-green-900/20'
                      : isOverdue(task.dueDate)
                      ? 'border-red-500/40 bg-red-900/20'
                      : isDueToday(task.dueDate)
                      ? 'border-yellow-500/40 bg-yellow-900/20'
                      : 'border-pink-500/30'
                  }`}
                >
                  {editingTask === task._id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full px-3 py-2 bg-black/50 border border-pink-500/40 rounded text-white focus:ring-2 focus:ring-pink-400"
                        autoFocus
                      />
                      <input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        className="px-3 py-2 bg-black/50 border border-pink-500/40 rounded text-white focus:ring-2 focus:ring-pink-400"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditTask(task._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <p className={`text-lg ${task.isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>
                          {task.description}
                        </p>
                        <div className="flex gap-4 mt-2 text-sm flex-wrap text-pink-300">
                          <p>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                          {task.dueDate && (
                            <p className={`${
                              isOverdue(task.dueDate) && !task.isCompleted
                                ? 'text-red-400'
                                : isDueToday(task.dueDate)
                                ? 'text-yellow-400'
                                : 'text-pink-300'
                            }`}>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            task.isCompleted ? 'bg-green-600/30 text-green-200' : 'bg-pink-600/30 text-pink-200'
                          }`}>
                            {task.isCompleted ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(task)}
                          className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="bg-black/50 backdrop-blur-lg rounded-2xl shadow-xl p-6 mt-8 border border-pink-500/30">
          <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-pink-300 text-sm mb-1">Name</label>
              <p className="bg-black/50 px-3 py-2 rounded border border-pink-500/30 text-white">{user?.name}</p>
            </div>
            <div>
              <label className="block text-pink-300 text-sm mb-1">Email</label>
              <p className="bg-black/50 px-3 py-2 rounded border border-pink-500/30 text-white">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
