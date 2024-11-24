const TasksOverview = {
    SELF_MOVE: [
        {
            key: 'task_balancing',
            d_key: "BALANCING",
            color: '177, 186, 241',
        },
        {
            key: 'task_rolling',
            d_key: "ROLLING",
            color: '178, 215, 242',
        },
        {
            key: 'task_jumping',
            d_key: "JUMPING",
            color: '156, 236, 225'
        },
        {
            key: 'task_running',
            d_key: "RUNNING",
            color: '236, 238, 137',
        }
    ],
    OBJECT_MOVE: [
        {
            key: 'task_bouncing',
            d_key: "BOUNCING",
            color: '255, 199, 176'
        },
        {
            key: 'task_catching',
            d_key: "CATCHING",
            color: '255, 218, 174'
        },
        {
            key: 'task_throwing',
            d_key: "THROWING",
            color: '249, 188, 221'
        },
        {
            key: 'task_dribbling',
            d_key: "DRIBBLING",
            color: '243, 215, 255'
        }
    ]
}

export const getColorByTaskGroup = (task: string) => {
    const color = TasksOverview.SELF_MOVE.find((t) => task.includes(t.key))?.color ||
        TasksOverview.OBJECT_MOVE.find((t) => task.includes(t.key))?.color || '0, 0, 0';
    return color;
}

export const getTaskObjectByTaskGroup = (task: string) => {
    const taskObject = TasksOverview.SELF_MOVE.find((t) => task.includes(t.key)) ||
        TasksOverview.OBJECT_MOVE.find((t) => task.includes(t.key)) || { key: '', d_key: '', color: '' };
    return taskObject;
}

export default TasksOverview