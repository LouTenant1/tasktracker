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
  const [statusFilter, setStatusFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");

  useEffect(() => {
    logCurrentTasksState();
  }, [tasks, statusFilter, assigneeFilter]); // Calls logCurrentTasksState on tasks or filters change

  const handleTaskAddition = (task: Task) => {
    setTasks((currentTasks) => [...currentTasks, task]);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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

    handleTaskAddition(newTask);
    event.currentTarget.reset();
  };

  const logCurrentTasksState = () => {
    console.log("Current Tasks:", tasks);
    console.log("Current Status Filter:", statusFilter);
    console.log("Current Assignee Filter:", assigneeFilter);
  };

  const applyFiltersToTasks = (tasks: Task[], statusFilter: string, assigneeFilter: string) => {
    return tasks.filter(task => {
      const isStatusMatching = task.status === statusFilter || statusFilter === "";
      const isAssigneeMatching = task.assignee === assigneeFilter || assigneeFilter === "";
      return isStatusMatching && isAssigneeMatching;
    });
  };

  const displayedTasks = applyFiltersToTasks(tasks, statusFilter, assigneeFilter);

  return (
    <div>
      <h1>Task Dashboard</h1>
      <form onSubmit={handleFormSubmit}>
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
      <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
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
        {displayedTasks.map((task) => (
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