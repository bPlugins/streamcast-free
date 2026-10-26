import { __ } from '@wordpress/i18n';
import { gutenbergTabIcon, shortcodeTabIcon } from './icons';

const slug = 'streamcast';

export const dashboardInfo = ( info ) => {
	const {
		version,
		isPremium,
		hasPro,
		licenseActiveNonce,
		adminUrl = '',
		pluginUrl = '',
	} = info;

	const proSuffix = isPremium ? ' Pro' : '';

	return {
		name: `StreamCast${ proSuffix }`,
		displayName: `StreamCast${ proSuffix } - Live Radio Streaming Player`,
		description:
			'A simple, accessible, user-friendly and fully customizable radio player for WordPress. You can play iceCast, Shoutcast, Radionomy, Radiojar, RadioCo Live stream in WordPress website using shortcode.',
		slug,
		version,
		isPremium,
		hasPro,
		adminUrl,
		displayOurPlugins: true,
		media: {
			logo: `https://ps.w.org/${ slug }/assets/icon-128x128.png`,
			banner: `https://ps.w.org/${ slug }/assets/banner-772x250.png`,
			thumbnail: `${ pluginUrl }assets/overview.svg`,
		},
		pages: {
			org: `https://wordpress.org/plugins/${ slug }/`,
			landing: `https://bplugins.com/products/${ slug }/`,
			docs: `https://bplugins.com/docs/${ slug }/`,
			pricing: `https://bplugins.com/products/${ slug }/pricing`,
		},
		freemius: {
			product_id: '6433',
			plan_id: '10492',
			public_key: 'pk_a19d159db561c020210345da466f1',
		},
		licenseActiveNonce,
		startButton: {
			label: 'Start Now',
			url: `post-new.php?post_type=streamcast`,
		},
	};
};

export const welcomeInfo = ( adminUrl ) => {
	const base = adminUrl ? adminUrl.replace( /\/+$/, '' ) : '';
	return {
		keywords: [ 'Radio', 'Live', 'Stream', 'Shoutcast', 'Icecast' ],
		keywordsLabel: 'Features',
		gettingStarted: {
			tabs: [
				{
					key: 'gutenberg',
					label: 'Gutenberg',
					icon: gutenbergTabIcon,
					steps: [
						{
							num: 1,
							title: 'Add the StreamCast Block',
							body: 'Open the block editor on any page or post. Click the <strong>+</strong> icon in the top-left corner or type <strong>/StreamCast</strong> to find and insert the StreamCast Block.',
							link: {
								url: `${ base }/post-new.php?post_type=page`,
								label: 'Open Editor',
							},
						},
						{
							num: 2,
							title: 'Configure Block Settings',
							body: 'Select the block to open settings in the sidebar. Enter your live stream URL, select stream provider, skin, custom colors, and artwork.',
						},
						{
							num: 3,
							title: 'Publish Page',
							body: 'Publish the page when ready. Your visitors can now play your live radio stream directly from your site.',
						},
					],
				},
				{
					key: 'shortcode',
					label: 'ShortCode',
					icon: shortcodeTabIcon,
					steps: [
						{
							num: 1,
							title: 'Copy StreamCast Shortcode',
							body: 'You can use the shortcode anywhere on your site: <code>[stream url="YOUR_STREAM_URL"]</code>. Customize options like background color by adding attributes.',
						},
						{
							num: 2,
							title: 'Paste Shortcode',
							body: 'Paste the shortcode into any post, page, widget, or page builder template.',
						},
					],
				},
			],
		},
		changelogs: [
			{
				version: '2.4.7 - 26 October 2026',
				type: 'update',
				list: [
					'Security: Completed the SSRF fix from 2.4.6 (CVE-2026-62030).',
					'Fixed: Restored now-playing metadata for streams on ports like 8000.',
				],
			},
			{
				version: '2.4.6 - 15 October 2026',
				type: 'update',
				list: [
					'Fixed: Server-Side Request Forgery (SSRF) vulnerability in the stream metadata AJAX endpoint.',
				],
			},
			{
				version: '2.4.5 - 25 August 2026',
				type: 'update',
				list: [
					'New: Added a "Where It Plays" panel to the classic editor side column, showing the native block and every page builder the shortcode works in, with one-click shortcode copy.',
					'New: Added a Pro panel to the side column listing the settings the free build keeps locked, so it is clear what an upgrade unlocks without hunting through the form.',
					'Update: Made the radio player edit screen easier to work with — the shortcode and placement options are now beside Save instead of buried in the configuration form.',
				],
			},
		],
		changelogsLimit: 3,
		changelogsReadMoreLabel: 'View More Changelogs',
		proFeatures: [
			__(
				'Customize You Player with some awesome options',
				'streamcast'
			),
			__(
				'Enhance your player using 85+ radio player skins.',
				'streamcast'
			),
			__(
				'Works great with Shoutcast, Icecast, and other compatible streaming servers.',
				'streamcast'
			),
			__(
				'This plugin creates ShortCode for Each radio. So that you can play radio anywhere without coding.',
				'streamcast'
			),
			__(
				'Collect Stream Name or Title or Artist Name from you streaming name.',
				'streamcast'
			),
			__(
				'Alignment your player like left, center, right.',
				'streamcast'
			),
			__(
				'Set image for player background, player poster or art image.',
				'streamcast'
			),
		],
	};
};

