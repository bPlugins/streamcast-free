import React from 'react';
import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import StyleXUltimate from './StyleXUltimate';
import StyleXEchoStreamXAurora from './StyleXEchoStreamXAurora';
import StyleXWooden from './StyleXWooden';


// Styles Settings For Ultimate & AuroraPlay Radio Player
const Style = ({ attributes, setAttributes }) => {
    const { radioPlayer } = attributes;
    const { playerType } = radioPlayer;
    return (
        <>
            <PanelBody className='bPlPanelBody' title={__("Player", "streamcast")}>

                {
                    playerType === "ultimate" && <StyleXUltimate attributes={attributes} setAttributes={setAttributes} />
                }
                {
                    playerType === "echoStream" && <StyleXEchoStreamXAurora attributes={attributes} setAttributes={setAttributes} />
                }
                {
                    playerType === "auroraPlay" && <StyleXEchoStreamXAurora attributes={attributes} setAttributes={setAttributes} />
                }
                {
                    playerType === "wooden" && <StyleXWooden attributes={attributes} setAttributes={setAttributes} />
                }

            </PanelBody>
        </>
    )
}


export default Style;