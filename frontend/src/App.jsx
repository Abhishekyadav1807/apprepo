import { useEffect, useState } from 'react';
import api from './api';
import AuthForm from './components/AuthForm';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

export default function App () {
  const [mode, setMode] = useState('login');
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');

  const fetchTasks = async () => {
    const { data } = await api.get('/tasks');
    setTasks(data);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      fetchTasks().catch(() => setMessage('Failed to load tasks'));
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => fetchTasks().catch(() => {}), 4000);
    return () => clearInterval(id);
  }, [user]);

  const authSubmit = async (payload) => {
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register';
      const { data } = await api.post(path, payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setMessage('Authenticated successfully');
      await fetchTasks();
    } catch (e) {
      setMessage(e.response?.data?.message || 'Authentication failed');
    }
  };

  const createTask = async (payload) => {
    try {
      await api.post('/tasks', payload);
      setMessage('Task created');
      await fetchTasks();
    } catch (e) {
      setMessage(e.response?.data?.message || 'Failed to create task');
    }
  };

  const runTask = async (id) => {
    try {
      await api.post(`/tasks/${id}/run`);
      setMessage('Task queued');
      await fetchTasks();
    } catch (e) {
      setMessage(e.response?.data?.message || 'Failed to run task');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTasks([]);
  };

  return (
    <main className="app-shell">
      <header>
        <h1>AI Task Processing Platform</h1>
        {user && <button onClick={logout}>Logout</button>}
      </header>
      {message && <p className="message">{message}</p>}
      {!user
        ? (
          <section className="auth-wrap">
            <AuthForm mode={mode} onSubmit={authSubmit} />
            <button className="ghost" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Need an account? Register' : 'Already registered? Login'}
            </button>
          </section>
          )
        : (
          <section className="dashboard">
            <TaskForm onCreate={createTask} />
            <TaskList tasks={tasks} onRun={runTask} />
          </section>
          )}
    </main>
  );
}
