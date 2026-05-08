import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("medium");

    async function fetchTasks() {
        const res = await fetch(`${API}/tasks`);
        const data = await res.json();
        setTasks(data.reverse());
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    async function addTask() {
        if (!title.trim()) return;

        await fetch(`${API}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                priority,
            }),
        });

        setTitle("");
        fetchTasks();
    }

    async function toggleTask(id) {
        await fetch(`${API}/tasks/${id}`, {
            method: "PUT",
        });

        fetchTasks();
    }

    async function deleteTask(id) {
        await fetch(`${API}/tasks/${id}`, {
            method: "DELETE",
        });

        fetchTasks();
    }

    const completed = tasks.filter(t => t.completed).length;
    const progress = tasks.length
        ? Math.round((completed / tasks.length) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-[#0d0f14] text-white p-6">
            <div className="max-w-2xl mx-auto">

                <h1 className="text-4xl font-bold mb-6 text-purple-400">
                    TaskBoard
                </h1>

                {/* Progress */}
                <div className="bg-[#141720] p-4 rounded-xl mb-4">
                    <div className="flex justify-between mb-2">
                        <span>{completed} / {tasks.length} completed</span>
                        <span>{progress}%</span>
                    </div>

                    <div className="w-full bg-gray-700 h-3 rounded-full">
                        <div
                            className="bg-purple-500 h-3 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Input */}
                <div className="bg-[#141720] p-4 rounded-xl mb-6">
                    <div className="flex gap-2">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task..."
                            className="flex-1 p-3 rounded-lg bg-[#1c2030]"
                        />

                        <button
                            onClick={addTask}
                            className="bg-purple-500 px-5 rounded-lg"
                        >
                            Add
                        </button>
                    </div>

                    <div className="flex gap-2 mt-3">
                        {["high", "medium", "low"].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPriority(p)}
                                className={`px-3 py-1 rounded-lg border ${priority === p
                                        ? "border-purple-500 text-purple-400"
                                        : "border-gray-700"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tasks */}
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`bg-[#141720] p-4 rounded-xl flex items-center justify-between ${task.completed ? "opacity-50" : ""
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTask(task.id)}
                                />

                                <div>
                                    <h3
                                        className={`font-medium ${task.completed ? "line-through" : ""
                                            }`}
                                    >
                                        {task.title}
                                    </h3>

                                    <span className="text-sm text-gray-400">
                                        {task.priority}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => deleteTask(task.id)}
                                className="text-red-400"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}