import { getFacultyById, getSortedFaculty } from '../../models/faculty/faculty.js';

// Route handler for the course catalog list page
const facultyListPage = (req, res) => {
    // Get sort parameter from query string, default to 'department'
    const sortBy = req.query.sort || 'department';
    
    // Get sorted faculty
    const facultyList = getSortedFaculty(sortBy);

    res.render('faculty/list', {
        title: 'Faculty Directory',
        faculty: facultyList,  // Make sure this matches the variable name in your EJS
        currentSort: sortBy
    });
};
const facultyDetailPage = (req, res, next) => {
    const facultyId = req.params.facultyId;

    const member = getFacultyById(facultyId);

    if (!member) {
        const err = new Error(`Faculty member ${facultyId} not found`);
        err.status = 404;
        return next(err);
    }


    res.render('faculty/detail', {
        title: `${member.name}`,
        member: member
    });
};

export { facultyListPage, facultyDetailPage };