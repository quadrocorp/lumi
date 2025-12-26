import { Circle } from 'lucide-react';

function ButtonOuter({
    onClick=() => console.log('button activated.'),
    icon='Circle',
    children="Button",
    iconFirst=true
}) {
    const button = <button className="p-3.5 backdrop-opacity-50 mix-blend-overlay backdrop-blur-2xl flex flex-row gap-1 justify-center items-center bg-linear-to-tr from-gray-900 to-gray-300" onClick={onClick}>
        <p>{children}</p>
        <Circle size={23}/>
    </button>;
    return button;
}

export default ButtonOuter;