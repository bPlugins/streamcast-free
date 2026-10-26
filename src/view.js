/* StreamCast - Source code available at https://github.com/taninrahman21/streamcast-free */
import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import StreamCast from './Components/Frontend/StreamCast';

document.addEventListener('DOMContentLoaded', () => {
	const streamCastBlockEls = document.querySelectorAll('.wp-block-scb-streamcast-block');
	streamCastBlockEls.forEach(streamCastBlockEl => {
		if (!streamCastBlockEl.dataset.attributes) {
			return;
		}
		const attributes = JSON.parse(streamCastBlockEl.dataset.attributes);

		createRoot(streamCastBlockEl).render(<>
			<Style attributes={attributes} id={streamCastBlockEl.id} />

			<StreamCast attributes={attributes} id={streamCastBlockEl.id} />
		</>);

		streamCastBlockEl?.removeAttribute('data-attributes');
	});
});