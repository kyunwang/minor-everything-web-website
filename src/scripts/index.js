import '../styles/index.scss';

function $(selector) {
	return document.querySelector(selector);
}

function $$(selector) {
	return Array.from(document.querySelectorAll(selector));
}

function addEvents(elementArr, event, cb) {
	elementArr.forEach(element => element.addEventListener(event, cb));
}

(function() {
	const CONSTANTS = {
		programSectionLabels: ['love', 'interest', 'neutral'],
	};

	const watchers = {
		shouldUpdate: false,
	};

	const nodes = {
		originalProgram: document.getElementById('p-program'),
		allPrograms: $$(`[data-program]`),
		allSubjects: $$(`[data-subject]`),
		programSections: $$(`[data-program-sections]`),
		question1: $$(`[name="question-1"]`),
		question2: $$(`[name="question-2"]`),
		question3: $$(`[name="question-3"]`),
	};

	const app = {
		observer: null,
		init() {
			this.initEvents();
		},
		initEvents() {
			this.initQuestions();
			this.initIntersection();
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