export const demoInfo = {
	allInOneLabel: 'See All Demos',
	allInOneLink: 'https://wpradioplayer.com/demo/all-radio-player/',
	demos: [
		{
			icon: '',
			title: 'Minimal Player (Default)',
			type: 'iframe',
			url: 'https://wpradioplayer.com/demo/demo-6-minimal-default/',
		},
		{
			icon: '',
			title: 'Standard Player Skins (80+ Skins)',
			type: 'image',
			url: 'https://i.ibb.co.com/nsgPvyzT/bg.png',
		},
		{
			icon: '',
			title: 'Ultimate Player (Customized)',
			type: 'iframe',
			url: 'https://wpradioplayer.com/demo/demo-1-ultimate-default/',
		},
		{
			icon: '',
			title: 'Ultimate Bittersweet Theme',
			type: 'iframe',
			url: 'https://wpradioplayer.com/demo/demo-2-ultimate-bittersweet-theme/',
		},
		{
			icon: '',
			title: 'Ultimate Lightsea Green Theme',
			type: 'iframe',
			url: 'https://wpradioplayer.com/demo/demo-3-ultimate-lightsea-green-theme/',
		},
		{
			icon: '',
			title: 'Ultimate Custom Color',
			type: 'iframe',
			url: 'https://wpradioplayer.com/demo/demo-4-ultimate-custom-color/',
		},
		{
			icon: '',
			title: 'Ultimate Icecast Station',
			type: 'iframe',
			url: 'https://wpradioplayer.com/demo/demo-5-ultimate-icecast-station/',
		},
		{
			icon: '',
			title: 'Advanced Default',
			type: 'iframe',
			url: 'https://wpradioplayer.com/demo/demo-7-advanced-default/',
		},
		{
			icon: '',
			title: 'Advanced Custom Color & Align Right',
			type: 'iframe',
			url: 'https://wpradioplayer.com/demo/demo-8-advanced-custom-color-and-align-right/',
		},
		{
			icon: '',
			title: 'EchoPlayer',
			description: '',
			type: 'iframe',
			url: 'https://wpradioplayer.com/demo/demo-13/',
		},
		{
			icon: '',
			title: 'AuroraPlay',
			type: 'iframe',
			url: 'https://wpradioplayer.com/demo/demo-14-aurora-play/',
		},
		{
			icon: '',
			title: 'Wooden Player',
			type: 'iframe',
			url: 'https://wpradioplayer.com/demo/demo-15-wooden-player/',
		},
	],
};

export const pricingInfo = {
	logo: `https://ps.w.org/${ slug }/assets/icon-128x128.png`, // Optional
	pluginId: 6433,
	planId: 10492,
	licenses: [ 1, 3, null ],
	button: {
		label: 'Buy Now ➜',
	},
	featured: {
		selected: 3, // choose from licenses item
	},
};
