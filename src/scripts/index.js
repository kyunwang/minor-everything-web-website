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
	return document.querySelectorAll(selector);
}

function addEvents(elementArr, event, cb) {
	elementArr.forEach(element => element.addEventListener(event, cb));
}

function init() {
	let answers = [];

	const nodes = {
		originalProgram: document.getElementById('p-program'),
		allCourses: $$(`[data-course]`),
		allSubjects: $$(`[data-subject]`),
		question1: $$(`[name="question-1"]`),
		question2: $$(`[name="question-2"]`),
		question3: $$(`[name="question-3"]`),
	};

	const app = {
		observer: null,
		init() {
			// console.log(nodes.originalProgram);
			console.log(nodes.allSubjects);
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

			function cb(entries, observer) {
				console.dir(entries[0].isIntersecting);
			}

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
			});
		},
	};

	app.init();
}

init();
