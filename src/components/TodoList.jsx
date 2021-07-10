import React, { useEffect, useState } from "react"
import TodoItem from "./TodoItem"
import TodoInput from "./TodoInput"

const TodoList = () => {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos")

      if (!response.ok) return

      const todos = await response.json()

      console.log("todos", todos)

      setTodos(todos.reverse())
    }

    fetchTodos()
  }, [])

  const handleToggole = async ({ id, checked }) => {
    // Optimistic update
    const clonedTodos = JSON.parse(JSON.stringify(todos))

    const tempTodos = clonedTodos.map((t) =>
      t.id === id ? { ...t, completed: checked } : t
    )
    setTodos(tempTodos)

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: checked }),
      }
    )

    if (response.ok) return

    setTodos(clonedTodos)
  }

  const handleDelete = async (id) => {
    // Optiomistic update
    const clonedTodos = JSON.parse(JSON.stringify(todos))

    const tempTodos = clonedTodos.filter((t) => t.id !== id)

    setTodos(tempTodos)

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      {
        method: "DELETE",
      }
    )

    if (response.ok) return

    setTodos(clonedTodos)
  }

  const handleAddTask = async (value) => {
    // Optiomistic update
    const clonedTodos = JSON.parse(JSON.stringify(todos))

    const tempId = Date.now()
    const tempTodos = [
      { id: tempId, title: value, completed: false },
      ...clonedTodos,
    ]

    setTodos(tempTodos)

    const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: value, completed: false }),
    })

    console.log("response", response)
    if (response.ok) {
      const todo = await response.json()

      setTodos(tempTodos.map((t) => (t.id === tempId ? todo : t)))
      return
    }

    setTodos(clonedTodos)
  }

  return (
    <div className="mt-6">
      <TodoInput onAddTask={handleAddTask} />

      {todos.map(({ id, title, completed }, index) => (
        <TodoItem
          key={index}
          id={id}
          title={title}
          completed={completed}
          onToggle={handleToggole}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}

export default TodoList