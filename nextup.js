/**
 * NextUp - Your Meeting. On Schedule.
 * Modernized with ES6+ JavaScript
 */

// Internationalization support
const Lang = window.Lang || {};

function _(str) {
	return Lang[str] || str;
}

// Main NextUp Application
class NextUpApp {
	constructor() {
		this.helpEnabled = true;
		this.counter = null;
		this.initializeElements();
	}

	initializeElements() {
		// Form elements
		this.appForm = this.createElement('form', {
			id: 'nextup-form',
			onsubmit: (e) => e.preventDefault()
		});

		this.formMeetingName = this.createElement('input', {
			id: 'meeting-name',
			type: 'text',
			value: _('Name Your Meeting')
		});

		this.formMeetingTopics = this.createElement('ol', { id: 'meeting-topics' });
		this.formNewRow = this.createElement('li');

		this.formNewTopic = this.createElement('input', {
			type: 'text',
			className: 'topic',
			value: _('Topic')
		});

		this.formNewTime = this.createElement('input', {
			type: 'text',
			className: 'time',
			value: _('Time')
		});

		this.formActions = this.createElement('div', { id: 'form-actions' });

		this.formAddTopic = this.createElement('button', {
			id: 'add-topic',
			textContent: _('Add Another Topic'),
			onclick: () => this.addTopic()
		});

		this.formCreateMeeting = this.createElement('button', {
			id: 'create-meeting',
			textContent: _('Create Agenda'),
			onclick: () => this.createMeeting()
		});

		this.formTooltip = this.createElement('div', { id: 'form-tooltip' });
		const tooltipSpan = this.createElement('span');
		this.formTooltip.appendChild(tooltipSpan);
		this.formTooltip.style.display = 'none';

		// Build form structure
		this.formNewRow.appendChild(this.formNewTopic.cloneNode(true));
		this.formNewRow.appendChild(this.formNewTime.cloneNode(true));

		this.formActions.appendChild(this.formAddTopic);
		this.formActions.appendChild(this.formCreateMeeting);

		this.appForm.appendChild(this.formMeetingName);
		this.appForm.appendChild(this.formMeetingTopics);
		this.appForm.appendChild(this.formActions);
		this.appForm.appendChild(this.formTooltip);

		// Add event listeners to meeting name input
		this.formMeetingName.addEventListener('focus', () => {
			this.focus(_('Name Your Meeting'), this.formMeetingName);
		});

		this.formMeetingName.addEventListener('blur', () => {
			this.blur(_('Name Your Meeting'), this.formMeetingName);
		});

		// Countdown/Agenda elements
		this.appCountdown = this.createElement('div', { id: 'meeting' });
		this.agendaTitle = this.createElement('h2');
		this.agendaActions = this.createElement('div', { id: 'agenda-actions' });

		this.agendaStart = this.createElement('button', {
			id: 'start-meeting',
			textContent: _('Start The Meeting'),
			onclick: () => this.startMeeting()
		});

		this.agendaList = this.createElement('ol', { id: 'agenda-items' });

		this.agendaActions.appendChild(this.agendaStart);
		this.appCountdown.appendChild(this.agendaTitle);
		this.appCountdown.appendChild(this.agendaActions);
		this.appCountdown.appendChild(this.agendaList);
	}

	createElement(tag, props = {}) {
		const element = document.createElement(tag);
		Object.entries(props).forEach(([key, value]) => {
			if (key === 'textContent') {
				element.textContent = value;
			} else if (key === 'className') {
				element.className = value;
			} else if (key.startsWith('on')) {
				element.addEventListener(key.substring(2), value);
			} else {
				element[key] = value;
			}
		});
		return element;
	}

	addTopic() {
		const newRow = this.formNewRow.cloneNode(true);

		// Add event listeners to inputs in the new row
		const topicInput = newRow.querySelector('.topic');
		const timeInput = newRow.querySelector('.time');

		topicInput.addEventListener('focus', (e) => {
			this.focus(_('Topic'), e.target);
		});

		topicInput.addEventListener('blur', (e) => {
			this.blur(_('Topic'), e.target);
		});

		timeInput.addEventListener('focus', (e) => {
			this.focus(_('Time'), e.target, _('mm:ss'));
		});

		timeInput.addEventListener('blur', (e) => {
			this.blur(_('Time'), e.target);
		});

		this.formMeetingTopics.appendChild(newRow);
		return this;
	}

	focus(defaultValue, target, msg = null) {
		if (defaultValue === target.value) {
			target.value = '';
		}
		target.style.color = '#444';

		if (this.helpEnabled && msg) {
			const rect = target.getBoundingClientRect();
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

			this.formTooltip.style.top = `${rect.top + scrollTop + 1}px`;
			this.formTooltip.style.left = `${rect.left + scrollLeft + target.offsetWidth + 5}px`;
			this.formTooltip.style.display = 'block';
			this.formTooltip.querySelector('span').textContent = msg;
		}
	}

