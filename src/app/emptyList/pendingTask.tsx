import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Task, StorageDisplay } from "@/utils/interface";
import { getTasksFilterByState } from "@/utils/supabaseFunction";

const PendingTask = () => {
  const [tasks, setTasks] = useState<Task[]>;

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getTasksFilterByState("pending");
    };
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-full"></div>
  );
};

export default PendingTask;
