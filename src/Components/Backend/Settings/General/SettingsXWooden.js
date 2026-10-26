import { SelectControl, TextControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { updateData } from '../../../../../../bpl-tools/utils/functions'; 
import { playerTypeOptions } from '../../../../utils/options';
import { playerTypeSwitch } from '../../../../utils/functions'; 
import { Notice } from '../../../../../../bpl-tools/Components';

const SettingsXWooden = ({ setAttributes, attributes }) => {
    const { radioPlayer } = attributes; 
    const { streamURL, stationName, fetchNameFromUrl, playerType } = radioPlayer; 

    return (
        <>
            <SelectControl
                label={__("Radio Player Type:", "streamcast")}
                labelPosition='left'
                value={playerType}
                options={playerTypeOptions}
                onChange={(val) => setAttributes(playerTypeSwitch(val, attributes))}
            />
            <TextControl
                help="If your site is secured ( https://) then the stream url must be secure (https://)"
                label={__("Stream URL", "streamcast")}
                value={streamURL}
                onChange={(val) => setAttributes({ radioPlayer: updateData(radioPlayer, val, "streamURL") })}
            />
            <TextControl
                label={__("Station Name*", "streamcast")}
                value={stationName}
                onChange={(val) => setAttributes({ radioPlayer: updateData(radioPlayer, val, "stationName") })}
            />
            <ToggleControl
                className='mt20'
                label='Fetch From URL'
                checked={fetchNameFromUrl}
                onChange={(e) => setAttributes({ radioPlayer: updateData(radioPlayer, e, "fetchNameFromUrl") })}
                help="If name can't access then will use the given station name"
            />

            <Notice status='premium' isIcon={true}>
                {__('Vintage Textures, Hover Effects, Player Metadata, Timestamp Styling are available in Premium Version.', 'streamcast')}
            </Notice>
        </>
    )
}

export default SettingsXWooden;
