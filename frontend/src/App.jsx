import { useEffect, useState } from "react";

const API = "https://taskboard-app-production-d8a0.up.railway.app";

const PRIORITY = {
    high: { color: "#ff4757", label: "🔴 High" },
    medium: { color: "#ffa502", label: "🟡 Medium" },
    low: { color: "#2ed573", label: "🟢 Low" },
};

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("medium");
    const [filter, setFilter] = useState("all");

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

    const filteredTasks = tasks.filter((task) => {
        if (filter === "active") return !task.completed;
        if (filter === "done") return task.completed;
        return true;
    });

    const completed = tasks.filter((t) => t.completed).length;
    const progress = tasks.length
        ? Math.round((completed / tasks.length) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-[#0d0f14] text-white relative overflow-hidden px-4 py-8">

            {/* Background Orbs */}
            <div className="fixed w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 bg-purple-500 top-[-150px] right-[-100px]" />
            <div className="fixed w-[400px] h-[400px] rounded-full blur-[120px] opacity-10 bg-pink-500 bottom-[-100px] left-[-80px]" />

            <div className="max-w-2xl mx-auto relative z-10">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">

                    <div className="flex items-center gap-3">
                        <div className="text-4xl text-purple-500">◈</div>

                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-500 bg-clip-text text-transparent">
                                TaskBoard
                            </h1>

                            <p className="text-gray-400 uppercase tracking-widest text-xs">
                                Stay in the flow
                            </p>
                        </div>
                    </div>

                    <button className="bg-[#1c2030] border border-[#262c3d] px-4 py-2 rounded-xl hover:bg-[#262c3d] transition">
                        ⚡
                    </button>
                </div>

                {/* Progress */}
                <div className="bg-[#141720] border border-[#262c3d] rounded-2xl p-5 mb-4 shadow-[0_0_20px_rgba(168,85,247,0.15)]">

                    <div className="flex justify-between mb-3">
                        <span className="text-gray-400 text-sm">
                            {completed} of {tasks.length} tasks complete
                        </span>

                        <span className="text-purple-400 text-2xl font-bold">
                            {progress}%
                        </span>
                    </div>

                    <div className="h-2 bg-[#1c2030] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {progress === 100 && tasks.length > 0 && (
                        <p className="text-green-400 text-sm mt-3 text-center">
                            🎉 All tasks completed
                        </p>
                    )}
                </div>

                {/* Input Card */}
                <div className="bg-[#141720] border border-[#262c3d] rounded-2xl p-5 mb-4 shadow-[0_0_20px_rgba(168,85,247,0.15)]">

                    <div className="flex gap-3 mb-4">

                        <input
                            type="text"
                            placeholder="What needs to be done?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addTask()}
                            className="flex-1 bg-[#1c2030] border border-[#262c3d] rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                        />

                        <button
                            onClick={addTask}
                            className="bg-purple-500 hover:bg-purple-400 transition px-6 py-3 rounded-xl font-semibold"
                        >
                            + Add
                        </button>
                    </div>

                    {/* Priority */}
                    <div className="flex items-center gap-2 flex-wrap">

                        <span className="text-xs uppercase tracking-widest text-gray-400">
                            Priority:
                        </span>

                        {Object.keys(PRIORITY).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPriority(p)}
                                className={`px-3 py-1 rounded-lg border text-sm transition ${priority === p
                                    ? "border-purple-500 text-purple-400"
                                    : "border-[#262c3d] text-gray-400"
                                    }`}
                            >
                                {PRIORITY[p].label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-4">

                    {["all", "active", "done"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`flex-1 py-2 rounded-xl border transition ${filter === f
                                ? "border-purple-500 bg-[#1c2030] text-purple-400"
                                : "border-[#262c3d] bg-[#141720] text-gray-400"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Tasks */}
                <div className="space-y-3">

                    {filteredTasks.length === 0 ? (
                        <div className="bg-[#141720] border border-dashed border-[#262c3d] rounded-2xl p-10 text-center text-gray-500">
                            ◎ No tasks yet
                        </div>
                    ) : (
                        filteredTasks.map((task) => (
                            <div
                                key={task.id}
                                className={`bg-[#141720] border border-[#262c3d] rounded-2xl p-4 flex items-center gap-4 transition hover:border-[#3b4260] ${task.completed ? "opacity-50" : ""
                                    }`}
                            >

                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${task.completed
                                        ? "bg-purple-500 border-purple-500"
                                        : "border-[#262c3d]"
                                        }`}
                                >
                                    {task.completed && "✓"}
                                </button>

                                <div className="flex-1">

                                    <p
                                        className={`${task.completed ? "line-through text-gray-500" : ""
                                            }`}
                                    >
                                        {task.title}
                                    </p>

                                    <span
                                        className="text-xs mt-1 inline-block"
                                        style={{
                                            color: PRIORITY[task.priority]?.color,
                                        }}
                                    >
                                        {PRIORITY[task.priority]?.label}
                                    </span>
                                </div>

                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="text-gray-400 hover:text-pink-500 transition"
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}