import { db } from "@/lib/db";
import TaskComponent from "../../components/task-component";
import { getAuth } from "@/app/actions/auth.actions";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export default async function Page() {
    const [tasks, user] = await Promise.all([db.task.findMany(), getAuth()]);

    const userTasks = user
        ? await db.userTaskActivity.findMany({
              where: { userId: user.id },
          })
        : [];

    return (
        <div className="w-full space-y-4 bg-stars">
            <div className="space-y-4 text-center px-6 py-8 bg-gradient-to-b from-warning/40 to-transparent">
                <h1 className="text-3xl font-bold text-fg">Tasks</h1>
                <p className="text-muted-fg">Make our tasks to get more points</p>
            </div>
            <div className="space-y-4 mt-8 px-6">
                {tasks.map((task) => (
                    <TaskComponent key={task.id} task={task} userTasks={userTasks} />
                ))}
            </div>
        </div>
    );
}
