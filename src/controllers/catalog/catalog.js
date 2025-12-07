import { getAllCourses, getCourseById, getSortedSections, getFilteredCourses } from '../../models/catalog/catalog.js';

// Route handler for the course catalog list page
const catalogPage = (req, res) => {
    const hasFilters = req.query.credits || req.query.professor || req.query.department;

    let courses;
    let appliedFilters = {};

    if (hasFilters) {
        // Get filtered courses
        appliedFilters = {
            credits: req.query.credits || '',
            professor: req.query.professor || '',
            department: req.query.department || ''
        };
        courses = getFilteredCourses(appliedFilters);
    } else {
        // Get all courses
        courses = getAllCourses();
    }

    res.render('catalog', {
        title: 'Course Catalog',
        courses: courses,
        filters: appliedFilters
    });



    // const courses = getAllCourses();

    // res.render('catalog', {
    //     title: 'Course Catalog',
    //     courses: courses
    // });
};

// Route handler for individual course detail pages
const courseDetailPage = (req, res, next) => {
    const courseId = req.params.courseId;
    const course = getCourseById(courseId);

    // If course doesn't exist, create 404 error
    if (!course) {
        const err = new Error(`Course ${courseId} not found`);
        err.status = 404;
        return next(err);
    }

    // Handle sorting if requested
    const sortBy = req.query.sort || 'time';
    const sortedSections = getSortedSections(course.sections, sortBy);

    res.render('course-detail', {
        title: `${course.id} - ${course.title}`,
        course: { ...course, sections: sortedSections },
        currentSort: sortBy
    });
};

export { catalogPage, courseDetailPage };