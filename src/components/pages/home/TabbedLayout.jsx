import React from "react";
import { Tabs, Tab } from "@mui/material";



function MyTabbedLayout({ tabs, onSelection ,defaultSelection}) {
  const [selectedTab, setSelectedTab] = React.useState(defaultSelection);
 

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    onSelection(newValue);
  };

  function GetTab() {
    return tabs[selectedTab].element;
  }



  return (
    <div className="rounded-xl shadow-sm px-2" style={{background:'rgba(255, 255, 255,1)'}}>
      
      <Tabs
        
        value={selectedTab}
        onChange={handleTabChange}
      >
        {tabs?.map((tab, i) => {
          return <Tab  sx={{color:"black"}} key={i} label={tab.title} />;
        })}
      </Tabs>
      <GetTab />
    </div>
  );
}

export default MyTabbedLayout;
