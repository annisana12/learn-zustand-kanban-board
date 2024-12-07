import './Column.css'
import { useStore } from '../store'
import Task from './Task'
import { useMemo, useState } from 'react'
import classNames from 'classnames'

const Column = ({ status }) => {
    const [title, setTitle] = useState('');
    const [open, setOpen] = useState(false);
    const [drop, setDrop] = useState(false);

    const alltasks = useStore((store) => store.tasks);
    const draggedTask = useStore((store) => store.draggedTask);
    const addTask = useStore((store) => store.addTask);
    const setDraggedTask = useStore((store) => store.setDraggedTask);
    const moveTask = useStore((store) => store.moveTask);

    const tasks = useMemo(
        () => alltasks.filter(task => task.status === status),
        [alltasks, status]
    );

    const cancelAddTask = () => {
        setTitle('');
        setOpen(false);
    }

    const submitTask = () => {
        addTask(title, status);
        setTitle('');
        setOpen(false);
    }

    const handleDragOver = (e) => {
        e.preventDefault();
        setDrop(true);
    }

    const dropTask = () => {
        moveTask(draggedTask, status);
        setDraggedTask(null);
        setDrop(false);
    }

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDrop(false);
    }

    return (
        <div
            className={classNames("column", { drop: drop })}
            onDragOver={handleDragOver}
            onDrop={dropTask}
            onDragLeave={handleDragLeave}
        >
            <div className='titleWrapper'>
                <div>{status}</div>
                <button onClick={() => setOpen(true)}>Add</button>
            </div>

            {
                tasks.map((task) => (
                    <Task uid={task.uid} key={task.uid} />
                ))
            }

            {
                open && (
                    <div className='Modal'>
                        <div className='modalContent'>
                            <input
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                                placeholder='Enter task name here...'
                            />

                            <div className='btn-cntr'>
                                <button onClick={cancelAddTask}>Cancel</button>
                                <button onClick={submitTask}>Submit</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Column