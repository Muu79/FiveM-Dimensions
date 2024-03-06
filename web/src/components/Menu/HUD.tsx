
export const HUD = (props: any) =>{
    const parsedprops = props.props
    return(<div className={props.className}>
        <div style={{display:"inline-block"}}>
            Role: <span style={{color:parsedprops.role === 'Hider' ? '#01ddff' : '#e65858'}}>{parsedprops.role}</span>
        </div>
        <div>
            Dimension: {parsedprops.dimension}
        </div>
    </div>)
}