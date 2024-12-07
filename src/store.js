import { create } from "zustand"
import { v4 as uuidv4 } from 'uuid'
import { devtools, persist } from "zustand/middleware";

const store = (set) => ({
    tasks: [],
    draggedTask: null,

    addTask: (title, status) =>
        set(
            state => ({ tasks: [...state.tasks, { uid: uuidv4(), title, status }] }),
            false,
            'addTask'
        ),

    removeTask: (uid) =>
        set(state => ({ tasks: state.tasks.filter(task => task.uid !== uid) })),

    setDraggedTask: (uid) => set({ draggedTask: uid }),

    moveTask: (uid, status) =>
        set(state => ({
            tasks: state.tasks.map(task =>
                task.uid === uid ? { ...task, status } : task
            )
        }))
})

export const useStore = create(persist(devtools(store), { name: 'store' }));