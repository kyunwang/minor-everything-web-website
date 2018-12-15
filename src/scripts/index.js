import '../styles/index.scss';

// import hljs from 'highlight.js';
import hljs from 'highlight.js/lib/highlight';
import css from 'highlight.js/lib/languages/css';
hljs.registerLanguage('css', css);

const initialCSS = `

/* TIP: Use the devtools */
/* GOAL: Style the question like the questions below or however you like*/

.quiz__to-style {
  /* This is the container of the question */
}

.quiz__to-style p {
}
`;

const completeCSS = `
/* This is how it is styled like the questions below */

.quiz__to-style {
  padding-left: var(--indent-1);
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

.quiz__to-style li {
  font-family: var(--font-secondary);
  font-size: var(--font-content);
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

.quiz__to-style input:focus ~ label span::before {
  opacity: 1;
  transform: scale(0.5) translateX(-24%);
}

.quiz__to-style input:checked ~ label span::before {
  opacity: 1;
  transform: scale(1) translateX(-24%);
}

.quiz__to-style input ~ label:hover span::before {
  opacity: 1;
  transform: scale(0.5) translateX(-24%);
}

.quiz__to-style input ~ label::before {
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

/* This is how it is styled like the questions below */
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

function addObserver(element, cb, options = {}) {
	const observer = new IntersectionObserver(cb, options);
	observer.observe(element);
}

(function() {
	const CONSTANTS = {
		programSectionLabels: ['love', 'interest', 'neutral'],
	};

	const watchers = {
		shouldUpdate: false,
		debounceTimeout: null,
		currentCharacter: 0,
	};

	const nodes = {
		mainSections: $$('body > div > section'),
		menuItems: $$('.menu__container a'),
		originalProgram: document.getElementById('p-program'),
		allPrograms: $$(`[data-program]`),
		allSubjects: $$(`[data-subject]`),
		programSections: $$(`[data-program-sections]`),
		question1: $$(`[name="question-1"]`),
		question2: $$(`[name="question-2"]`),
		question3: $$(`[name="question-3"]`),
		question1AsideContainer: $('.quiz__question-1 aside'),
		question2Container: $('.quiz__question-2'),
		codeEditorContainer: $('.quiz__editor-container'),
		codeEditor: $('#code-editor'),
		editorStyle: $('#editor-style'),
		quizMenuButtons: $$('.quiz__menu button'),
		quizModal: $('.quiz__editor-modal'),
	};

	const app = {
		// observer: null,
		init() {
			this.initEvents();

			// Only necessaty for the editor
			document.body.classList.remove('no-js');
		},
		initEvents() {
			this.initMenu();
			this.initIntersection();
			this.initQuizMenu();
			this.initQuestions();
			this.initQuizModal();
			this.initCSSEditor();
			this.initQuizMenu();
		},
		initMenu() {
			const { mainSections } = nodes;
			const options = {
				rootMargin: '-10% 0px ',
			};

			const removeActive = index => {
				nodes.menuItems[index - 1].classList.remove('active');
			};

			const cb = (entries, obs) => {
				if (entries[0].isIntersecting) {
					mainSections.forEach((element, index) => {
						if (index === 0) return;
						const target = entries[0].target;
						if (element === target) {
							nodes.menuItems[index - 1].classList.add('active');
						} else {
							removeActive(index);
						}
					});
				}
			};

			mainSections.forEach((element, index) => {
				if (index === 0) return;
				addObserver(element, cb, options);
			});
		},
		initIntersection() {
			const cb = () => {
				if (watchers.shouldUpdate) {
					this.sortProgram();
				}
			};

			addObserver(nodes.originalProgram, cb);
		},
		initQuestions() {
			this.initQuestion2();
		},
		initQuestion2() {
			const { question2, question2Container } = nodes;
			addEvents(question2, 'change', function(e) {
				const subjects = $$(`[data-subject="${e.target.value}"]`);

				// Toggle subjects in program section
				subjects.forEach(function(subject) {
					subject.classList.toggle('selected');
				});

				// Toggle feedback
				const amountChecked = question2.filter(
					question => question.checked === true
				).length;

				// quickest according to: https://stackoverflow.com/a/12259830
				if (3 > amountChecked) {
					question2Container.classList.remove('show-feedback-1');
				} else if (9 <= amountChecked) {
					question2Container.classList.remove('show-feedback-3');
					question2Container.classList.add('show-feedback-3');
				} else if (6 <= amountChecked) {
					question2Container.classList.remove('show-feedback-3');
					question2Container.classList.add('show-feedback-2');
				} else if (3 <= amountChecked) {
					question2Container.classList.remove('show-feedback-3');
					question2Container.classList.add('show-feedback-1');
				}

				watchers.shouldUpdate = true;
			});
		},
		initQuizModal() {
			const {
				quizModal,
				codeEditorContainer,
				question1Container,
				question1AsideContainer,
			} = nodes;

			const modalButtons = quizModal.querySelectorAll('button');
			const openEditorButton = $('#button-open-editor');

			// Hide modal and show closed quiz editor
			// quizModal[0]
			modalButtons[0].addEventListener('click', () => {
				quizModal.classList.add('hide--vertical');
				question1AsideContainer.classList.add('closed');
			});

			modalButtons[1].addEventListener('click', () => {
				quizModal.classList.add('hide--vertical');
				codeEditorContainer.classList.remove('hide--vertical');
			});

			openEditorButton.addEventListener('click', () => {
				codeEditorContainer.classList.remove('hide--vertical');
				question1AsideContainer.classList.remove('closed');
			});
		},
		initCSSEditor() {
			const { codeEditor, editorStyle } = nodes;

			codeEditor.innerHTML += editorStyle.innerHTML;

			hljs.highlightBlock(codeEditor);

			codeEditor.addEventListener('keyup', event => {
				clearTimeout(watchers.debounceTimeout);

				if (event.keyCode === 221) {
					hljs.highlightBlock(codeEditor);
				}

				watchers.debounceTimeout = setTimeout(() => {
					editorStyle.innerHTML = '';
					editorStyle.innerHTML += removeHTMLTags(codeEditor);
				}, 700);
			});
		},
		initQuizMenu() {
			const {
				codeEditor,
				editorStyle,
				quizMenuButtons,
				question1AsideContainer,
				codeEditorContainer,
			} = nodes;

			quizMenuButtons[0].addEventListener('click', () => {
				watchers.currentCharacter = 0;
				codeEditor.innerHTML = initialCSS;
				editorStyle.innerHTML = initialCSS;
				hljs.highlightBlock(codeEditor);
			});

			quizMenuButtons[1].addEventListener('click', () => {
				watchers.currentCharacter = 0;
				codeEditor.innerHTML = '';
				editorStyle.innerHTML = '';
				this.typewriterAnimation();
			});

			quizMenuButtons[2].addEventListener('click', () => {
				question1AsideContainer.classList.add('closed');
				codeEditorContainer.classList.add('hide--vertical');
			});
		},
		typewriterAnimation() {
			const { editorStyle, codeEditor } = nodes;

			setTimeout(() => {
				editorStyle.innerHTML += completeCSS[watchers.currentCharacter];
				codeEditor.innerHTML += completeCSS[watchers.currentCharacter];
				watchers.currentCharacter++;
				codeEditor.scrollTop = codeEditor.scrollHeight;

				if (watchers.currentCharacter < completeCSS.length) {
					if (completeCSS[watchers.currentCharacter] === '}') {
						hljs.highlightBlock(codeEditor);
					}
					this.typewriterAnimation();
				}
			}, 10);
		},
		getAssignedSections(items) {
			const selectedAmounts = items.map(item => {
				const arrItem = Array.from(item);

				return arrItem.reduce((accumulator, currentValue) => {
					if (currentValue.classList.contains('selected'))
						return accumulator + 1;
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