	blur(defaultValue, target) {
		if (target.value === '' || target.value === defaultValue) {
			target.style.color = '#cbdf90';
			target.value = defaultValue;
		}
		this.formTooltip.style.display = 'none';
	}

	addAgendaItem(topic, time) {
		const li = this.createElement('li');
		const topicSpan = this.createElement('span', {
			className: 'topic',
			textContent: topic
		});
		const timeSpan = this.createElement('span', {
			className: 'time',
			textContent: time
		});

		li.appendChild(topicSpan);
		li.appendChild(timeSpan);
		this.agendaList.appendChild(li);
	}

	createMeeting() {
		let meetingTitle = this.formMeetingName.value;

		if (meetingTitle === _('Name Your Meeting') || meetingTitle === '') {
			meetingTitle = _('Agenda');
		}

		document.title = `${meetingTitle} - ${document.title}`;
		this.agendaTitle.textContent = meetingTitle;

		const topics = this.formMeetingTopics.querySelectorAll('li');
		topics.forEach(li => {
			const topic = li.querySelector('.topic').value;
			const time = li.querySelector('.time').value;

			if (topic !== _('Topic') && topic !== '' &&
				time !== _('Time') && time !== '') {
				this.addAgendaItem(topic, time);
			}
		});

		const app = document.getElementById('nextup-app');
		app.innerHTML = '';
		app.appendChild(this.appCountdown);
	}

	startMeeting() {
		const firstItem = this.agendaList.querySelector('li:first-child');
		if (firstItem) {
			firstItem.classList.add('active');
		}

		this.agendaActions.remove();
		this.counter = setInterval(() => this.countdown(), 1000);
	}

	countdown() {
		const allItems = this.agendaList.querySelectorAll('li');

		if (allItems.length === 0) {
			clearInterval(this.counter);
			this.endOfMeeting();
			return;
		}

		const current = allItems[0];
		current.classList.add('active');

		const timeSpan = current.querySelector('.time');
		const timeText = timeSpan.textContent;
		const left = this.timeToSeconds(timeText) - 1;

		timeSpan.textContent = this.secondsToTime(left);

		if (left === 0) {
			current.style.transition = 'opacity 0.9s';
			current.style.opacity = '0';

			setTimeout(() => {
				const firstChild = this.agendaList.querySelector('li:first-child');
				if (firstChild && firstChild.style.opacity === '0') {
					firstChild.remove();
				}
			}, 900);
		}

		if (left < 15) {
			current.classList.add('less-than-15');
			current.classList.remove('less-than-60');
		} else if (left < 60) {
			current.classList.add('less-than-60');
		}
	}

	timeToSeconds(time) {
		const parts = time.split(':');
		let seconds = 0;

		switch (parts.length) {
			case 3:
				seconds = 3600 * parseInt(parts[0], 10) +
						  60 * parseInt(parts[1], 10) +
						  parseInt(parts[2], 10);
				break;
			case 2:
				seconds = 60 * parseInt(parts[0], 10) +
						  parseInt(parts[1], 10);
				break;
			case 1:
			default:
				seconds = parseInt(parts[0], 10);
		}

		return seconds;
	}

	secondsToTime(seconds) {
		const s = seconds % 60;
		const minutes = (seconds - s) / 60;

		let hours = 0;
		let m = minutes;

		if (minutes >= 60) {
			m = minutes % 60;
			hours = (minutes - m) / 60;
		}

		if (hours) {
			const sStr = s < 10 ? `0${s}` : String(s);
			const mStr = m < 10 ? `0${m}` : String(m);
			return `${hours}:${mStr}:${sStr}`;
		} else if (m) {
			const sStr = s < 10 ? `0${s}` : String(s);
			return `${m}:${sStr}`;
		} else {
			return String(s);
		}
	}

	endOfMeeting() {
		const overText = this.createElement('h2', {
			textContent: _("Meeting's Over!")
		});

		const overAction = this.createElement('div', { id: 'over-actions' });
		const overReload = this.createElement('button', {
			id: 'over-reload',
			textContent: _('Start Again?'),
			onclick: () => window.location.reload()
		});

		overAction.appendChild(overReload);

		const app = document.getElementById('nextup-app');
		app.appendChild(overText);
		app.appendChild(overAction);
	}

	load() {
		// Add initial two rows
		this.addTopic();
		this.addTopic();

		const app = document.getElementById('nextup-app');
		app.innerHTML = '';
		app.appendChild(this.appForm);

		// Add reload link event listener
		const reloadLink = document.getElementById('reload-link');
		if (reloadLink) {
			reloadLink.addEventListener('click', (e) => {
				e.preventDefault();
				window.location.reload();
			});
		}
	}
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		const app = new NextUpApp();
		app.load();
	});
} else {
	const app = new NextUpApp();
	app.load();
}
