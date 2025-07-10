document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menu-button');
  const navList = document.querySelector('.nav-list');
  menuButton.addEventListener('click', () => {
    navList.classList.toggle('active');
    menuButton.setAttribute(
      'aria-expanded',
      navList.classList.contains('active') ? 'true' : 'false'
    );
  });
});

// 



// This script manages the course list and dynamically updates the UI based on user interactions.

const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
        technology: [
            'HTML',
            'CSS'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
        technology: [
            'C#'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: false
    }
];


// This script dynamically renders the courses on the page.
// It filters courses based on the subject and displays them in a list format.
const coursesContainer = document.getElementById('courses-list');

// Function to render courses
function renderCourses(courseList) {
    coursesContainer.innerHTML = '';
    const creditsValue = document.getElementById('filtered-total-credits-value');
    const coursesCompleted = document.getElementById('completed-courses');
    const coursesNotCompleted = document.getElementById('not-completed-courses');

    // Count completed and not completed courses
    const coursesCompletedCount = courseList.filter(course => course.completed).length;
    const coursesNotCompletedCount = courseList.filter(course => !course.completed).length; 
    const totalCredits = courseList.reduce((sum, course) => sum + course.credits, 0);


    // Update the counts in the UI
    coursesCompleted.textContent = `${coursesCompletedCount}`;
    coursesNotCompleted.textContent = `${coursesNotCompletedCount}`;
    creditsValue.textContent = `${totalCredits}`;

    if (courseList.length === 0) {
        coursesContainer.textContent = 'No courses found.';
        return;
    }
    courseList.forEach(course => {
        const courseDiv = document.createElement('div');
        courseDiv.className = 'course';
        courseDiv.innerHTML = `
            <h3>${course.subject} ${course.number}</h3>

        `;
        coursesContainer.appendChild(courseDiv);
    });

    
    


}

// Event listeners for buttons
document.getElementById('all-courses').addEventListener('click', () => {
    renderCourses(courses);
});
document.getElementById('wdd-courses').addEventListener('click', () => {
    renderCourses(courses.filter(course => course.subject === 'WDD'));
});
document.getElementById('cse-courses').addEventListener('click', () => {
    renderCourses(courses.filter(course => course.subject === 'CSE'));
});





// This script updates the footer with the last modified date and current year.
const lastModified = document.querySelector('#last-modified');

lastModified.textContent = `${document.lastModified}`;
const currentYear = new Date().getFullYear();
const yearElement = document.querySelector('#current-year');
yearElement.textContent = currentYear;
