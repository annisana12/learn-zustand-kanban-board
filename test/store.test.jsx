import { useEffect, useMemo } from "react";
import { useStore } from "../src/store";
import { expect, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock('zustand');

const TestComponent = ({ selector, effect }) => {
    const store = useStore(); // Retrieve the store object
    const items = useMemo(() => selector(store), [store.tasks]);

    useEffect(() => effect(items), [items]);

    return null;
}

describe('when useStore is used', () => {
    it('should return default value at the start', () => {
        const selector = (store) => store.tasks;
        const effect = vi.fn();

        render(<TestComponent selector={selector} effect={effect} />)
        expect(effect).toHaveBeenCalledWith([]);
    })

    it('should add an item to the store and rerun the effect', () => {
        const selector = (store) => ({ tasks: store.tasks, addTask: store.addTask });

        const effect = vi.fn().mockImplementation((items) => {
            if (items.tasks.length === 0) {
                items.addTask('Test Task', 'PLANNED');
            }
        });

        render(<TestComponent selector={selector} effect={effect} />)

        expect(effect).toHaveBeenCalledTimes(2);
        expect(effect).toHaveBeenCalledWith(
            expect.objectContaining({
                tasks: [{ uid: expect.any(String), title: 'Test Task', status: 'PLANNED' }]
            })
        )
    })

    it('should delete an item to the store and rerun the effect', () => {
        const selector = (store) => ({
            tasks: store.tasks,
            addTask: store.addTask,
            removeTask: store.removeTask
        });

        let createdTask = false;
        let currentItems;

        const effect = vi.fn().mockImplementation((items) => {
            currentItems = items;

            if (!createdTask && items.tasks.length === 0) {
                items.addTask('Test Task', 'PLANNED');
                createdTask = true;
            } else if (items.tasks.length === 1) {
                items.removeTask(items.tasks[0].uid);
            }
        });

        render(<TestComponent selector={selector} effect={effect} />)

        expect(effect).toHaveBeenCalledTimes(3);
        expect(currentItems.tasks).toEqual([]);
    })
})