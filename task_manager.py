import os
from datetime import datetime
import json

TASKS_DATABASE_PATH = os.getenv('TASK_DATABASE_FILE', 'tasks_db.json')

def load_all_tasks():
    try:
        with open(TASKS_DATABASE_PATH, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def save_all_tasks(tasks):
    with open(TASKS_DATABASE_PATH, 'w') as file:
        json.dump(tasks, file, indent=4)

def create_new_task(title, description, due_date, dependencies=[], tags=[]):
    tasks = load_all_tasks()
    task = {
        'id': max([task['id'] for task in tasks] or [0]) + 1,
        'title': title,
        'description': description,
        'due_date': due_date,
        'dependencies': dependencies,
        'tags': tags,
        'created_at': datetime.now().isoformat(),
        'status': 'pending'
    }
    tasks.append(task)
    save_all_tasks(tasks)
    return task

def update_existing_task(task_id, **updates):
    tasks = load_all_tasks()
    task = next((task for task in tasks if task['id'] == task_id), None)
    if task:
        for key, value in updates.items():
            if key == "tags":
                task['tags'] = list(set(task.get('tags', []) + value))
            else:
                task[key] = value
        save_all_tasks(tasks)
        return task
    return None

def remove_task(task_id):
    tasks = load_all_tasks()
    tasks = [task for task in tasks if task['id'] != task_id]
    save_all_tasks(tasks)

def retrieve_task(task_id):
    tasks = load_all_tasks()
    return next((task for task in tasks if task['id'] == task_id), None)

def list_all_tasks(status_filter=None, tags_filter=None):
    tasks = load_all_tasks()
    if status_filter:
        tasks = [task for task in tasks if task['status'] == status_filter]
    if tags_filter:
        tasks = [task for task in tasks if set(tags_filter).issubset(set(task.get('tags', [])))]
    return tasks

def search_tasks_by_query(query):
    tasks = load_all_tasks()
    return [task for task in tasks if query.lower() in task['title'].lower() or query.lower() in task['description'].lower()]

def assign_status_to_task(task_id, new_status):
    return update_existing_task(task_id, status=new_status)

def verify_task_dependencies(task_url):
    task = retrieve_task(task_url)
    if task:
        dependencies = task.get('dependencies', [])
        tasks = load_all_tasks()
        for dependency_id in dependencies:
            dependency_task = next((t for t in tasks if t['id'] == dependency_id), None)
            if not dependency_task or dependency_task['status'] != 'completed':
                return False
        return True
    return False

if __name__ == "__main__":
    print("Creating a task with tags")
    created_task = create_new_task('Test Task', 'This is a test task.', '2023-12-31', tags=['work', 'urgent'])
    print(f"Task created with tags: {created_task}")

    print("\nListing all tasks")
    tasks = list_all_tasks()
    for task in tasks:
        print(task)

    print("\nListing tasks filtered by a tag 'urgent'")
    urgent_tasks = list_all_tasks(tags_filter=['urgent'])
    for task in urgent_tasks:
        print(task)

    print("\nUpdating a task to add a new tag")
    updated_task = update_existing_task(created_task['id'], title='Updated Task Title', tags=['important'])  
    print(f"Task updated with new tags: {updated_task}")

    print("\nDeleting a task")
    remove_task(created_task['id'])
    print(f"Task with id {created_task['id']} deleted")