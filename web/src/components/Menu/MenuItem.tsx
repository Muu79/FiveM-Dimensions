



export default function MenuItem(props: any) {
    return (<div className="menu-item" style={props.style} >{props.title}{props.info && <span className="info">{props.info}</span>}</div>);
}