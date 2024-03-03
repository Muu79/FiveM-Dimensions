export default function MenuItem(props: any) {
    return(<div className="menu-item" style={props.style}><a onClick={props.onClick}><div>{props.title}</div></a></div>);
}