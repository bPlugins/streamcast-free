import {  __experimentalUnitControl as UnitControl } from '@wordpress/components';
import {  Notice } from '../../../../../../bpl-tools/Components';
import { __ } from "@wordpress/i18n";
import { perUnit, pxUnit } from '../../../../../../bpl-tools/utils/options';
import { updateData } from '../../../../../../bpl-tools/utils/functions';


const StyleXUltimate = ({ attributes, setAttributes }) => {
    const { radioStyles } = attributes;
    const { playerWidth } = radioStyles;


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

        <Notice status='premium' isIcon={true}>
            {__('Custom Branding (Poster Image, Background Image), Custom Color Overlays for visualizer and buttons are available in Premium Version.', 'streamcast')}
        </Notice>
    </>;
}


export default StyleXUltimate;