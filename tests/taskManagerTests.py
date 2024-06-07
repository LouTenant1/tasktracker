import os
import unittest
from task_manager import TaskManager
from notification_service import NotificationService

class TaskManagementTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.task_manager = TaskManager(os.getenv("DB_HOST"), os.getenv("DB_USER"), os.getenv("DB_PASSWORD"))
        cls.notification_service = NotificationService(os.getenv("EMAIL_HOST"), os.getenv("EMAIL_PORT"))

    def test_create_task(self):
        title = "Test Task"
        description = "This is a test task."
        task = self.task_manager.create_task(title, description)
        self.assertIsNotNone(task, "Task should be created")
        self.assertEqual(task.title, title, "Task title should match")
        self.assertEqual(task.description, description, "Task description should match")

    def test_update_task(self):
        original_title = "Original Task"
        updated_title = "Updated Task"
        task = self.task_manager.create_task(original_title, "Task description")
        updated_task = self.task_manager.update_task(task.id, updated_title, task.description)
        self.assertEqual(updated_task.title, updated_title, "Task title should be updated")

    def test_retrieve_task(self):
        title = "Retrieval Task"
        self.task_manager.create_task(title, "Task to retrieve")
        retrieved_task = self.task_manager.get_task_by_title(title)
        self.assertIsNotNone(retrieved_task, "Task should be retrieved")
        self.assertEqual(retrieved_task.title, title, "Retrieved task title should match the created task")

    def test_notification_sending(self):
        email = os.getenv("TEST_EMAIL")
        message = "This is a test notification"
        result = self.notification_service.send_email(email, message)
        self.assertTrue(result, "Notification should be sent successfully")

if __name__ == '__main__':
    unittest.main()