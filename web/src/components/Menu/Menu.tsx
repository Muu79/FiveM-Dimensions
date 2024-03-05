import './Menu.css';
import '../../css/fonts.css'
import MenuItem from './MenuItem';
import { useEffect, useReducer, useState } from 'react';
import { fetchNui } from "../../utils/fetchNui";

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




const Menu = () => {
    const [showInput, setShowInput] = useState<boolean>(false);
    const [input, setInput] = useState<string>();
    const handleChange = (e: any) => {
        setInput(e.target.value)
    }
    const handleInputEnter = (e: any) => {
        if (e.keyCode === 27) { setShowInput(false); setInput('') };
    }


    const menuFunctions = [
        (i: number) => {
            fetchNui('toggleSeeker').catch(e => console.log(e));
        },
        (i: number) => {
            if (!showInput) {
                setShowInput(true)
            }
            else {
                setShowInput(false)
                fetchNui('setDimensionLimit', { limit: input }).catch(e => console.log(e))
            };
        },
        (i: number) => {
            if (!showInput) {
                setShowInput(true)
            }
            else {
                setShowInput(false)
                fetchNui('setCDTime', { time: input, type: 'hider' }).catch(e => console.log(e))
            };
        },
        (i: number) => {
            if (!showInput) {
                setShowInput(true)
            }
            else {
                setShowInput(false)
                fetchNui('setCDTime', { time: input, type: 'seeker' }).catch(e => console.log(e))
            };
        }
    ]
    const [menuItems, setMenuItems] = useState<{ name: string, info?: any, units?: string}[]>([{ name: 'item1' }, { name: 'item2' }]);
    useEffect(() => {
        fetchNui('getMenuOptions').then(res => {
            setMenuItems(res);
            console.log(res)
        }).catch(e => {
            setMenuItems([{ name: 'item1' }, { name: 'item2' }, { name: 'item3', info: 33 }])
            console.error(e)
        })
        return () => {};
    }, [input])

    const arrowUpPressed = useKeyPress('ArrowUp');
    const arrowDownPressed = useKeyPress('ArrowDown');
    const enterPressed = useKeyPress('Enter');
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
            case 'enter':
                menuFunctions[state.selectedIndex](state.selectedIndex)
                return { selectedIndex: state.selectedIndex };
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

    useEffect(() => {
        if (enterPressed) {
            dispatch({ type: 'enter' })
        }
    }, [enterPressed])


    return (<div>
        <div className='menu-wrapper'>
            <div className='menu-header'><span id='h1' className='house-script'>Dimension Settings</span></div>
            <div className='menu-body' >{
                [...menuItems.map((v: { name: string, info?: any, units?:any }, i: number) =>
                    <MenuItem title={v.name} key={i} info={v.info} units={v.units} style={{
                        cursor: 'pointer',
                        backgroundColor: i === state.selectedIndex ? '#1b6262' : 'rgba(26, 31, 31, 0.811)',
                        color: i === state.selectedIndex ? 'rgba(220, 220, 220, 1)' : 'rgba(82, 82, 82, 1)'
                    }} />
                )]
            }</div>
        </div>
        {showInput && <input autoFocus id='menuInputBox' onKeyDown={handleInputEnter} onChange={handleChange}></input>}</div>)
}

export default Menu;