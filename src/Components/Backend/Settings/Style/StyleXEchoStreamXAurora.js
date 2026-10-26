import { __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { ColorControl, Notice } from '../../../../../../bpl-tools/Components';
import { __ } from "@wordpress/i18n";
import { perUnit, pxUnit } from '../../../../../../bpl-tools/utils/options';
import { updateData } from '../../../../../../bpl-tools/utils/functions'; 


const StyleXEchoStreamXAurora = ({ attributes, setAttributes }) => {
    const { radioStyles, radioPlayer } = attributes;
    const { playerType } = radioPlayer;
    const { playerWidth, contentColor, backgroundColor } = radioStyles;


    return <>
        <UnitControl
            label={__("Player Width", "streamcast")}
            value={playerWidth}
            units={[pxUnit(), perUnit()]}
            onChange={(v) =>
                setAttributes({
                    radioStyles: updateData(radioStyles, v, "playerWidth")
                })
            }
        />
        {
            playerType === "auroraPlay" && <ColorControl
                label={__('Background Color', 'streamcast')}
                value={backgroundColor}
                onChange={val => setAttributes({ radioStyles: updateData(radioStyles, val, "backgroundColor"), })}
                defaultColor='#ffffff'
            />
        }

        <ColorControl
            label={__('Content Color', 'streamcast')}
            value={contentColor}
            onChange={val => setAttributes({ radioStyles: updateData(radioStyles, val, "contentColor"), })}
            defaultColor='#ffffff'
        />

        {
            playerType === "auroraPlay" && <Notice status='premium' isIcon={true}>
                {__('Advanced Color control for every UI element, Hover Background Colors, Typography control (Station Name & Artist Name) are available in Premium Version.', 'streamcast')}
            </Notice>
        }

        {
            playerType === "echoStream" && <Notice status='premium' isIcon={true}>
                {__('Advanced Color control for small elements, Hover Background Styles, Typography control (Station Name & Artist Name) are available in Premium Version.', 'streamcast')}
            </Notice>
        } 
    </>;
}


export default StyleXEchoStreamXAurora;
