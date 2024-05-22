import React, { useState, useEffect } from "react";

type Task = {
  id: string;
  title: string;
  description: string;
  priority: string;
  deadline: Date;
  assignee: string;
  status: "To Do" | "In Progress" | "Done";
};

const TaskDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { title, description, priority, deadline, assignee } = event.currentTarget.elements as typeof event.currentTarget.elements & {
      title: HTMLInputElement,
      description: HTMLInputElement,
      priority: HTMLSelectElement,
      deadline: HTMLInputElement,
      assignee: HTMLInputElement
    };
    const newTask: Task = {
      id: new Date().toISOString(),
      title: title.value,
      description: description.value,
      priority: priority.value,
      deadline: new Date(deadline.value),
      assignee: assignee.value,
      status: "To Do",
    };
    addTask(newTask);
    event.currentTarget.reset();
  };

  const filterTasks = (tasks: Task[], filter: string, assigneeFilter: string) => {
    return tasks.filter(task => {
      const statusMatch = task.status === filter || filter === "";
      const assigneeMatch = task.assignee === assigneeFilter || assigneeFilter === "";
      return statusMatch && assigneeMatch;
    });
  };

  const filteredTasks = filterTasks(tasks, filter, assigneeFilter);

  return (
    <div>
      <h1>Task Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" required />
        <input name="description" placeholder="Description" required />
        <select name="priority" required>
          <option value="">Select Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input name="deadline" type="date" required />
        <input name="assignee" placeholder="Assignee" required />
        <button type="submit">Add Task</button>
      </form>
      <br />
      <select onChange={(e) => setFilter(e.target.value)} value={filter}>
        <option value="">Filter by Status</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <input
        placeholder="Filter by Assignee"
        onChange={(e) => setAssigneeFilter(e.target.value)}
        value={assigneeFilter}
      />
      <div>
        {filteredTasks.map((task) => (
          <div key={task.id}>
            <h2>{task.title}</h2>
            <p>Description: {task.description}</p>
            <p>Priority: {task.priority}</p>
            <p>Deadline: {task.deadline.toDateString()}</p>
            <p>Assignee: {task.assignee}</p>
            <p>Status: {task.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskDashboard;