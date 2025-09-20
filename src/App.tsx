import './App.scss';
import { useState } from 'react';
import usersFromServer from './api/users';
import todosFromServer from './api/todos';

export const App = () => {
  const [todos, setTodos] = useState<Todo[]>(todosFromServer);
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState(0);
  const [titleError, setTitleError] = useState('');
  const [userError, setUserError] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newTitle = e.target.value;

    newTitle = newTitle.replace(/[^a-zA-Zа-яА-ЯіІїЇєЄ0-9\s]/g, '');

    setTitle(newTitle);

    if (titleError) {
      setTitleError('');
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUserId = Number(e.target.value);

    setUserId(newUserId);

    if (userError) {
      setUserError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;

    if (!title.trim()) {
      setTitleError('Please enter a title');
      isValid = false;
    }

    if (!userId) {
      setUserError('Please choose a user');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const selectedUser = usersFromServer.find(user => user.id === userId);

    if (!selectedUser) {
      return;
    }

    const newId = Math.max(0, ...todos.map(todo => todo.id)) + 1;

    const newTodo: Todo = {
      id: newId,
      title: title.trim(),
      userId,
      completed: false,
      user: selectedUser,
    };

    setTodos(prevTodos => [...prevTodos, newTodo]);

    // Clear form
    setTitle('');
    setUserId(0);
    setTitleError('');
    setUserError('');
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <input
            type="text"
            data-cy="titleInput"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter todo title"
          />
          {titleError && (
            <span className="error" data-cy="errorMessage">
              {titleError}
            </span>
          )}
        </div>

        <div className="field">
          <select
            data-cy="userSelect"
            value={userId}
            onChange={handleUserChange}
          >
            <option value={0} disabled>
              Choose a user
            </option>
            {usersFromServer.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          {userError && (
            <span className="error" data-cy="errorMessage">
              {userError}
            </span>
          )}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <section className="TodoList">
        {todos.map(todo => (
          <article
            key={todo.id}
            data-id={todo.id}
            className={`TodoInfo ${todo.completed ? 'TodoInfo--completed' : ''}`}
          >
            <h2 className="TodoInfo__title">{todo.title}</h2>

            {todo.user && (
              <a className="UserInfo" href={`mailto:${todo.user.email}`}>
                {todo.user.name}
              </a>
            )}
          </article>
        ))}
      </section>
    </div>
  );
};
