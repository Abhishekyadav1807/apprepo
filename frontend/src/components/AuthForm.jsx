import { useState } from 'react';

export default function AuthForm ({ mode, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, password });
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
      {mode === 'register' && (
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
      )}
      <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
    </form>
  );
}
