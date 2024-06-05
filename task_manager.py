import os
from datetime import datetime
import json

DATABASE_FILE = os.getenv('TASK_DATABASE_FILE', 'tasks_db.json')

def load_tasks():
    try:
        with open(DATABASE_FILE, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def save_tasks(tasks):
    with open(DATABASE_FILE, 'w') as file:
        json.dump(tasks, file, indent=4)

def create_task(title, description, due_date, dependencies=[]):
    tasks = load_tasks()
    task = {
        'id': max([task['id'] for task in tasks] or [0]) + 1,
        'title': title,
        'description': description,
        'due_date': due_date,
        'dependencies': dependencies,
        'created_at': datetime.now().isoformat(),
        'status': 'pending'
    }
    tasks.append(task)
    save_tasks(tasks)
    return task

def update_task(task_id, **updates):
    tasks = load_tasks()
    task = next((task for task in tasks if task['id'] == task_id), None)
    if task:
        task.update(updates)
        save_tasks(tasks)
        return task
    return None

def delete_task(task_id):
    tasks = load_tasks()
    tasks = [task for task in tasks if task['id'] != task_id]
    save_tasks(tasks)

def get_task(task_id):
    tasks = load_tasks()
    return next((task for task in tasks if task['id'] == task_id), None)

def list_tasks(filter_by_status=None):
    tasks = load_tasks()
    if filter_by_status:
        tasks = [task for task in tasks if task['status'] == filter_by_status]
    return tasks

def search_tasks(query):
    tasks = load_tasks()
    return [task for task in tasks if query.lower() in task['title'].lower() or query.lower() in task['description'].lower()]

def set_task_status(task_id, status):
    return update_task(task_id, status=status)

def check_tasks_dependencies(task_id):
    task = get_task(task_id)
    if task:
        dependencies = task.get('dependencies', [])
        tasks = load_tasks()
        for dependency_id in dependencies:
            dependency_task = next((t for t in tasks if t['id'] == dependency_id), None)
            if not dependency_task or dependency_task['status'] != 'completed':
                return False
        return True
    return False

if __name__ == "__main__":
    print("Creating a task")
    created_task = create_task('Test Task', 'This is a test task.', '2023-12-31')
    print(f"Task created: {created_task}")

    print("\nListing all tasks")
    tasks = list_tasks()
    for task in tasks:
        print(task)

    print("\nUpdating a task")
    updated_task = update_task(created_task['id'], title='Updated Task Title')
    print(f"Task updated: {updated_task}")

    print("\nDeleting a task")
    delete_task(created_task['id'])
    print(f"Task with id {created_task['id']} deleted")