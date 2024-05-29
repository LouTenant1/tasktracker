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
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");

  useEffect(() => {
    console.log("Current Tasks:", taskList);
    console.log("Current Status Filter:", filterStatus);
    console.log("Current Assignee Filter:", filterAssignee);
  }, [taskList, filterStatus, filterAssignee]);

  const addTaskToList = (task: Task) => setTaskList((currentTasks) => [...currentTasks, task]);

  const handleNewTaskSubmission = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const { title, description, priority, deadline, assignee } = form.elements;

    const taskToAdd: Task = {
      id: new Date().toISOString(),
      title: (title as HTMLInputElement).value,
      description: (description as HTMLInputElement).value,
      priority: (priority as HTMLSelectElement).value,
      deadline: new Date((deadline as HTMLInputElement).value),
      assignee: (assignee as HTMLInputElement).value,
      status: "To Do",
    };

    addTaskToList(taskToAdd);
    form.reset();
  };

  const filterTasks = (allTasks: Task[]) => allTasks.filter(task =>
    (task.status === filterStatus || filterStatus === "") &&
    (task.assignee === filterAssignee || filterAssignee === "")
  );

  const tasksToDisplay = filterTasks(taskList);

  return (
    <div>
      <h1>Task Dashboard</h1>
      <form onSubmit={handleNewTaskSubmission}>
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
      <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
        <option value="">Filter by Status</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <input
        placeholder="Filter by Assignee"
        onChange={(e) => setFilterAssignee(e.target.value)}
        value={filterAssignee}
      />
      <div>
        {tasksToDisplay.map((task) => (
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