import {useEffect, useState} from 'react'
import './App.css'

function App() {

    const [list, setList] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/api/todos')
            .then((res) => res.json())
            .then((data) => setList(data))
    }, []);

    const addTodo = async (todo: string) => {
        await fetch('http://localhost:3000/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({content: todo})
        })
            .then(async () => await fetch('http://localhost:3000/api/todos')
                .then((res) => res.json())
                .then((data) => setList(data)));

        setInput("");
    };

    const patchTodo = async (id: string) => {
        await fetch(`http://localhost:3000/api/todos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((res) => res.json());
    }

    const deleteTodo = async (id: string) => {
        await fetch(`http://localhost:3000/api/todos/${id}`, {method: 'DELETE'})
            .then((res) => res.json())
            .then(() => setList(list.filter((todo) => todo['id'] !== id)));
    }

    return (
        <div>
            <h1> Todo list: </h1>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={() => addTodo(input)}>Add</button>
            <ul>
                {list.map(todo => (
                    <li className="todolist" key={todo['id']}>
                        {todo['content']}
                        <input type='checkbox' onClick={() => patchTodo(todo['id'])}/>
                        <button onClick={() => deleteTodo(todo['id'])}>&times;</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App
