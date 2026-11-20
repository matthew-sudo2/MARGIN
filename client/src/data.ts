export type Paper = {
  id: string;
  title: string;
  authors: string;
  year: number;
  domain: string;
  abstract: string;
  venue: string;
  url: string;
  dateAdded: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  paperId: string;
  createdAt: string;
  modifiedAt: string;
};

export type ProjectStatus = "Planning" | "In Progress" | "Completed";
export type Project = {
  id: string;
  name: string;
  description: string;
  category: string;
  status: ProjectStatus;
  createdAt: string;
};

export type Experiment = {
  id: string;
  title: string;
  description: string;
  methodology: string;
  observations: string;
  results: string;
  projectId: string;
  recordedAt: string;
};

export type WorkspaceData = {
  papers: Paper[];
  notes: Note[];
  projects: Project[];
  experiments: Experiment[];
};

const STORAGE_KEY = "margin-workspace-v1";
const day = (offset: number) => new Date(Date.now() - offset * 86400000).toISOString();

export const demoData = (): WorkspaceData => ({
  papers: [
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
  ],
  notes: [
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
  ],
  projects: [
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
  ],
  experiments: [
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
  ],
});

export function loadData(): WorkspaceData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as WorkspaceData;
  } catch {
    // Fall back to demo data when storage is unavailable or malformed.
  }
  const data = demoData();
  saveData(data);
  return data;
}

export function saveData(data: WorkspaceData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetData() {
  const data = demoData();
  saveData(data);
  return data;
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
