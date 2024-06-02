import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const taskCache = useRef<Map<string, Task[]>>(new Map());

  const fetchTasks = useCallback(async () => {
    const cacheKey = `tasks`;
    const cachedTasks = taskCache.current.get(cacheKey);
    
    if (cachedTasks) {
      setTasks(cachedTasks);
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/tasks`);
      setTasks(response.data);
      taskCache.current.set(cacheKey, response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (title: string) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks`, { title, completed: false });
      setTasks(prevTasks => {
        const updatedTasks = [...prevTasks, response.data];
        taskCache.current.set('tasks', updatedTasks); // Update cache after adding a new task
        return updatedTasks;
      });
    } catch (err) {
      setError('Failed to add task');
    }
  }, []);

  const updateTaskStatus = useCallback(async (id: number, completed: boolean) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/tasks/${id}`, { completed });
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task => (task.id === id ? { ...task, completed } : task));
        taskCache.current.set('tasks', updatedTasks); // Update cache after changing task status
        return updatedTasks;
      });
    } catch (err) {
      setError('Failed to update task status');
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, addTask, updateTaskStatus };
};

export default useTasks;