import React, { useState } from "react";
import { InspectorControls } from "@wordpress/block-editor";
import { TabPanel } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import { tabController } from "../../../../../bpl-tools/utils/functions";
import { AdvertiseCard } from "../../../../../bpl-tools/ProControls";
import { generalStyleTabs } from "../../../utils/options";
import General from "./General/General"; 
import GeneralTab from "./General/GeneralTab";
import Style from "./Style/Style";

const Settings = ({ attributes, setAttributes }) => { 
  const { radioPlayer = {} } = attributes;
  const { playerType } = radioPlayer; 

  return (
    <>
      <InspectorControls>
        {(playerType === "ultimate" ||
          playerType === "auroraPlay" ||
          playerType === "echoStream" ||
          playerType === "wooden") && (
          <TabPanel
            className="bPlTabPanel"
            activeClass="activeTab"
            tabs={generalStyleTabs}
            onSelect={tabController}
          >
            {(tab) => (
              <>
                {tab.name === "general" && (
                  <GeneralTab
                    attributes={attributes}
                    setAttributes={setAttributes} 
                  />
                )}

                {tab.name === "style" && (
                  <Style
                    attributes={attributes}
                    setAttributes={setAttributes} 
                  />
                )}
              </>
            )}
          </TabPanel>
        )}
        {playerType !== "ultimate" &&
          playerType !== "auroraPlay" &&
          playerType !== "echoStream" &&
          playerType !== "wooden" && (
            <General
              attributes={attributes}
              setAttributes={setAttributes} 
            />
          )}


        <AdvertiseCard planLink="/wp-admin/edit.php?post_type=streamcast&page=streamcast#/pricing"/>
      </InspectorControls> 
    </>
  );
};
export default Settings;
