import './Task.css'
import classNames from 'classnames';
import { useStore } from '../store'
import { Trash2 } from 'lucide-react';

const Task = ({ uid }) => {
    const task = useStore((store) => store.tasks.find(task => task.uid === uid));
    const removeTask = useStore(store => store.removeTask);
    const setDraggedTask = useStore(store => store.setDraggedTask);
    
    const handleDragStart = (event) => {
        setDraggedTask(uid);

        // Create a custom drag preview
        const dragPreview = document.createElement("div");

        dragPreview.style.position = "absolute";
        dragPreview.style.width = "80%";
        dragPreview.style.maxWidth = "200px";
        dragPreview.style.display = "flex";
        dragPreview.style.alignItems = "center";
        dragPreview.style.justifyContent = "center";
        dragPreview.style.background = "white";
        dragPreview.style.padding = "1rem";

        dragPreview.textContent = task.title;

        document.body.appendChild(dragPreview);

        // Set the drag image to the custom preview
        event.dataTransfer.setDragImage(dragPreview, 75, 25);

        // Remove the custom preview after drag starts
        setTimeout(() => {
            document.body.removeChild(dragPreview);
        }, 0);
    }

    return (
        <div
            className="task"
            draggable
            onDragStart={handleDragStart}
        >
            <div>{task.title}</div>

            <div className='bottomWrapper'>
                <div className='delete-task'>
                    <Trash2 onClick={() => removeTask(uid)} size={20} />
                </div>
                <div className={classNames('status', task.status)}>{task.status}</div>
            </div>
        </div>
    )
}

export default Task