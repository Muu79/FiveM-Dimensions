export default function MenuItem(props: any) {
    return(<div className="menu-item"><a onClick={props.onClick} style={props.style}><div>{props.title}</div></a></div>);
}