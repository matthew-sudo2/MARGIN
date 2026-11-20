import type { Experiment, Note, Paper, Project, WorkspaceData } from "../data";
import { demoData, loadData as loadLocalData, saveData as saveLocalData } from "../data";

const API_BASE = "/api";

// Check backend connectivity
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchWorkspaceData(): Promise<{ data: WorkspaceData; isBackendConnected: boolean }> {
  try {
    const [papersRes, notesRes, projectsRes, experimentsRes] = await Promise.all([
      fetch(`${API_BASE}/papers`),
      fetch(`${API_BASE}/notes`),
      fetch(`${API_BASE}/projects`),
      fetch(`${API_BASE}/experiments`),
    ]);

    if (papersRes.ok && notesRes.ok && projectsRes.ok && experimentsRes.ok) {
      const papers = await papersRes.json();
      const notes = await notesRes.json();
      const projects = await projectsRes.json();
      const experiments = await experimentsRes.json();

      const backendData: WorkspaceData = {
        papers: Array.isArray(papers) ? papers : [],
        notes: Array.isArray(notes) ? notes : [],
        projects: Array.isArray(projects) ? projects : [],
        experiments: Array.isArray(experiments) ? experiments : [],
      };

      // Also keep local storage cache updated
      saveLocalData(backendData);
      return { data: backendData, isBackendConnected: true };
    }
  } catch (err) {
    console.warn("Backend unavailable, using local client storage:", err);
  }

  return { data: loadLocalData(), isBackendConnected: false };
}

// Papers API
export async function apiCreatePaper(paper: Paper): Promise<Paper> {
  try {
    const res = await fetch(`${API_BASE}/papers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paper),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Failed to create paper on backend, falling back to local:", err);
  }
  return paper;
}

export async function apiUpdatePaper(id: string, paper: Paper): Promise<Paper> {
  try {
    const res = await fetch(`${API_BASE}/papers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paper),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Failed to update paper on backend, falling back to local:", err);
  }
  return paper;
}

export async function apiDeletePaper(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/papers/${id}`, { method: "DELETE" });
    return res.ok;
  } catch (err) {
    console.warn("Failed to delete paper on backend:", err);
    return false;
  }
}

// Notes API
export async function apiCreateNote(note: Note): Promise<Note> {
  try {
    const res = await fetch(`${API_BASE}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Failed to create note on backend:", err);
  }
  return note;
}

export async function apiUpdateNote(id: string, note: Note): Promise<Note> {
  try {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Failed to update note on backend:", err);
  }
  return note;
}

export async function apiDeleteNote(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/notes/${id}`, { method: "DELETE" });
    return res.ok;
  } catch (err) {
    console.warn("Failed to delete note on backend:", err);
    return false;
  }
}

// Projects API
export async function apiCreateProject(project: Project): Promise<Project> {
  try {
    const res = await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Failed to create project on backend:", err);
  }
  return project;
}

export async function apiUpdateProject(id: string, project: Project): Promise<Project> {
  try {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Failed to update project on backend:", err);
  }
  return project;
}

export async function apiDeleteProject(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/projects/${id}`, { method: "DELETE" });
    return res.ok;
  } catch (err) {
    console.warn("Failed to delete project on backend:", err);
    return false;
  }
}

// Experiments API
export async function apiCreateExperiment(experiment: Experiment): Promise<Experiment> {
  try {
    const res = await fetch(`${API_BASE}/experiments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(experiment),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Failed to create experiment on backend:", err);
  }
  return experiment;
}

export async function apiUpdateExperiment(id: string, experiment: Experiment): Promise<Experiment> {
  try {
    const res = await fetch(`${API_BASE}/experiments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(experiment),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Failed to update experiment on backend:", err);
  }
  return experiment;
}

export async function apiDeleteExperiment(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/experiments/${id}`, { method: "DELETE" });
    return res.ok;
  } catch (err) {
    console.warn("Failed to delete experiment on backend:", err);
    return false;
  }
}

// Reset API
export async function apiResetWorkspace(): Promise<WorkspaceData> {
  try {
    const res = await fetch(`${API_BASE}/reset`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      saveLocalData(data);
      return data;
    }
  } catch (err) {
    console.warn("Backend reset failed, using local reset:", err);
  }
  const reset = demoData();
  saveLocalData(reset);
  return reset;
}

