let dummyLiveProjects = [
  { _id: '1', title: 'E-commerce Microservices App', category: 'Backend Engineering', sponsor: 'Acme Corp', type: 'Group', stipend: 'Unpaid', participants: 120, status: 'Active', deadline: 'Dec 15, 2026' },
  { _id: '2', title: 'AI-Powered Chat Interface', category: 'Frontend / UI', sponsor: 'TechFlow', type: 'Individual', stipend: '15,000 INR', participants: 85, status: 'Completed', deadline: 'Oct 10, 2026' }
];

export const getDummyProjects = async (req, res) => {
  res.json({ success: true, data: dummyLiveProjects });
};

export const getDummyProjectById = async (req, res) => {
  const project = dummyLiveProjects.find(p => p._id === req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, data: project });
};

export const createDummyProject = async (req, res) => {
  const newProject = {
    _id: Date.now().toString(),
    status: 'Open',
    ...req.body
  };
  dummyLiveProjects.push(newProject);
  res.status(201).json({ success: true, message: 'Live Project Created Successfully', data: newProject });
};
