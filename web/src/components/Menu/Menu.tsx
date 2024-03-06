import './Menu.css';
import '../../css/fonts.css'
import MenuItem from './MenuItem';
import { useEffect, useReducer, useState } from 'react';
import { fetchNui } from "../../utils/fetchNui";
import { HUD } from './HUD';
import { useVisibility } from '../../providers/VisibilityProvider';

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
    const visible = useVisibility().visible;
    const [showInput, setShowInput] = useState<boolean>(false);
    const [input, setInput] = useState<string>();
    const handleChange = (e: any) => {
        setInput(e.target.value)
    }
    const handleInputEnter = (e: any) => {
        if (e.keyCode === 27) { setShowInput(false); setInput('') };
    }

    const [nuiUpdate, toggleNuiUpdate] = useState(false);
    useEffect(() => {
        const handleUpdate = (e: { data: { type: string } }) => {
            switch ((e.data.type) || "") {
                case 'update':
                    toggleNuiUpdate(!nuiUpdate)
                    break;
                default:
                    break;
            }
        }
        window.addEventListener('message', handleUpdate)

        return () => window.removeEventListener('message', handleUpdate)
    })

    const [menuItems, setMenuItems] = useState<{ name: string; info?: any, units?: any }[]>([{ name: 'item1' }, { name: 'item2' }]);
    useEffect(() => {
        if (showInput) return;
        fetchNui('getMenuOptions').then((res: { name: string; info?: any, units?: any }[]) => {
            setMenuItems(res);
        }).catch(e => {
            setMenuItems([{ 'name': 'item1' }, { 'name': 'item2' }, { 'name': 'item3', info: 33, units: 'dimensions' }, { 'name': 'item4' }, { 'name': 'item5' }])
            console.error(e)
        })
    }, [nuiUpdate, showInput])

    const [showHUD, setShowHUD] = useState<boolean>(false)
    useEffect(() => {
        if (!visible)
            fetchNui('hideFrame')
    }, [showHUD, visible])

    const menuFunctions = [
        (i: number) => {
            fetchNui('toggleSeeker').catch(e => console.log(e));
        },
        (i: number) => {
            if (!showInput) {
                setShowInput(true)
            }
            else {
                fetchNui('setDimensionLimit', { limit: input }).then().catch(e => console.log(e))
                setShowInput(false)
            };
        },
        (i: number) => {
            if (!showInput) {
                setShowInput(true)
            }
            else {
                fetchNui('setCDTime', { time: input, type: 'hider' }).then().catch(e => console.log(e))
                setShowInput(false)
            };
        },
        (i: number) => {
            if (!showInput) {
                setShowInput(true)
            }
            else {
                fetchNui('setCDTime', { time: input, type: 'seeker' }).then().catch(e => console.log(e))
                setShowInput(false)
            };
        },
        (i: number) => {
            if (!showInput) {
                setShowHUD(!showHUD)
            }
        }
    ]

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

    const [playerRole, setPlayerRole] = useState<string>("Hider")
    const [pDIndex, setPDIndex] = useState<Number>(1);
    useEffect(() => {
        fetchNui('getHudInfo').then(res => {
            setPlayerRole(res.role);
            setPDIndex(res.index)
        }).catch(e => {
            console.debug(e);
        })
    }, [menuItems])

    return (<div>
        {showHUD && <HUD props={{ role: playerRole, dimension: pDIndex }} className={'hud-wrapper'} />}
        {visible && <div className='menu-wrapper'>
            <div className='menu-header'><span id='h1' className='house-script'>Dimension Settings</span></div>
            <div className='menu-body' >{
                [...menuItems.map((v: { name: string, info?: any, units?: any }, i: number) =>
                    <MenuItem title={v.name} key={i} info={v.info} units={v.units} style={{
                        cursor: 'pointer',
                        backgroundColor: i === state.selectedIndex ? '#1b6262' : 'rgba(26, 31, 31, 0.811)',
                        color: i === state.selectedIndex ? 'rgba(220, 220, 220, 1)' : 'rgba(102, 102, 102, 0.5)'
                    }} />
                )]
            }</div>
        </div>}
        {showInput && <input autoFocus id='menuInputBox' onKeyDown={handleInputEnter} onChange={handleChange}></input>}</div>)
}

export default Menu;