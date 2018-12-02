import '../styles/index.scss';

const courses = {
	cctr: [],
	wafs: [],
	bt: [],
	pm: [],
	rtw: [],
	wd: [],
};

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
		programSections: ['love', 'interest', 'neutral'],
	};

	const watchers = {
		shouldUpdate: false,
	};

	const nodes = {
		originalProgram: document.getElementById('p-program'),
		allPrograms: $$(`[data-program]`),
		allSubjects: $$(`[data-subject]`),
		programs: $$(`[data-program-sections]`),
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
			// addEvents(nodes.question1, 'change', function(e) {
			// 	console.log(e.target.value);
			// 	$$([`data-subject=${e.target.value}`]);
			// });
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
						// all 3 selected
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
		sortProgram() {
			const items = nodes.allPrograms.map(node => node.querySelectorAll('li'));
			const selectedAmounts = items.map(item => {
				const arrItem = Array.from(item);

				return arrItem.reduce((accumulator, currentValue) => {
					if (currentValue.classList.contains('selected')) return accumulator + 1;
					return accumulator;
				}, 0);
			});
			const assignedSections = this.getAssignedSections(items);

			// TODO: Check performance
			items.forEach((item, index) => {
				item.forEach(subject => {
					if (subject.classList.contains('selected')) {
						nodes.allPrograms[index].dataset.programs =
							CONSTANTS.programSections[assignedSections[index]];
					}
				});
			});
		},
	};

	app.init();
})();
