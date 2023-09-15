import React from "react";
import { Tabs, Tab } from "@mui/material";



interface MyTabbedLayoutProps {
  tabs:any,
  onSelection:any,
  defaultSelection:any
}


function MyTabbedLayout(props:MyTabbedLayoutProps) {
  const [selectedTab, setSelectedTab] = React.useState(props.defaultSelection);
 

  const handleTabChange = (event:any, newValue:any) => {
    setSelectedTab(newValue);
    props.onSelection(newValue);
  };

  function GetTab() {
    return props.tabs[selectedTab].element;
  }



  return (
    <div className="rounded-xl shadow-sm px-2" style={{background:'rgba(255, 255, 255,1)'}}>
      
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
      >
        {props.tabs?.map((tab:any, i:any) => {
          return <Tab  sx={{color:"black"}} key={i} label={tab.title} />;
        })}
      </Tabs>
      <GetTab />
    </div>
  );
}

export default MyTabbedLayout;
