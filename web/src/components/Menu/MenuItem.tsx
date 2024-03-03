export default function MenuItem(props: any) {
    return(<div className="menu-item" style={props.style} onClick={props.onClick}>{props.title}</div>);
}