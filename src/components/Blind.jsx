import { useState, useEffect } from "react";
import { stylesBlind as styles } from "../assets/styles";


function Blind () {
    const [style, setStyle] = useState([styles.base, styles.up].join(" "))
    const [active, setActive] = useState(false)
    useEffect(() => {
        toggle();
    }, []);
    
    function toggle() {
        if (active) {
            setStyle([styles.base, styles.down].join(" "))
            setTimeout(() => setActive(false), 601)
        } else {
            setActive(true)
            setTimeout(() => setStyle(styles.base), 600)
        }
    }

    if (active) {
        return (
        <div onClick={() => toggle()} className={style}>
            
        </div>
        )
    }
}

export default Blind;