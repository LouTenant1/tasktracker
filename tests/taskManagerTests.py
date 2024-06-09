import os
import unittest
from task_manager import TaskManager
from notification_service import NotificationService

class TaskManagementTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.task_manager = TaskManager(os.getenv("DB_HOST"), os.getenv("DB_USER"), os.getenv("DB_PASSWORD"))
        cls.notification_service = NotificationService(os.getenv("EMAIL_HOST"), os.getenv("EMAIL_PORT"))

    @classmethod
    def tearDownClass(cls):
        pass

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_create_task(self):
        title, description = "Test Task", "This is a test task."
        task = self.task_manager.create_task(title, description)
        self.assertIsNotNone(task, "Task should be created")
        self.assertEqual(task.title, title, "Task title should match")
        self.assertEqual(task.description, description, "Task description should match")


if __name__ == '__main__':
    unittest.main()