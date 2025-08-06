import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import TaskForm from "@/components/organisms/TaskForm";
import TaskCard from "@/components/molecules/TaskCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { taskService } from "@/services/api/taskService";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { toast } from "react-toastify";
import { isToday, isThisWeek, isFuture } from "date-fns";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState("pending");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [tasksData, farmsData, cropsData] = await Promise.all([
        taskService.getAll(),
        farmService.getAll(),
        cropService.getAll()
      ]);
      setTasks(tasksData);
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.update(editingTask.Id, taskData);
        toast.success("Task updated successfully!");
      } else {
        await taskService.create(taskData);
        toast.success("Task added successfully!");
      }
      await loadData();
      setShowForm(false);
      setEditingTask(null);
    } catch (err) {
      toast.error("Failed to save task");
    }
  };

  const handleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      if (task) {
        const updatedTask = { ...task, completed: true };
        await taskService.update(taskId, updatedTask);
        setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
        toast.success("Task completed successfully!");
      }
    } catch (err) {
      toast.error("Failed to complete task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      switch (filterStatus) {
        case "today":
          return !task.completed && isToday(new Date(task.dueDate));
        case "week":
          return !task.completed && isThisWeek(new Date(task.dueDate));
        case "upcoming":
          return !task.completed && isFuture(new Date(task.dueDate));
        case "completed":
          return task.completed;
        case "pending":
        default:
          return !task.completed;
      }
    });
  };

  const groupTasksByTimeframe = (filteredTasks) => {
    if (filterStatus === "completed" || filterStatus === "pending") {
      return { "All Tasks": filteredTasks };
    }

    const today = filteredTasks.filter(task => isToday(new Date(task.dueDate)));
    const thisWeek = filteredTasks.filter(task => 
      isThisWeek(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
    );
    const upcoming = filteredTasks.filter(task => 
      isFuture(new Date(task.dueDate)) && !isThisWeek(new Date(task.dueDate))
    );

    const groups = {};
    if (today.length > 0) groups["Today"] = today;
    if (thisWeek.length > 0) groups["This Week"] = thisWeek;
    if (upcoming.length > 0) groups["Upcoming"] = upcoming;

    return groups;
  };

  if (loading) return (
    <div className="p-6">
      <Loading rows={3} />
    </div>
  );

  if (error) return (
    <div className="p-6">
      <Error message={error} onRetry={loadData} />
    </div>
  );

  const filteredTasks = getFilteredTasks();
  const groupedTasks = groupTasksByTimeframe(filteredTasks);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">Tasks</h1>
          <p className="text-gray-600">Manage your farm activities and schedules.</p>
        </div>
        <Button 
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
          variant="primary"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Form */}
{showForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowForm(false);
              setEditingTask(null);
            }
          }}
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <TaskForm
              task={editingTask}
              farms={farms}
              crops={crops}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="sm:w-48"
        >
          <option value="pending">All Pending</option>
          <option value="today">Due Today</option>
          <option value="week">This Week</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </Select>
        
        <div className="text-sm text-gray-600">
          {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} found
        </div>
      </div>

      {/* Tasks */}
      {filteredTasks.length === 0 ? (
        <Empty
          title="No tasks found"
          description={tasks.length === 0 
            ? "Start by adding your first task to organize your farm activities."
            : "No tasks match your current filter. Try selecting a different timeframe."
          }
          actionLabel="Add Task"
          onAction={() => setShowForm(true)}
          icon="CheckSquare"
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([timeframe, groupTasks]) => (
            <div key={timeframe}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{timeframe}</h2>
                <span className="text-sm text-gray-600">
                  {groupTasks.length} task{groupTasks.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {groupTasks.map(task => (
                  <TaskCard
                    key={task.Id}
                    task={task}
                    onComplete={handleComplete}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;