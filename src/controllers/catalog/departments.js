import { getCoursesByDepartment } from '../../models/catalog/catalog.js';

// Route handler for the departments page
const departmentsPage = (req, res) => {
    const departments = getCoursesByDepartment();

    res.render('departments', {
        title: 'Courses by Department',
        departments: departments
    });
};

export { departmentsPage };