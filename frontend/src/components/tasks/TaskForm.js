import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './TaskForm.css';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    
    setValue
  } = useForm();

  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        setIsLoading(true);
        try {
          const response = await api.get(`/tasks/${id}`);
          const task = response.data;
          setValue('title', task.title);
          setValue('description', task.description);
          setValue('priority', task.priority);
          setValue('status', task.status);
          setValue('dueDate', task.dueDate?.split('T')[0]);
        } catch (error) {
          toast.error('Failed to load task');
          navigate('/');
        } finally {
          setIsLoading(false);
        }
      };
      fetchTask();
    }
  }, [id, navigate, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (id) {
        await api.put(`/tasks/${id}`, data);
        toast.success('Task updated successfully');
      } else {
        await api.post('/tasks', data);
        toast.success('Task created successfully');
      }
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="loading-spinner"></div>;

  return (
    <div className="task-form-container">
      <div className="form-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft className="back-icon" />
          Back
        </button>
        <h2>{id ? 'Edit Task' : 'Create New Task'}</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="task-form">
        <div className="form-group">
          <label>Title*</label>
          <input
            type="text"
            placeholder="Enter task title"
            {...register('title', { required: 'Title is required' })}
            className={errors.title ? 'input-error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title.message}</span>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            rows="4"
            placeholder="Enter task description"
            {...register('description')}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Priority*</label>
            <select
              {...register('priority', { required: 'Priority is required' })}
              className={errors.priority ? 'input-error' : ''}
            >
              <option value="">Select priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && <span className="error-message">{errors.priority.message}</span>}
          </div>

          <div className="form-group">
            <label>Status*</label>
            <select
              {...register('status', { required: 'Status is required' })}
              className={errors.status ? 'input-error' : ''}
            >
              <option value="">Select status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status && <span className="error-message">{errors.status.message}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            {...register('dueDate')}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;