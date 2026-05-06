import { useState } from 'react';

export default function TaskForm ({ onCreate }) {
  const [title, setTitle] = useState('');
  const [inputText, setInputText] = useState('');
  const [operation, setOperation] = useState('uppercase');

  const submit = (e) => {
    e.preventDefault();
    onCreate({ title, inputText, operation });
    setTitle('');
    setInputText('');
    setOperation('uppercase');
  };

  return (
    <form className="card" onSubmit={submit}>
      <h3>Create AI Task</h3>
      <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
      <label>Input text<textarea value={inputText} onChange={(e) => setInputText(e.target.value)} required rows="4" /></label>
      <label>Operation
        <select value={operation} onChange={(e) => setOperation(e.target.value)}>
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="reverse">Reverse string</option>
          <option value="word_count">Word count</option>
        </select>
      </label>
      <button type="submit">Create</button>
    </form>
  );
}
