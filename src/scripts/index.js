import '../styles/index.scss';

const initialCSS = `
/* This is the container of the question. There are a few CSS custom properties but you can just use  whatever you want */
.quiz__to-style {
}

.quiz__to-style p {
	font-family: futura, sans-serif;
}
`;

const completeCSS = `
/* This is how it is styled */
.quiz__to-style {
	/* padding-left: var(--indent-1); */
}

.quiz__to-style li {
	font-family: var(--font-secondary);
	font-size: var(--font-content);
	margin-bottom: 1.6rem;
}

.quiz__to-style > ul {
	display: flex;
	flex-direction: column;
	position: relative;
}

.quiz__to-style p {
	font-family: var(--font-primary);
	font-weight: 700;
	font-size: calc(1rem + 1vw);
	line-height: 1.4;
	margin-bottom: 1.6rem;
}

.quiz__to-style input {
	position: absolute;
	opacity: 0;
}

.quiz__to-style input ~ label {
	cursor: pointer;
}

.quiz__to-style input ~ label span {
	position: relative;
	display: inline-block;
	background: var(--yellow);
	margin-right: -0.6rem;
	border-radius: 50%;
	padding: 1rem;
	vertical-align: middle;
	z-index: -1;
}

.quiz__to-style input ~ label span::before {
	content: '';
	position: absolute;
	left: 0;
	top: 16.7%;
	height: calc(100% * (2 / 3));
	width: calc(100% * (2 / 3));
	border-radius: inherit;
	background: var(--grey-dark);
	opacity: 0;
	transform: scale(0) translateX(0);
	transition-property: opacity, width, height, transform;
	transition-duration: var(--anim-time-primary);
	transition-timing-function: var(--anim-cubic-primary);
}

.quiz__to-style input ~ label:hover span::before {
	opacity: 1;
	transform: scale(0.5) translateX(-24%);
}

.quiz__to-style input:checked ~ label span::before {
	opacity: 1;
	transform: scale(1) translateX(-24%);
}

.quiz__to-style input:focus ~ label span::before {
	opacity: 1;
	transform: scale(0.5) translateX(-24%);
}

.quiz__to-style [type='radio'] ~ label::before {
	content: '';
	display: flex;
	align-items: center;
	position: absolute;
	bottom: -8rem;
	left: 0;
	font-family: var(--font-primary);
	font-weight: 700;
	height: 6rem;
	width: 34rem;
	background-image: url('./src/assets/test_feedback.svg');
	background-position: left center;
	background-size: 6rem;
	background-repeat: no-repeat;
	background-color: var(--yellow);
	border-radius: 4rem;
	padding-left: 7.2rem;
	padding-right: 1.6rem;
	opacity: 0;
	pointer-events: none;
	transition-property: max-width, opacity;
	transition-duration: var(--anim-time-primary);
	transition-timing-function: var(--anim-cubic-primary);
}
`;

function $(selector) {
	return document.querySelector(selector);
}

function $$(selector) {
	return Array.from(document.querySelectorAll(selector));
}

function addEvents(elementArr, event, cb) {
	elementArr.forEach(element => element.addEventListener(event, cb));
}

function removeHTMLTags(element) {
	return element.innerHTML.replace(/\<.*?\>/g, '');
}

(function() {
	const CONSTANTS = {
		programSectionLabels: ['love', 'interest', 'neutral'],
	};

	const watchers = {
		shouldUpdate: false,
		debounceTimeout: null,
	};

	const nodes = {
		originalProgram: document.getElementById('p-program'),
		allPrograms: $$(`[data-program]`),
		allSubjects: $$(`[data-subject]`),
		programSections: $$(`[data-program-sections]`),
		question1: $$(`[name="question-1"]`),
		question2: $$(`[name="question-2"]`),
		question3: $$(`[name="question-3"]`),
		codeEditor: $('#code-editor'),
		editorStyle: $('#editor-style'),
		quizMenu: $$('.quiz__menu button'),
	};

	const app = {
		observer: null,
		init() {
			this.initEvents();
		},
		initEvents() {
			this.initQuestions();
			this.initIntersection();
			this.initCSSEditor();
			this.initQuizMenu();
		},
		initIntersection() {
			const cb = (entries, observer) => {
				if (watchers.shouldUpdate) {
					this.sortProgram();
				}
			};

			this.observer = new IntersectionObserver(cb);
			this.observer.observe(nodes.originalProgram);
		},
		initQuestions() {
			addEvents(nodes.question2, 'change', function(e) {
				const subjects = $$(`[data-subject="${e.target.value}"]`);
				subjects.forEach(function(subject) {
					subject.classList.toggle('selected');
				});

				watchers.shouldUpdate = true;
			});
		},
		initCSSEditor() {
			const { codeEditor, editorStyle } = nodes;

			codeEditor.innerHTML += editorStyle.innerHTML;

			codeEditor.addEventListener('keyup', () => {
				clearTimeout(watchers.debounceTimeout);
				watchers.debounceTimeout = setTimeout(() => {
					editorStyle.innerHTML = '';
					editorStyle.innerHTML += removeHTMLTags(codeEditor);
				}, 700);
			});
		},
		initQuizMenu() {
			const { codeEditor, editorStyle } = nodes;

			nodes.quizMenu[0].addEventListener('click', () => {
				codeEditor.innerHTML = initialCSS;
				editorStyle.innerHTML = initialCSS;
			});
			nodes.quizMenu[1].addEventListener('click', () => {
				codeEditor.innerHTML = completeCSS;
				editorStyle.innerHTML = completeCSS;
			});
		},
		getAssignedSections(items) {
			const selectedAmounts = items.map(item => {
				const arrItem = Array.from(item);

				return arrItem.reduce((accumulator, currentValue) => {
					if (currentValue.classList.contains('selected')) return accumulator + 1;
					return accumulator;
				}, 0);
			});

			const assignedSections = selectedAmounts.map((num, index) => {
				const len = items[index].length;
				switch (len % num) {
					case 0:
						return 0; // love
					case 1:
						return 1; // interest
					case 2:
						return 2; // neutral
					default:
						return 2;
				}
			});

			return assignedSections;
		},
		checkSections(assignedSections) {
			// Simple reset
			nodes.programSections.forEach(section => {
				section.classList.remove('show');
			});

			if (assignedSections.includes(0)) {
				nodes.programSections[0].classList.add('show');
			}
			if (assignedSections.includes(1)) {
				nodes.programSections[1].classList.add('show');
			}
			if (assignedSections.includes(2)) {
				nodes.programSections[2].classList.add('show');
			}
		},
		sortProgram() {
			const items = nodes.allPrograms.map(node => node.querySelectorAll('li'));
			const assignedSections = this.getAssignedSections(items);

			this.checkSections(assignedSections);

			// TODO: Check performance
			items.forEach((item, index) => {
				item.forEach(subject => {
					if (subject.classList.contains('selected')) {
						nodes.allPrograms[index].dataset.programs =
							CONSTANTS.programSectionLabels[assignedSections[index]];
					}
				});
			});
		},
	};

	app.init();
})();
