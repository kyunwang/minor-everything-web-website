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
		test: $$('.program__description'),
	};

	const app = {
		observer: null,
		init() {
			// console.log(nodes.originalProgram);
			// console.log(nodes.allSubjects);

			this.initEvents();
		},
		initEvents() {
			this.initQuestions();
			this.initIntersection();
		},
		initIntersection() {
			const options = {
				root: null,
				// rootMargin: '10% 0px 0px 0px',
			};

			const cb = (entries, observer) => {
				// console.dir(entries[0].isIntersecting);
				// console.log(this);
				if (watchers.shouldUpdate) {
					this.sortProgram();
				}
			};

			this.observer = new IntersectionObserver(cb, options);
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
		sortProgram() {
			const items = nodes.allPrograms.map(node => node.querySelectorAll('li'));
			// console.log(items);
			console.log(nodes.programSections);

			// TODO: Check performance
			items.forEach((item, index) => {
				this.getSelectedPrograms(item, index);
			});
		},
		getSelectedPrograms(item, index) {
			item.forEach(subject => {
				if (subject.classList.contains('selected')) {
					// subject.dataset.programSections = 'interest';
					console.log('subject', subject.dataset);

					// this.assignSection();
					nodes.allPrograms[index].dataset.programSections = 'interest';
				}
			});
		},
		assignSection(program) {
			nodes.allPrograms.forEach(program => {
				console.log('program', program.dataset);
				// }
			});
		},
	};

	app.init();
})();
