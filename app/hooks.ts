import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'
import React from 'react';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export const useMousePosition = () => {
    const [
        mousePosition,
        setMousePosition
    ] = React.useState({ x: null, y: null });
    React.useEffect(() => {
        const updateMousePosition = (ev : any) => {
        setMousePosition({ x: ev.clientX, y: ev.clientY });
        };
        window.addEventListener('mousemove', updateMousePosition);
        return () => {
        window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);
    return mousePosition;
};