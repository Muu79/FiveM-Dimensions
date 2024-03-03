import './Menu.css';
import '../../css/fonts.css'
import MenuItem from './MenuItem';
import { useEffect, useReducer, useState } from 'react';

const initialState = { selectedIndex: 0 };


const useKeyPress = (targetKey: any) => {
    const [keyPressed, setKeyPressed] = useState(false);
    useEffect(() => {
        const downHandler = ({ key }: { key: any }) => {
            if (key === targetKey) {
                setKeyPressed(true);
            }
        };

        const upHandler = ({ key }: { key: any }) => {
            if (key === targetKey) {
                setKeyPressed(false);
            }
        };

        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, [targetKey]);

    return keyPressed;
};

const Menu = (props: { items: any[]; }) => {
    const menuItems = props.items; 
    const arrowUpPressed = useKeyPress('ArrowUp');
    const arrowDownPressed = useKeyPress('ArrowDown');
    const reducer = (state: { selectedIndex: number; }, action: { type: any; payload?: any; }) => {
        switch (action.type) {
            case 'arrowUp':
                return {
                    selectedIndex:
                        state.selectedIndex !== 0 ? state.selectedIndex - 1 : menuItems.length - 1,
                };
            case 'arrowDown':
                return {
                    selectedIndex:
                        state.selectedIndex !== menuItems.length - 1 ? state.selectedIndex + 1 : 0,
                };
            case 'select':
                return { selectedIndex: action.payload };
            default:
                throw new Error();
        }
    };
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (arrowUpPressed) {
            dispatch({ type: 'arrowUp' });
        }
    }, [arrowUpPressed]);

    useEffect(() => {
        if (arrowDownPressed) {
            dispatch({ type: 'arrowDown' });
        }
    }, [arrowDownPressed]);

    return (<div className='menu-wrapper'>
        <div className='menu-header'><span id='h1' className='house-script'>Dimension Settings</span></div>
        <div className='menu-body' >{
            [...menuItems.map((v, i) =>
                <MenuItem title={v.name} key={i} onClick={() => {
                    dispatch({ type: 'select', payload: i });
                }} style={{
                    cursor: 'pointer',
                    backgroundColor: i === state.selectedIndex ?  '#164141': 'rgba(26, 31, 31, 0.811)',
                    color: i === state.selectedIndex ?  'rgba(220, 220, 220, 1)': 'rgba(82, 82, 82, 1)'
                }} />
            )]
        }</div>
    </div>)
}

export default Menu;