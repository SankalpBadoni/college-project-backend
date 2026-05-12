let dummyLiveCourses = [
  { _id: '1', title: 'Advanced System Design Cohort', type: 'live_course', enrolled: 25, status: 'Enrolling', startDate: 'Nov 1, 2026' }
];

export const getDummyLiveCourses = async (req, res) => {
  res.json({ success: true, data: dummyLiveCourses });
};

export const createDummyLiveCourse = async (req, res) => {
  const newCourse = {
    _id: Date.now().toString(),
    type: 'live_course',
    title: req.body.title || 'New Live Course',
    description: req.body.description || 'Description',
    status: 'Enrolling',
    ...req.body
  };
  dummyLiveCourses.push(newCourse);
  res.status(201).json({ success: true, message: 'Live Course Created Successfully', data: newCourse });
};
