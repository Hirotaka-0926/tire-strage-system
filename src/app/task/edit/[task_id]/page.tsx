import TaskForm from "@/features/task/edit/TaskForm";

const EditTaskPage = () => {
  return (
    <div className="w-full  flex-col items-center justify-center h-screen relative flex grow">
      <h1>Edit Task</h1>
      <TaskForm />
    </div>
  );
};

export default EditTaskPage;
