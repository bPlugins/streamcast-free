import React from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody } from "@wordpress/components";
import GeneralXUltimate from './GeneralXUltimate';
import SettingsXAurora from './SettingsXAurora';
import SettingsXEchoStream from './SettingsXEchoStream';
import SettingsXWooden from './SettingsXWooden';



// Component For Ultimate and AuroraPlay Radio General Settings
const GeneralTab = ({ attributes, setAttributes }) => {
    const { radioPlayer } = attributes;
    const { playerType } = radioPlayer;
    return <>
        <PanelBody className='bPlPanelBody' title={__("Player", "stream")}>
            {
                playerType === "ultimate" && <GeneralXUltimate attributes={attributes} setAttributes={setAttributes} />
            }
            {
                playerType === "echoStream" && <SettingsXEchoStream attributes={attributes} setAttributes={setAttributes} />
            }
            {
                playerType === "auroraPlay" && <SettingsXAurora attributes={attributes} setAttributes={setAttributes} />
            }
            {
                playerType === "wooden" && <SettingsXWooden attributes={attributes} setAttributes={setAttributes} />
            }
        </PanelBody>
    </>
}


export default GeneralTab;