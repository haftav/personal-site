import create from 'zustand';

import type { Route } from '../domain';

interface RouterStore {
    route: Route;
    actions: {
        navigate: (path: Route) => void;
    };
}

export const useRouterStore = create<RouterStore>((set) => ({
    route: 'main',
    actions: {
        navigate: (path: Route) => set({ route: path }),
    },
}));

export const router = useRouterStore.getState().actions;
