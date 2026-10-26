import { __ } from '@wordpress/i18n';

import { verticalLineIcon, horizontalLineIcon, LifeCirle, FileText, ThumbUp } from './icons';

export const layouts = [
    { label: __('Vertical', 'streamcast'), value: 'vertical', icon: verticalLineIcon },
    { label: __('Horizontal', 'streamcast'), value: 'horizontal', icon: horizontalLineIcon }
];

export const generalStyleTabs = [
    { name: 'general', title: __('General', 'streamcast') },
    { name: 'style', title: __('Style', 'streamcast') }
];

export const playerTypeOptions = [
    { label: 'Minimal', value: "minimal" },
    { label: 'Standard', value: "standard" },
    { label: 'Advanced', value: "advanced" },
    { label: 'Ultimate', value: "ultimate" },
    { label: 'EchoStream', value: "echoStream" },
    { label: 'AuroraPlay', value: "auroraPlay" },
    { label: 'Wooden', value: "wooden" }
]

export const skins = [
    { label: "B Circle", value: "b_circle" },
    { label: "McClean (180x60)", value: "mcclean" },
    { label: "RadioVoz (220x69)", value: "radiovoz" },
    { label: "Faredirfare (269x52)", value: "faredirfare" },
    { label: "Tweety (189x62)", value: "tweety" },
    { label: "Compact (191x46)", value: "compact" },
    { label: "Tim Simz - Cassette (200x120)", value: "cassette" },
    { label: "Repvku-100 (100x25)", value: "repvku-100" },
    { label: "DarkConsole (190x62)", value: "darkconsole" },
    { label: "Tiny (130x60)", value: "tiny" },
    { label: "Universelle (155x65)", value: "universelle" },
    { label: "UUSkin (166x83)", value: "uuskin" },
    { label: "E76 (130x75)", value: "e76" },
    { label: "Original (329x21)", value: "original" },
    { label: "Arvy Skin [M] (560x30)", value: "arvyskin" },
    { label: "Eastanbul (467x26)", value: "eastanbul" },
    { label: "Substream (180x30)", value: "substream" },
    { label: "BANita (110x25)", value: "banita" },
    { label: "Listen Live (250x100)", value: "listen-live" },
    { label: "EasyPlay (231x30)", value: "easyplay" },
    { label: "Stockblue (476x26)", value: "stockblue" },
    { label: "LargeBayFM (451x90)", value: "largebayfm" },
    { label: "Simple Blue [M] (300x122)", value: "simple-blue" },
    { label: "Simple Gray [M] (300x122)", value: "simple-gray" },
    { label: "Simple Green [M] (300x122)", value: "simple-green" },
    { label: "Simple Orange [M] (300x122)", value: "simple-orange" },
    { label: "Simple Red [M] (300x122)", value: "simple-red" },
    { label: "Simple Violet [M] (300x122)", value: "simple-violet" },
    { label: "SCRadio (160x100)", value: "scradio" },
    { label: "Repvku-115 (115x25)", value: "repvku-115" },
    { label: "RB1 (250x70)", value: "rb1" },
    { label: "Tandem-115 (115x25)", value: "tandem-115" },
    { label: "Simcha-232 [T] (232x58)", value: "simcha-232-toggle" },
    { label: "Simcha-232 (232x58)", value: "simcha-232" },
    { label: "Simcha-320 (320x58)", value: "simcha-320" },
    { label: "KPlayer (220x200)", value: "kplayer" },
    { label: "Appy [T] (250x213)", value: "appy" },
    { label: "Blueberry (338x102)", value: "blueberry" },
    { label: "OldRadio (205x132)", value: "oldradio" },
    { label: "OldRadio Christmas (205x132)", value: "oldradio-christmas" },
    { label: "OldStereo (318x130)", value: "oldstereo" },
    { label: "Xm (234x66)", value: "xm" },
    { label: "Abrahadabra (100x141)", value: "abrahadabra" },
    { label: "Abrahadabra 2 (100x141)", value: "abrahadabra2" },
    { label: "WMP (386x47)", value: "wmp" },
    { label: "Radioport (700x150)", value: "radioport" },
    { label: "Alberto (250x95)", value: "alberto" },
    { label: "FF (288x68)", value: "ff" },
    { label: "Neon (240x76)", value: "neon" },
    { label: "Player STM (128x30)", value: "player-stm" },
    { label: "NeonSlim (501x32)", value: "neonslim" },
    { label: "GreySlim (494x35)", value: "greyslim" },
    { label: "Demon (468x117)", value: "demon" },
    { label: "Xavi (250x95)", value: "xavi" },
    { label: "Xavi2 (95x95)", value: "xavi2" },
    { label: "Xavi3 (250x95)", value: "xavi3" },
    { label: "Minimal (220x80)", value: "minimal" },
    { label: "Grind (400x336)", value: "grind" },
    { label: "CPR-180 (180x40)", value: "cpr-180" },
    { label: "Am Mascota (290x100)", value: "ammascota" },
    { label: "MiniRadio (275x112)", value: "miniradio" },
    { label: "My Radio (262x165)", value: "myradio" },
    { label: "Terawhite (255x100)", value: "terawhite" },
    { label: "Kelabu Yellow (253x100)", value: "kelabu-yellow" },
    { label: "Cristal (300x113)", value: "cristal" },
    { label: "Bintang (300x113)", value: "bintang" },
    { label: "Tatar Radiosi (418x150)", value: "tatarradiosi" },
    { label: "Reds Radio SML (500x158)", value: "redsradiosml" },
    { label: "BogusBlue (660x266)", value: "bogusblue" },
    { label: "Bones (341x125)", value: "bones" },
    { label: "Combat (675x247)", value: "combat" },
    { label: "DragonBlues (400x145)", value: "dragonblues" },
    { label: "Lemon (410x60)", value: "lemon" },
    { label: "Limed (397x115)", value: "limed" },
    { label: "Longtail (498x61)", value: "longtail" },
    { label: "Pinhead (421x120)", value: "pinhead" },
    { label: "Retro (669x259)", value: "retro" },
    { label: "Silvertune (200x104)", value: "silvertune" },
    { label: "Test/Develop (189x61)", value: "testskin" },
    { label: "Retromatic (700x150)", value: "retromatic" },
    { label: "Retromatic Small (298x150)", value: "retromaticsmall" },
    { label: "E90 (190x59)", value: "e90" },
    { label: "SH Music (300x190)", value: "shmusic" },
    { label: "Brújula Latina (330x100)", value: "brujulalatina" },
    { label: "ADN (700x150)", value: "adn" },
]


