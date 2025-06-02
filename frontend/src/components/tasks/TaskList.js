import { ArrowDownIcon, ArrowUpIcon, PlusIcon } from '@heroicons/react/24/outline';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';
import TaskCard from './TaskCard';
import './TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(response.data);
      } catch (err) {
        setError('Failed to fetch tasks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchTasks();
  }, [user]);

  const sortedTasks = React.useMemo(() => {
    let sortableTasks = [...tasks];
    if (sortConfig.key) {
      sortableTasks.sort((a, b) => {
        if (sortConfig.key === 'priority') {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          const aPriority = priorityOrder[a.priority];
          const bPriority = priorityOrder[b.priority];
          return sortConfig.direction === 'asc' 
            ? aPriority - bPriority 
            : bPriority - aPriority;
        } else {
          const aValue = new Date(a[sortConfig.key]);
          const bValue = new Date(b[sortConfig.key]);
          return sortConfig.direction === 'asc' 
            ? aValue - bValue 
            : bValue - aValue;
        }
      });
    }
    return sortableTasks;
  }, [tasks, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' 
      ? <ArrowUpIcon className="sort-icon" /> 
      : <ArrowDownIcon className="sort-icon" />;
  };

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h1>My Tasks</h1>
        <button 
          onClick={() => navigate('/tasks/new')} 
          className="add-task-button"
        >
          <PlusIcon className="button-icon" />
          Add Task
        </button>
      </div>

      <div className="sort-controls">
        <button 
          onClick={() => requestSort('priority')}
          className={`sort-button ${sortConfig.key === 'priority' ? 'active' : ''}`}
        >
          Priority {getSortIcon('priority')}
        </button>
        <button 
          onClick={() => requestSort('dueDate')}
          className={`sort-button ${sortConfig.key === 'dueDate' ? 'active' : ''}`}
        >
          Due Date {getSortIcon('dueDate')}
        </button>
      </div>

      <div className="tasks-grid">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <TaskCard key={task._id} task={task} />
          ))
        ) : (
          <div className="empty-state">
            <p>No tasks found. Create your first task!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;