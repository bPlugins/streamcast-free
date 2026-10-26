import { SelectControl, TextControl, ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { playerTypeOptions } from '../../../../utils/options';
import { updateData } from '../../../../../../bpl-tools/utils/functions'; 
import { Tab } from '../../../../Panel/Tab/Tab'; 
import { playerTypeSwitch } from '../../../../utils/functions'; 
import { Notice } from '../../../../../../bpl-tools/Components';

const GeneralXUltimate = ({ attributes, setAttributes }) => {
    const { radioPlayer } = attributes; 
    const { playerType, streamURL, stationName, streamProvider, streamPort, streamMountPoint, fetchNameFromUrl } = radioPlayer;



    return <>
        <SelectControl
            label={__("Radio Player Type:", "streamcast")}
            labelPosition='left'
            value={playerType}
            options={playerTypeOptions}
            onChange={(val) => setAttributes(playerTypeSwitch(val, attributes))}
        />

        <p className='mt20'>Stream Provider*</p>
        <Tab
            value={streamProvider}
            options={[
                { label: "SHOUT cast", value: "shout-cast" },
                { label: "Ice cast", value: "ice-cast" },
                { label: "Other", value: "other" }
            ]}
            onChange={(val) => setAttributes({ radioPlayer: updateData(radioPlayer, val, "streamProvider") })}
        />

        <TextControl
            label={__("Stream Source", "streamcast")}
            value={streamURL}
            onChange={(val) => setAttributes({ radioPlayer: updateData(radioPlayer, val, "streamURL") })}
        />

        {
            streamProvider !== "other" && <NumberControl
                className='mt10'
                label={__("Stream Port", "stramcast-block")}
                labelPosition='left'
                isShiftStepEnabled={true}
                onChange={(val) => setAttributes({ radioPlayer: updateData(radioPlayer, val, "streamPort") })}
                shiftStep={1}
                value={streamPort}
            />
        }

        {
            streamProvider === "ice-cast" && <TextControl
                label={__("Stream Mount Point", "streamcast")}
                className='mt10'
                value={streamMountPoint}
                onChange={(val) => setAttributes({ radioPlayer: updateData(radioPlayer, val, "streamMountPoint") })}
            />
        }

        <TextControl
            label={__("Station Name*", "streamcast")}
            className='mt10'
            value={stationName}
            onChange={(val) => setAttributes({ radioPlayer: updateData(radioPlayer, val, "stationName") })}
        />
        <ToggleControl
            className='mt10'
            label='Fetch From URL'
            checked={fetchNameFromUrl}
            onChange={(e) => setAttributes({ radioPlayer: updateData(radioPlayer, e, "fetchNameFromUrl") })}
            help="If the Fetch From URL is checked, use the station name from the stream URL if available; otherwise, use the name set above."
        /> 

        <Notice status='premium' isIcon={true}>
            {__('Audio Visualizer, Advanced Themes (Dodger Blue, Bittersweet), Full Metadata Fetching are available in Premium Version.', 'streamcast')}
        </Notice>

        
    </>;
}


export default GeneralXUltimate;
