import {useEffect, useRef, useState} from "react";
import { Menu } from "lucide-react";

// For use with panels, where multiple buttons are stored
function ButtonBorderless({
    icon: Icon, 
    children, 
    onClick,
    stateHook,
    stateHookSetter
}) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0});
    const [isClicked, setIsClicked] = useState(false);
    const buttonRef = useRef(null);
    const circleRef = useRef(null);

    const [buttonRect, setButtonRect] = useState({
        left: 0,
        top: 0,
        width: 0,
        height: 0
    });

    useEffect(() => {
        const timer = () => {
            setTimeout(() => setIsClicked(false), 250)
        }
        if (isClicked) {
            timer();
        }
        return () => {clearTimeout(timer)}
    }, [isClicked]);

    useEffect(() => {
        const updateButtonRect = () => {
            if (buttonRef.current) {
                setButtonRect(buttonRef.current.getBoundingClientRect());
            }
        }

        updateButtonRect();
        window.addEventListener('resize', updateButtonRect);

        return () => {
            window.removeEventListener('resize', updateButtonRect)
        }
    }, []);

    const handleMouseMove = (e) => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setMousePosition({ x, y });

            if (circleRef.current) {
                circleRef.current.style.left = `${x}px`;
                circleRef.current.style.top = `${y}px`;
            }
        }
    };

    const handleClick = (e) => {
        e.preventDefault();
        setIsClicked(true);
        if (onClick) {
            onClick(e);
        }
    };

    const handleMouseEnter = () => {
        if (circleRef.current) {
            circleRef.current.style.opacity = '1';
        }
    };

    const handleMouseLeave = () => {
        if (circleRef.current) {
            circleRef.current.style.opacity = '0';
        }
    };

    return (
        <button
            ref={buttonRef}
            className={`borderless-btn ${isClicked ? 'borderless-btn-clicked' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            style={{
                height: "20px",
                width: children ? "" : "20px",
                padding: children ? "" : "10px"
            }}
        >
            <div className="button-content">
                {Icon && (
                    <Icon size={18} />
                )}
                {children && <span>{children}</span>}
            </div>
        </button>
    )
}

export default ButtonBorderless;

export const MenuButton = ({
    children,
    onClick,
    stateHook,
    stateHookSetter
}) =>(
    <ButtonBorderless icon={Menu} onClick={onClick}>{children}</ButtonBorderless>
)