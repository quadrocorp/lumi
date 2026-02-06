import Block, { BlockLabel } from "./components/Block";
import Button from "./components/Button";
import { BotIcon, ChartArea, LogOut, Menu, Server, Settings2, User2 } from "lucide-react";

const App = () => {
  return (
    <div className="navigation-panel">
      <div className="label-button-holder">
        <Button icon={Menu} />
        {/*<BlockLabel first="Lumi:" second="Photon" sub="v1.0-alpha" iconFirst={true} icon={Server}/>*/}
          <Button icon={BotIcon}></Button>
      </div>
      <div className="label-button-holder">
        <BlockLabel first="Nick" second="Tsupko" sub="System Administrator" iconFirst={false} icon={User2}/>
        <Button icon={Settings2} />
          <Button icon={LogOut}/>
      </div>
    </div>
  )
};

export default App;