export const proFeatures = [
    {
        name: "Customized Radio Player",
        description:
            "Customize You Player with some awesome options."
    },
    {
        name: "85+ Built-in Skins",
        description:
            "Extend your plugin with these 85+ built-in skins."
    },
    {
        name: "Player Width",
        description:
            "Added option to set and edit player width."
    },
    {
        name: "Style Radio Player",
        description:
            "Option to set content color, title and sub title typography, color, background color, background image and a lot of more options to style your player."
    },
    {
        name: "Powerful Gutenberg Block",
        description:
            "Added a very powerful gutenberg block with some incredible features which will make your radio player more elegant."
    },
    {
        name: "Fetch Stream Title From Stream URL",
        description:
            "Collect Stream Name or Title or Artist Name from you streaming name."
    },
    {
        name: "Player Positioning",
        description:
            "Alignment your player like left, center , right."
    },
    {
        name: "Upload Image",
        description:
            "Set image for player background, player poster or art image."
    }
];

export const helpfulLinks = [
    {
        title: 'Need any Assistance?',
        description: 'Our Expert Support Team is always ready to help you out promptly.',
        icon: <LifeCirle />,
        link: 'https://bplugins.com/support',
        linkText: 'Contact Support'
    },
    {
        title: 'Looking for Documentation?',
        description: 'We have detailed documentation on every aspects of the plugin.',
        icon: <FileText />,
        link: 'https://bplugins.com/docs/streamcast-radio-player/',
        linkText: 'Documentation'
    },
    {
        title: 'Liked This Plugin?',
        description: 'Glad to know that, you can support us by leaving a 5 &#11088; rating.',
        icon: <ThumbUp />,
        link: 'https://wordpress.org/support/plugin/streamcast/reviews/',
        linkText: 'Rate the Plugin'
    }
];