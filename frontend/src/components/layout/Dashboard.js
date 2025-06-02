import TaskList from '../tasks/TaskList';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
     
      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Task Dashboard</h1>
          <p>Manage all your tasks in one place</p>
        </div>
        <div className="dashboard-main">
          <TaskList />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;