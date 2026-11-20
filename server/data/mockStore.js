const day = (offset) => new Date(Date.now() - offset * 86400000).toISOString();

const initialPapers = [
  {
    id: "paper-attention",
    title: "Attention Is All You Need",
    authors: "Ashish Vaswani, Noam Shazeer, Niki Parmar et al.",
    year: 2017,
    domain: "Machine Learning",
    abstract:
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. This work proposes a new simple network architecture based solely on attention mechanisms.",
    venue: "NeurIPS",
    url: "https://doi.org/10.48550/arXiv.1706.03762",
    dateAdded: day(2),
  },
  {
    id: "paper-biodiversity",
    title: "Global patterns of terrestrial biodiversity",
    authors: "Harold J. Newbold, Lawrence N. Hudson et al.",
    year: 2023,
    domain: "Ecology",
    abstract:
      "A cross-biome synthesis of local biodiversity responses to land use and related pressures.",
    venue: "Nature Ecology & Evolution",
    url: "https://doi.org/10.1038/example",
    dateAdded: day(6),
  },
  {
    id: "paper-cities",
    title: "The social life of urban public space",
    authors: "Mina K. Patel, Rowan Clarke",
    year: 2024,
    domain: "Urban Studies",
    abstract:
      "An observational study of how design decisions influence informal interaction across shared city spaces.",
    venue: "Journal of Urban Design",
    url: "",
    dateAdded: day(12),
  },
];

const initialNotes = [
  {
    id: "note-transformer",
    title: "Transformer architecture — key claims",
    content:
      "Self-attention removes recurrence and makes the model significantly more parallelizable. Revisit the positional encoding ablation before literature review.",
    paperId: "paper-attention",
    createdAt: day(1),
    modifiedAt: day(1),
  },
  {
    id: "note-fieldwork",
    title: "Fieldwork sampling questions",
    content:
      "How do we distinguish temporary occupancy from sustained use? Consider three observation windows per location.",
    paperId: "paper-cities",
    createdAt: day(4),
    modifiedAt: day(3),
  },
  {
    id: "note-reading",
    title: "Reading group: biodiversity measures",
    content:
      "Compare species richness against abundance-based intactness. The latter may be more responsive to land-use intensity.",
    paperId: "paper-biodiversity",
    createdAt: day(8),
    modifiedAt: day(5),
  },
];

const initialProjects = [
  {
    id: "project-thesis",
    name: "Thesis literature synthesis",
    description: "Map foundational and recent work on efficient sequence models.",
    category: "Dissertation",
    status: "In Progress",
    createdAt: day(30),
  },
  {
    id: "project-urban",
    name: "Urban commons field study",
    description: "Document patterns of informal activity in three neighborhood plazas.",
    category: "Field Research",
    status: "Planning",
    createdAt: day(18),
  },
  {
    id: "project-review",
    name: "Biodiversity metric review",
    description: "Compare methods used to estimate local ecological intactness.",
    category: "Literature Review",
    status: "Completed",
    createdAt: day(52),
  },
];

const initialExperiments = [
  {
    id: "experiment-baseline",
    title: "Baseline sequence classifier",
    description: "Establish a reproducible recurrent baseline for comparison.",
    methodology: "Train a two-layer BiLSTM across five fixed random seeds.",
    observations:
      "Convergence is stable after epoch 12; variance is concentrated in minority classes.",
    results: "Macro F1: 0.78 ± 0.02.",
    projectId: "project-thesis",
    recordedAt: day(3),
  },
  {
    id: "experiment-observation",
    title: "Pilot observation protocol",
    description: "Test the field observation rubric at one study site.",
    methodology: "Two researchers independently coded activity at 15-minute intervals.",
    observations: "Ambiguity arose between passing through and short informal stays.",
    results: "Inter-rater agreement: 82%. Rubric revision required.",
    projectId: "project-urban",
    recordedAt: day(7),
  },
];

// In-memory data store instance
let store = {
  papers: JSON.parse(JSON.stringify(initialPapers)),
  notes: JSON.parse(JSON.stringify(initialNotes)),
  projects: JSON.parse(JSON.stringify(initialProjects)),
  experiments: JSON.parse(JSON.stringify(initialExperiments)),
};

export const mockStore = {
  // Papers
  getPapers: () => [...store.papers],
  getPaperById: (id) => store.papers.find((p) => p.id === id),
  createPaper: (paper) => {
    store.papers.unshift(paper);
    return paper;
  },
  updatePaper: (id, update) => {
    const index = store.papers.findIndex((p) => p.id === id);
    if (index === -1) return null;
    store.papers[index] = { ...store.papers[index], ...update, id };
    return store.papers[index];
  },
  deletePaper: (id) => {
    const exists = store.papers.some((p) => p.id === id);
    if (!exists) return false;
    store.papers = store.papers.filter((p) => p.id !== id);
    // Unlink notes referencing this paper
    store.notes = store.notes.map((n) => (n.paperId === id ? { ...n, paperId: "" } : n));
    return true;
  },

  // Notes
  getNotes: () => [...store.notes],
  getNoteById: (id) => store.notes.find((n) => n.id === id),
  createNote: (note) => {
    store.notes.unshift(note);
    return note;
  },
  updateNote: (id, update) => {
    const index = store.notes.findIndex((n) => n.id === id);
    if (index === -1) return null;
    store.notes[index] = { ...store.notes[index], ...update, id, modifiedAt: new Date().toISOString() };
    return store.notes[index];
  },
  deleteNote: (id) => {
    const exists = store.notes.some((n) => n.id === id);
    if (!exists) return false;
    store.notes = store.notes.filter((n) => n.id !== id);
    return true;
  },

  // Projects
  getProjects: () => [...store.projects],
  getProjectById: (id) => store.projects.find((p) => p.id === id),
  createProject: (project) => {
    store.projects.unshift(project);
    return project;
  },
  updateProject: (id, update) => {
    const index = store.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;
    store.projects[index] = { ...store.projects[index], ...update, id };
    return store.projects[index];
  },
  deleteProject: (id) => {
    const exists = store.projects.some((p) => p.id === id);
    if (!exists) return false;
    store.projects = store.projects.filter((p) => p.id !== id);
    // Unlink experiments referencing this project
    store.experiments = store.experiments.map((e) => (e.projectId === id ? { ...e, projectId: "" } : e));
    return true;
  },

  // Experiments
  getExperiments: () => [...store.experiments],
  getExperimentById: (id) => store.experiments.find((e) => e.id === id),
  createExperiment: (exp) => {
    store.experiments.unshift(exp);
    return exp;
  },
  updateExperiment: (id, update) => {
    const index = store.experiments.findIndex((e) => e.id === id);
    if (index === -1) return null;
    store.experiments[index] = { ...store.experiments[index], ...update, id };
    return store.experiments[index];
  },
  deleteExperiment: (id) => {
    const exists = store.experiments.some((e) => e.id === id);
    if (!exists) return false;
    store.experiments = store.experiments.filter((e) => e.id !== id);
    return true;
  },

  // Reset
  resetStore: () => {
    store = {
      papers: JSON.parse(JSON.stringify(initialPapers)),
      notes: JSON.parse(JSON.stringify(initialNotes)),
      projects: JSON.parse(JSON.stringify(initialProjects)),
      experiments: JSON.parse(JSON.stringify(initialExperiments)),
    };
    return store;
  },

  getEntireStore: () => store,
};

