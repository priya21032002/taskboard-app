from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from uuid import uuid4

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FILE = "tasks.json"

# Create file if not exists
if not os.path.exists(FILE):
    with open(FILE, "w") as f:
        json.dump([], f)

def load_tasks():
    with open(FILE, "r") as f:
        return json.load(f)

def save_tasks(tasks):
    with open(FILE, "w") as f:
        json.dump(tasks, f, indent=2)

class Task(BaseModel):
    title: str
    priority: str = "medium"

@app.get("/tasks")
def get_tasks():
    return load_tasks()

@app.post("/tasks")
def add_task(task: Task):
    tasks = load_tasks()

    new_task = {
        "id": str(uuid4()),
        "title": task.title,
        "priority": task.priority,
        "completed": False
    }

    tasks.append(new_task)
    save_tasks(tasks)

    return new_task

@app.put("/tasks/{task_id}")
def toggle_task(task_id: str):
    tasks = load_tasks()

    for task in tasks:
        if task["id"] == task_id:
            task["completed"] = not task["completed"]

    save_tasks(tasks)

    return {"message": "Task updated"}

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    tasks = load_tasks()

    tasks = [task for task in tasks if task["id"] != task_id]

    save_tasks(tasks)

    return {"message": "Task deleted"}