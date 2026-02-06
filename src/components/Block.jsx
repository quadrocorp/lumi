import {useEffect, useRef, useState} from "react";

function Block({
    className,
    classNameContent,
    biggerCircle,
    children,
}) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0});
    const [isClicked, setIsClicked] = useState(false);
    const blockRef = useRef(null);
    const circleRef = useRef(null);

    const [blockRect, setBlockRect] = useState({
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
        const updateBlockRect = () => {
            if (blockRef.current) {
                setBlockRect(blockRef.current.getBoundingClientRect());
            }
        }

        updateBlockRect();
        window.addEventListener('resize', updateBlockRect);

        return () => {
            window.removeEventListener('resize', updateBlockRect)
        }
    }, []);

    const handleMouseMove = (e) => {
        if (blockRef.current) {
            const rect = blockRef.current.getBoundingClientRect();
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
        <div
            ref={blockRef}
            className={`glass-block ${isClicked ? 'glass-block-clicked' : ''} ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            <div className="glass-effect"></div>
            <div className="mouse-follow-container">
                <div
                    ref={circleRef}
                    className={`mouse-follow-circle${biggerCircle ? "-bigger" : ""} ${classNameContent}`}
                    style={{
                        left: `${mousePosition.x}px`,
                        top: `${mousePosition.y}px`,
                    }}
                ></div>
            </div>
            <div className="block-content">
                {children}
            </div>
        </div>
    )
}

export default Block;

export const BlockLabel = ({first, second, sub, iconFirst, icon: Icon}) => {
    if (iconFirst) {
        return (
        <Block 
            className="block-label"
            biggerCircle={true}
        >
            <Icon size={24} />
            <div className="block-label-text-holder">
                <span className="block-label-text-label"><b>{first}</b><i>{second}</i></span>
                <span className="block-label-text-subtext">{sub}</span>
            </div>
        </Block>
    )
    } else {
        return (
        <Block 
            className="block-label"
            biggerCircle={true}
        >
            <div className="block-label-text-holder">
                <span className="block-label-text-label"><b>{first}</b><i>{second}</i></span>
                <span className="block-label-text-subtext">{sub}</span>
            </div>
                <Icon size={24} />
        </Block>
    )
    }
}