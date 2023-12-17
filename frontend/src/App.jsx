import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState(null);
  const [newTodo,setNewTodo] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const request = await fetch("http://localhost:3000/todos");
        const response = await request.json();
        setTodos(response);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  const createTodo = async (todoTitle) => {
    try {
     const response = await fetch('http://localhost:3000/todos', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         title: todoTitle,
         done: false,
       }),
     });
     window.location.reload(false);
     if (!response.ok) {
       throw new Error(`Failed to create todo: ${response.statusText}`);
     }

     const responseData = await response.json();
     console.log('Todo created:', responseData);
  } catch (error) {
    console.error('Error creating todo:', error);
  }
  };
  const handleDone = async (id) => {
    await fetch(`http://localhost:3000/todos/${id}/finish`, {
        method: 'POST',
      });
    window.location.reload(false);
  };

  return (
    <>
      <div className="pt-24 pb-20">
      <div className="max-w-md mx-auto bg-white rounded-md shadow-md flex outline outline-2 outline-gray-300">
          <input
            placeholder="Create a New Note..."
            type="text"
            id="input"
            name="input"
            className="mt-1 p-3 block w-full rounded-md"
            onChange={(e)=> setNewTodo(e.target.value)}
          />
          <button className="outline outline-2 outline-gray-300 rounded-r-md px-4" onClick={() =>createTodo(newTodo)}>create</button>
          </div>
        </div>
      <div className="bg-white max-w-md mx-auto rounded-md shadow-md">
        {todos &&
          todos.map((todo) => (
            <div className="text-black flex justify-center" key={todo.id}>
              <p className={`text-2xl flex justify-center py-1 px-4 ${todo.done ? 'line-through' : ''}`}>
                {todo.title}
              </p>
              <p className={`flex justify-center py-1 ${todo.done ? 'line-through' : ''}`}>
                {todo.description}
              </p>
              <div className="flex justify-center">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => handleDone(todo.ID)}
                />
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default App;
