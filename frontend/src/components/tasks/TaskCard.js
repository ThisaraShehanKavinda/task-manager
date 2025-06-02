import {
  FaCalendarAlt, // FlagIcon
  FaEdit, // CalendarIcon
  FaFlag, // PencilIcon
  FaTrash // TrashIcon
} from 'react-icons/fa';

import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './TaskCard.css';

const priorityColors = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981'
};

const statusColors = {
  pending: '#64748b',
  'in-progress': '#3b82f6',
  completed: '#10b981'
};

const TaskCard = ({ task, onDelete }) => {
  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${task._id}`);
      toast.success('Task deleted successfully');
      onDelete(task._id);
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-actions">
          <Link to={`/tasks/${task._id}/edit`} className="action-button edit">
            <FaEdit className="action-icon" />
          </Link>
          <button onClick={handleDelete} className="action-button delete">
            <FaTrash className="action-icon" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <div className="meta-item">
          <FaFlag 
            className="meta-icon" 
            style={{ color: priorityColors[task.priority] }} 
          />
          <span className="meta-text" style={{ color: priorityColors[task.priority] }}>
            {task.priority}
          </span>
        </div>

        <div className="meta-item">
          <div 
            className="status-badge"
            style={{ backgroundColor: statusColors[task.status] }}
          >
            {task.status.replace('-', ' ')}
          </div>
        </div>

        {task.dueDate && (
          <div className="meta-item">
            <FaCalendarAlt className="meta-icon" />
            <span className="meta-text">{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;