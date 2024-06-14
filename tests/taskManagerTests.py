import os
import unittest
from task_manager import TaskManager
from notification_service import NotificationService
from functools import lru_cache

class TaskManager:
    def __init__(self, database_host, database_user, database_password):
        self.database_host = database_host
        self.database_user = database_user
        self.database_password = database_password

    @lru_cache(maxsize=128)
    def fetch_task_by_title(self, title):
        print(f"Fetching task for title: {title}")
        return None

class TaskManagementSystemTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.taskManagerInstance = TaskManager(os.getenv("DB_HOST"), os.getenv("DB_USER"), os.getenv("DB_PASSWORD"))
        cls.notificationServiceInstance = Notification,Service(os.getenv("EMAIL_HOST"), os.getenv("EMAIL_PORT"))

    def test_task_creation(self):
        taskTitle, taskDescription = "Test Task", "This is an example task description."
        createdTask = self.taskManagerInstance.create_task(taskTitle, taskDescription)
        self.assertIsNotNone(createdTask, "Task creation should return a task object")
        self.assertEqual(createdTask.title, taskTitle, "The created task's title should match the input")
        self.assertEqual(createdTask.description, taskDescription, "The created task's description should match the input")

if __name__ == '__main__':
    unittest.main()