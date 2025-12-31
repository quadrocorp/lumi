import { Circle } from 'lucide-react';

function ButtonOuter({
    onClick=() => console.log('button activated.'),
    icon='Circle',
    children="Button",
    iconFirst=true
}) {
    const button = <button className="p-5 rounded-3xl text-lg font-medium justify-center items-center shadow-idle backdrop-blur-md flex flex-row gap-2 text-white border-t-2 border-t-neutral-50" onClick={onClick}>
        <p>{children}</p>
        <Circle size={23}/>
    </button>;
    return button;
}

export default ButtonOuter;