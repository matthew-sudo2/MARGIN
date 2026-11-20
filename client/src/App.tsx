import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  Beaker,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Compass,
  CircleDot,
  Clock3,
  ExternalLink,
  FileText,
  FlaskConical,
  FolderKanban,
  LayoutDashboard,
  Library,
  Menu,
  MoreHorizontal,
  NotebookPen,
  Pencil,
  Plus,
  RotateCcw,
  SearchX,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import {
  ConfirmDialog,
  dateLabel,
  EmptyState,
  Field,
  fieldClass,
  Modal,
  SearchInput,
  Select,
  Toast,
  truncate,
} from "./components";
import {
  createId,
  loadData,
  resetData,
  saveData,
  type Experiment,
  type Note,
  type Paper,
  type Project,
  type ProjectStatus,
  type WorkspaceData,
} from "./data";
import {
  apiCreateExperiment,
  apiCreateNote,
  apiCreatePaper,
  apiCreateProject,
  apiDeleteExperiment,
  apiDeleteNote,
  apiDeletePaper,
  apiDeleteProject,
  apiResetWorkspace,
  apiUpdateExperiment,
  apiUpdateNote,
  apiUpdatePaper,
  apiUpdateProject,
  fetchWorkspaceData,
} from "./api/api";
import ExplorePage from "./ExplorePage";

type Page = "Overview" | "Library" | "Explore" | "Notes" | "Projects" | "Experiments" | "Settings";
type Entity = "paper" | "note" | "project" | "experiment";
type Dialog = { mode: "add" | "edit" | "view"; entity: Entity; id?: string } | null;

const navItems: { name: Page; icon: typeof LayoutDashboard }[] = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Library", icon: Library },
  { name: "Explore", icon: Compass },
  { name: "Notes", icon: NotebookPen },
  { name: "Projects", icon: FolderKanban },
  { name: "Experiments", icon: FlaskConical },
];

const pageCopy: Record<Page, { eyebrow: string; description: string }> = {
  Overview: {
    eyebrow: "Research workspace",
    description: "A clear view of the work taking shape across your research.",
  },
  Library: {
    eyebrow: "Source collection",
    description: "Collect, annotate, and return to the literature that grounds your work.",
  },
  Explore: {
    eyebrow: "Research discovery",
    description: "Search saved papers and browse by research area.",
  },
  Notes: {
    eyebrow: "Working knowledge",
    description: "Capture interpretations, questions, and connections while they are fresh.",
  },
  Projects: {
    eyebrow: "Research portfolio",
    description: "Keep each line of inquiry moving from early framing to completion.",
  },
  Experiments: {
    eyebrow: "Research log",
    description: "Record methods, observations, and results in one traceable history.",
  },
  Settings: {
    eyebrow: "Workspace controls",
    description: "Manage local data and understand how your workspace is stored.",
  },
};

const entityLabels: Record<Entity, string> = {
  paper: "paper",
  note: "note",
  project: "project",
  experiment: "experiment",
};

export default function App() {
  const [data, setData] = useState<WorkspaceData>(() => loadData());
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [page, setPage] = useState<Page>("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [deleting, setDeleting] = useState<{ entity: Entity; id: string; name: string } | null>(
    null,
  );
  const [toast, setToast] = useState("");

  // Sync with Express backend on mount
  useEffect(() => {
    fetchWorkspaceData().then(({ data: initialData, isBackendConnected }) => {
      setData(initialData);
      setBackendOnline(isBackendConnected);
    });

    const hash = window.location.hash.toLowerCase();
    if (hash === "#library") setPage("Library");
    else if (hash === "#explore") setPage("Explore");
    else if (hash === "#notes") setPage("Notes");
    else if (hash === "#projects") setPage("Projects");
    else if (hash === "#experiments") setPage("Experiments");
    else if (hash === "#settings") setPage("Settings");
    else if (hash === "#add-paper") {
      setPage("Library");
      setDialog({ mode: "add", entity: "paper" });
    }
  }, []);

  useEffect(() => saveData(data), [data]);
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const notify = (message: string) => setToast(message);
  const navigate = (destination: Page) => {
    setPage(destination);
    setSidebarOpen(false);
  };
  const openAdd = (entity: Entity) => setDialog({ mode: "add", entity });
  const openView = (entity: Entity, id: string) => setDialog({ mode: "view", entity, id });
  const openEdit = (entity: Entity, id: string) => setDialog({ mode: "edit", entity, id });
  const askDelete = (entity: Entity, id: string, name: string) => setDeleting({ entity, id, name });

  async function removeRecord() {
    if (!deleting) return;
    const { entity, id } = deleting;
    const keys: Record<Entity, keyof WorkspaceData> = {
      paper: "papers",
      note: "notes",
      project: "projects",
      experiment: "experiments",
    };
    const key = keys[entity];
    setData((current) => {
      const next = { ...current };
      if (key === "papers") {
        next.papers = current.papers.filter((item) => item.id !== id);
        next.notes = current.notes.map((note) =>
          note.paperId === id ? { ...note, paperId: "" } : note,
        );
      } else if (key === "projects") {
        next.projects = current.projects.filter((item) => item.id !== id);
        next.experiments = current.experiments.map((experiment) =>
          experiment.projectId === id ? { ...experiment, projectId: "" } : experiment,
        );
      } else if (key === "notes") {
        next.notes = current.notes.filter((item) => item.id !== id);
      } else {
        next.experiments = current.experiments.filter((item) => item.id !== id);
      }
      return next;
    });
    setDialog(null);
    notify(
      `${entityLabels[entity][0].toUpperCase()}${entityLabels[entity].slice(1)} deleted`,
    );
    setDeleting(null);

    // Sync deletion to backend
    try {
      if (entity === "paper") await apiDeletePaper(id);
      else if (entity === "note") await apiDeleteNote(id);
      else if (entity === "project") await apiDeleteProject(id);
      else if (entity === "experiment") await apiDeleteExperiment(id);
    } catch (e) {
      console.warn("Backend deletion error:", e);
    }
  }

  const shared = { data, openAdd, openView, openEdit, askDelete, navigate };

  return (
    <div className="min-h-screen bg-[#efede4] text-[#292d29]">
      <Sidebar
        page={page}
        open={sidebarOpen}
        backendOnline={backendOnline}
        onNavigate={navigate}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="min-h-screen lg:ml-[252px]">
        <header className="flex h-16 items-center justify-between border-b border-[#d9d7cd] bg-[#f3f1e9]/90 px-4 backdrop-blur lg:hidden">
          <button
            className="icon-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <Wordmark compact />
          <div className="w-9" />
        </header>
        <div className="mx-auto max-w-[1480px] px-4 py-7 sm:px-7 sm:py-9 xl:px-11 xl:py-11">
          <PageHeader page={page} onAdd={openAdd} />
          {page === "Overview" && <Overview {...shared} />}
          {page === "Library" && <LibraryPage {...shared} />}
          {page === "Explore" && (
            <ExplorePage papers={data.papers} onOpenPaper={(id) => openView("paper", id)} />
          )}
          {page === "Notes" && <NotesPage {...shared} />}
          {page === "Projects" && <ProjectsPage {...shared} />}
          {page === "Experiments" && <ExperimentsPage {...shared} />}
          {page === "Settings" && (
            <SettingsPage
              data={data}
              backendOnline={backendOnline}
              onReset={async () => {
                const reset = await apiResetWorkspace();
                setData(reset);
                notify("Demo workspace restored");
              }}
            />
          )}
        </div>
      </main>

      {dialog && (
        <EntityDialog
          dialog={dialog}
          data={data}
          onClose={() => setDialog(null)}
          onEdit={(entity, id) => setDialog({ mode: "edit", entity, id })}
          onDelete={askDelete}
          onSave={async (entity, item, isNew) => {
            const key = (
              {
                paper: "papers",
                note: "notes",
                project: "projects",
                experiment: "experiments",
              } as const
            )[entity];
            setData((current) => ({
              ...current,
              [key]: isNew
                ? [...current[key], item]
                : current[key].map((entry) => (entry.id === item.id ? item : entry)),
            }));
            setDialog(null);
            notify(
              `${entityLabels[entity][0].toUpperCase()}${entityLabels[entity].slice(1)} ${isNew ? "added" : "updated"}`,
            );

            // Sync with Express backend
            try {
              if (entity === "paper") {
                if (isNew) await apiCreatePaper(item as Paper);
                else await apiUpdatePaper(item.id, item as Paper);
              } else if (entity === "note") {
                if (isNew) await apiCreateNote(item as Note);
                else await apiUpdateNote(item.id, item as Note);
              } else if (entity === "project") {
                if (isNew) await apiCreateProject(item as Project);
                else await apiUpdateProject(item.id, item as Project);
              } else if (entity === "experiment") {
                if (isNew) await apiCreateExperiment(item as Experiment);
                else await apiUpdateExperiment(item.id, item as Experiment);
              }
            } catch (err) {
              console.warn("Backend sync failed on save:", err);
            }
          }}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title={`Delete ${entityLabels[deleting.entity]}?`}
          message={`“${deleting.name}” will be removed from this workspace. This cannot be undone.${deleting.entity === "paper" || deleting.entity === "project" ? " Linked records will be kept, but their link will be cleared." : ""}`}
          onCancel={() => setDeleting(null)}
          onConfirm={removeRecord}
        />
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}

function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3d4938] text-[#f5f1e5] shadow-[inset_0_1px_rgba(255,255,255,.16)]">
        <span className="font-serif text-lg italic">M</span>
      </div>
      {!compact && (
        <span className="font-serif text-[19px] tracking-[0.18em] text-[#273027]">MARGIN</span>
      )}
    </div>
  );
}

function Sidebar({
  page,
  open,
  backendOnline,
  onNavigate,
  onClose,
}: {
  page: Page;
  open: boolean;
  backendOnline: boolean | null;
  onNavigate: (page: Page) => void;
  onClose: () => void;
}) {
  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-30 bg-[#20241f]/35 lg:hidden"
          aria-label="Close menu"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col border-r border-[#d2d1c7] bg-[#e7e5dc] px-4 py-5 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-2">
          <Wordmark />
          <button className="icon-button lg:hidden" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-lg border border-[#cfd2c6] bg-[#f0eee6] px-3 py-2 text-[11px] font-medium text-[#4c5549]">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${
              backendOnline === true
                ? "bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.6)]"
                : backendOnline === false
                  ? "bg-amber-600"
                  : "bg-gray-400 animate-pulse"
            }`}
          />
          <span className="truncate">
            {backendOnline === true
              ? "MERN API Connected"
              : backendOnline === false
                ? "Standalone (Local)"
                : "Checking API..."}
          </span>
        </div>

        <div className="mt-8 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a8d84]">
          Workspace
        </div>
        <nav className="mt-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = page === item.name;
            return (
              <button
                key={item.name}
                className={`group flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[14px] font-medium transition ${
                  active
                    ? "bg-[#d7dacd] text-[#394535] shadow-[inset_0_1px_2px_rgba(60,70,54,.12)]"
                    : "text-[#60655e] hover:bg-[#deddd4] hover:text-[#333a33]"
                }`}
                onClick={() => onNavigate(item.name)}
              >
                <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
                <span>{item.name}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#5e6e53]" />}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-[#d1d0c6] pt-4">
          <button
            className={`flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[14px] font-medium transition ${
              page === "Settings"
                ? "bg-[#d7dacd] text-[#394535] shadow-[inset_0_1px_2px_rgba(60,70,54,.12)]"
                : "text-[#60655e] hover:bg-[#deddd4]"
            }`}
            onClick={() => onNavigate("Settings")}
          >
            <Settings size={17} />
            Settings
          </button>
          <div className="mt-4 px-3 text-[10px] leading-4 text-[#8a8d84]">
            Your research stays in this browser.
          </div>
        </div>
      </aside>
    </>
  );
}

function PageHeader({ page, onAdd }: { page: Page; onAdd: (entity: Entity) => void }) {
  const entity: Entity | undefined =
    page === "Library"
      ? "paper"
      : page === "Notes"
        ? "note"
        : page === "Projects"
          ? "project"
          : page === "Experiments"
            ? "experiment"
            : undefined;
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#76806d]">
          {pageCopy[page].eyebrow}
        </p>
        <h1 className="font-serif text-[34px] leading-none tracking-[-0.025em] text-[#262c26] sm:text-[42px]">
          {page}
        </h1>
        <p className="mt-3 max-w-xl text-[14px] leading-6 text-[#71766e]">
          {pageCopy[page].description}
        </p>
      </div>
      {entity && (
        <button
          className="button-primary shrink-0 self-start sm:self-auto"
          onClick={() => onAdd(entity)}
        >
          <Plus size={16} />
          Add {entity}
        </button>
      )}
    </div>
  );
}

type SharedPageProps = {
  data: WorkspaceData;
  openAdd: (entity: Entity) => void;
  openView: (entity: Entity, id: string) => void;
  openEdit: (entity: Entity, id: string) => void;
  askDelete: (entity: Entity, id: string, name: string) => void;
  navigate: (page: Page) => void;
};

function Overview({ data, openAdd, openView, navigate }: SharedPageProps) {
  const activeProjects = data.projects.filter((project) => project.status === "In Progress").length;
  const stats = [
    { label: "Papers", value: data.papers.length, icon: BookOpen, page: "Library" as Page },
    { label: "Notes", value: data.notes.length, icon: NotebookPen, page: "Notes" as Page },
    {
      label: "Active projects",
      value: activeProjects,
      icon: FolderKanban,
      page: "Projects" as Page,
    },
    {
      label: "Experiments",
      value: data.experiments.length,
      icon: Beaker,
      page: "Experiments" as Page,
    },
  ];
  const recentPapers = [...data.papers]
    .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
    .slice(0, 3);
  const recentNotes = [...data.notes]
    .sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt))
    .slice(0, 3);
  const activity = [
    ...data.papers.map((item) => ({
      type: "Paper added",
      title: item.title,
      date: item.dateAdded,
      icon: BookOpen,
    })),
    ...data.notes.map((item) => ({
      type: "Note updated",
      title: item.title,
      date: item.modifiedAt,
      icon: FileText,
    })),
    ...data.experiments.map((item) => ({
      type: "Experiment recorded",
      title: item.title,
      date: item.recordedAt,
      icon: FlaskConical,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.label}
              onClick={() => navigate(stat.page)}
              className="surface group flex min-h-32 flex-col justify-between p-5 text-left hover:-translate-y-0.5 hover:border-[#c4c8bb] hover:shadow-[0_9px_25px_rgba(48,54,45,.08)]"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-lg border border-[#d6d7cd] bg-[#e9e8df] p-2 text-[#5e6c54]">
                  <Icon size={17} />
                </span>
                <ArrowRight
                  size={16}
                  className="text-[#999c94] transition-transform group-hover:translate-x-0.5 group-hover:text-[#5e6c54]"
                />
              </div>
              <div>
                <div className="font-serif text-[32px] leading-none text-[#2c332c]">
                  {stat.value}
                </div>
                <div className="mt-1.5 text-[12px] font-medium text-[#747970]">{stat.label}</div>
              </div>
            </button>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="surface overflow-hidden">
          <SectionTitle
            title="Recently added papers"
            action="View library"
            onClick={() => navigate("Library")}
          />
          {recentPapers.length ? (
            <div className="divide-y divide-[#dfded5]">
              {recentPapers.map((paper) => (
                <button
                  key={paper.id}
                  onClick={() => openView("paper", paper.id)}
                  className="group flex w-full items-start gap-4 px-5 py-4 text-left hover:bg-[#eeece4] sm:px-6"
                >
                  <div className="mt-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#dbdad1] bg-[#ecebe3] text-[#69745f] sm:flex">
                    <BookOpen size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[14px] font-semibold text-[#333933] group-hover:text-[#4f6048]">
                      {paper.title}
                    </h3>
                    <p className="mt-1 truncate text-[12px] text-[#777c73]">{paper.authors}</p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8a8e85]">
                      <span>{paper.domain}</span>
                      <span>·</span>
                      <span>{paper.year}</span>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="mt-2 text-[#a1a39c] group-hover:text-[#596650]"
                  />
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<BookOpen size={22} />}
              title="No papers yet"
              description="Begin your library with the first source in your reading list."
              action={
                <button className="button-secondary" onClick={() => openAdd("paper")}>
                  Add paper
                </button>
              }
            />
          )}
        </div>

        <div className="surface overflow-hidden">
          <SectionTitle
            title="Recent activity"
            action="All work"
            onClick={() => navigate("Projects")}
          />
          {activity.length ? (
            <div className="px-5 pb-3 sm:px-6">
              {activity.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={`${item.type}-${item.title}`} className="relative flex gap-3.5 py-3">
                    {index < activity.length - 1 && (
                      <span className="absolute left-[15px] top-10 h-[calc(100%-24px)] w-px bg-[#d7d7cd]" />
                    )}
                    <span className="z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d6d7cd] bg-[#ebeae2] text-[#66715d]">
                      <Icon size={14} />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-[11px] font-semibold text-[#6c7467]">{item.type}</p>
                      <p className="mt-0.5 truncate text-[13px] text-[#363b36]">{item.title}</p>
                      <p className="mt-1 text-[10px] text-[#92958e]">{dateLabel(item.date)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={<Activity size={22} />}
              title="No activity yet"
              description="Your recent work will appear here."
            />
          )}
        </div>
      </section>

      <section className="surface overflow-hidden">
        <SectionTitle title="Working notes" action="View notes" onClick={() => navigate("Notes")} />
        {recentNotes.length ? (
          <div className="grid divide-y divide-[#dfded5] md:grid-cols-3 md:divide-x md:divide-y-0">
            {recentNotes.map((note) => (
              <button
                key={note.id}
                className="group p-5 text-left hover:bg-[#eeece4] sm:p-6"
                onClick={() => openView("note", note.id)}
              >
                <div className="mb-4 flex items-center justify-between text-[#747b6e]">
                  <FileText size={16} />
                  <span className="text-[10px]">{dateLabel(note.modifiedAt)}</span>
                </div>
                <h3 className="text-sm font-semibold text-[#333933] group-hover:text-[#52604b]">
                  {note.title}
                </h3>
                <p className="mt-2 text-[12px] leading-5 text-[#777c73]">
                  {truncate(note.content, 105)}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<NotebookPen size={22} />}
            title="No notes yet"
            description="Capture your first research thought."
          />
        )}
      </section>
    </div>
  );
}

function SectionTitle({
  title,
  action,
  onClick,
}: {
  title: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#deddd4] px-5 py-4 sm:px-6">
      <h2 className="font-serif text-[18px] text-[#303630]">{title}</h2>
      <button className="text-link" onClick={onClick}>
        {action} <ArrowRight size={13} />
      </button>
    </div>
  );
}

function ModuleToolbar({
  search,
  onSearch,
  children,
  count,
}: {
  search: string;
  onSearch: (value: string) => void;
  children?: ReactNode;
  count: number;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#dcdbd2] p-4 sm:flex-row sm:items-center">
      <SearchInput value={search} onChange={onSearch} placeholder="Search this collection…" />
      <div className="flex gap-2 overflow-x-auto">{children}</div>
      <span className="shrink-0 text-[11px] font-medium text-[#858981]">
        {count} {count === 1 ? "record" : "records"}
      </span>
    </div>
  );
}

function LibraryPage({ data, openAdd, openView, openEdit, askDelete }: SharedPageProps) {
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("All domains");
  const [sort, setSort] = useState("Newest");
  const domains = [...new Set(data.papers.map((paper) => paper.domain))].sort();
  const papers = useMemo(() => {
    const query = search.toLowerCase();
    return data.papers
      .filter(
        (paper) =>
          (domain === "All domains" || paper.domain === domain) &&
          [paper.title, paper.authors, paper.abstract, paper.venue].some((value) =>
            value.toLowerCase().includes(query),
          ),
      )
      .sort((a, b) =>
        sort === "Newest"
          ? b.dateAdded.localeCompare(a.dateAdded)
          : sort === "Oldest"
            ? a.dateAdded.localeCompare(b.dateAdded)
            : a.title.localeCompare(b.title),
      );
  }, [data.papers, domain, search, sort]);
  return (
    <div className="surface overflow-hidden">
      <ModuleToolbar search={search} onSearch={setSearch} count={papers.length}>
        <Select label="Filter by domain" value={domain} onChange={setDomain}>
          <option>All domains</option>
          {domains.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
        <Select label="Sort papers" value={sort} onChange={setSort}>
          <option>Newest</option>
          <option>Oldest</option>
          <option>Title A–Z</option>
        </Select>
      </ModuleToolbar>
      {papers.length ? (
        <div className="divide-y divide-[#dfded5]">
          {papers.map((paper) => (
            <article key={paper.id} className="group px-4 py-5 hover:bg-[#eeece4] sm:px-6">
              <div className="flex gap-4">
                <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d8d8cf] bg-[#e9e8df] text-[#66725c] sm:flex">
                  <BookOpen size={18} />
                </div>
                <button
                  className="min-w-0 flex-1 text-left"
                  onClick={() => openView("paper", paper.id)}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-[15px] font-semibold text-[#313731] group-hover:text-[#4d5f46]">
                      {paper.title}
                    </h2>
                    <span className="tag">{paper.domain}</span>
                  </div>
                  <p className="mt-1.5 text-[12px] text-[#747a71]">
                    {paper.authors} · {paper.year}
                  </p>
                  <p className="mt-3 max-w-4xl text-[13px] leading-5 text-[#666c64]">
                    {truncate(paper.abstract, 190)}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] font-medium uppercase tracking-[0.07em] text-[#8a8e86]">
                    <span>{paper.venue || "Venue not set"}</span>
                    <span>Added {dateLabel(paper.dateAdded)}</span>
                  </div>
                </button>
                <RowActions
                  onView={() => openView("paper", paper.id)}
                  onEdit={() => openEdit("paper", paper.id)}
                  onDelete={() => askDelete("paper", paper.id, paper.title)}
                />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={search || domain !== "All domains" ? <SearchX size={23} /> : <BookOpen size={23} />}
          title={
            search || domain !== "All domains" ? "No matching papers" : "Your library is ready"
          }
          description={
            search || domain !== "All domains"
              ? "Try changing your search or domain filter."
              : "Add papers to build a durable research collection."
          }
          action={
            !search && domain === "All domains" ? (
              <button className="button-primary" onClick={() => openAdd("paper")}>
                <Plus size={15} /> Add paper
              </button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}

function NotesPage({ data, openAdd, openView, openEdit, askDelete }: SharedPageProps) {
  const [search, setSearch] = useState("");
  const [paper, setPaper] = useState("All papers");
  const [sort, setSort] = useState("Recently modified");
  const notes = useMemo(() => {
    const query = search.toLowerCase();
    return data.notes
      .filter(
        (note) =>
          (paper === "All papers" || note.paperId === paper) &&
          [note.title, note.content].some((value) => value.toLowerCase().includes(query)),
      )
      .sort((a, b) =>
        sort === "Recently modified"
          ? b.modifiedAt.localeCompare(a.modifiedAt)
          : sort === "Oldest"
            ? a.createdAt.localeCompare(b.createdAt)
            : a.title.localeCompare(b.title),
      );
  }, [data.notes, paper, search, sort]);
  return (
    <div className="surface overflow-hidden">
      <ModuleToolbar search={search} onSearch={setSearch} count={notes.length}>
        <Select label="Filter by paper" value={paper} onChange={setPaper}>
          <option value="All papers">All papers</option>
          {data.papers.map((item) => (
            <option value={item.id} key={item.id}>
              {truncate(item.title, 35)}
            </option>
          ))}
        </Select>
        <Select label="Sort notes" value={sort} onChange={setSort}>
          <option>Recently modified</option>
          <option>Oldest</option>
          <option>Title A–Z</option>
        </Select>
      </ModuleToolbar>
      {notes.length ? (
        <div className="grid gap-px bg-[#dcdcd2] sm:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => {
            const linkedPaper = data.papers.find((item) => item.id === note.paperId);
            return (
              <article
                key={note.id}
                className="group flex min-h-60 flex-col bg-[#f6f4ed] p-5 hover:bg-[#efede5] sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dbdad1] bg-[#ecebe3] text-[#6a7560]">
                    <FileText size={16} />
                  </span>
                  <RowActions
                    compact
                    onView={() => openView("note", note.id)}
                    onEdit={() => openEdit("note", note.id)}
                    onDelete={() => askDelete("note", note.id, note.title)}
                  />
                </div>
                <button className="mt-5 flex-1 text-left" onClick={() => openView("note", note.id)}>
                  <h2 className="text-[15px] font-semibold leading-5 text-[#303630] group-hover:text-[#4f6148]">
                    {note.title}
                  </h2>
                  <p className="mt-2.5 text-[13px] leading-5 text-[#6d726a]">
                    {truncate(note.content, 150)}
                  </p>
                </button>
                <div className="mt-5 border-t border-[#deddd4] pt-3">
                  {linkedPaper && (
                    <div className="mb-2 truncate text-[11px] font-medium text-[#66715d]">
                      Linked to: {linkedPaper.title}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-[10px] text-[#92958e]">
                    <Clock3 size={12} /> Updated {dateLabel(note.modifiedAt)}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<NotebookPen size={23} />}
          title={search || paper !== "All papers" ? "No matching notes" : "No notes yet"}
          description={
            search || paper !== "All papers"
              ? "Try a broader search or a different paper."
              : "Capture a thought and connect it to your source material."
          }
          action={
            !search && paper === "All papers" ? (
              <button className="button-primary" onClick={() => openAdd("note")}>
                <Plus size={15} /> Add note
              </button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}

function ProjectsPage({ data, openAdd, openView, openEdit, askDelete }: SharedPageProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [sort, setSort] = useState("Newest");
  const projects = useMemo(() => {
    const query = search.toLowerCase();
    return data.projects
      .filter(
        (project) =>
          (status === "All statuses" || project.status === status) &&
          [project.name, project.description, project.category].some((value) =>
            value.toLowerCase().includes(query),
          ),
      )
      .sort((a, b) =>
        sort === "Newest"
          ? b.createdAt.localeCompare(a.createdAt)
          : sort === "Oldest"
            ? a.createdAt.localeCompare(b.createdAt)
            : a.name.localeCompare(b.name),
      );
  }, [data.projects, search, status, sort]);
  return (
    <div className="surface overflow-hidden">
      <ModuleToolbar search={search} onSearch={setSearch} count={projects.length}>
        <Select label="Filter by status" value={status} onChange={setStatus}>
          <option>All statuses</option>
          <option>Planning</option>
          <option>In Progress</option>
          <option>Completed</option>
        </Select>
        <Select label="Sort projects" value={sort} onChange={setSort}>
          <option>Newest</option>
          <option>Oldest</option>
          <option>Name A–Z</option>
        </Select>
      </ModuleToolbar>
      {projects.length ? (
        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
          {projects.map((project) => {
            const experimentCount = data.experiments.filter(
              (item) => item.projectId === project.id,
            ).length;
            return (
              <article
                key={project.id}
                className="group flex min-h-64 flex-col rounded-xl border border-[#d9d8cf] bg-[#eeece4] p-5 shadow-[0_2px_5px_rgba(43,48,41,.04)] transition hover:border-[#c8cbbf] hover:shadow-[0_8px_20px_rgba(43,48,41,.07)]"
              >
                <div className="flex items-start justify-between">
                  <span className="tag">{project.category}</span>
                  <RowActions
                    compact
                    onView={() => openView("project", project.id)}
                    onEdit={() => openEdit("project", project.id)}
                    onDelete={() => askDelete("project", project.id, project.name)}
                  />
                </div>
                <button
                  className="mt-5 flex-1 text-left"
                  onClick={() => openView("project", project.id)}
                >
                  <h2 className="font-serif text-[20px] leading-6 text-[#303630] group-hover:text-[#4d6046]">
                    {project.name}
                  </h2>
                  <p className="mt-2.5 text-[13px] leading-5 text-[#6e736b]">
                    {truncate(project.description, 135)}
                  </p>
                </button>
                <div className="mt-5 flex items-center justify-between border-t border-[#d9d8cf] pt-4">
                  <StatusBadge status={project.status} />
                  <span className="text-[10px] text-[#888c84]">
                    {experimentCount} {experimentCount === 1 ? "experiment" : "experiments"}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<FolderKanban size={23} />}
          title={
            search || status !== "All statuses" ? "No matching projects" : "Start a line of inquiry"
          }
          description={
            search || status !== "All statuses"
              ? "Adjust your filters to find another project."
              : "Create a project to organize related research and experiments."
          }
          action={
            !search && status === "All statuses" ? (
              <button className="button-primary" onClick={() => openAdd("project")}>
                <Plus size={15} /> Add project
              </button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}

function ExperimentsPage({ data, openAdd, openView, openEdit, askDelete }: SharedPageProps) {
  const [search, setSearch] = useState("");
  const [project, setProject] = useState("All projects");
  const [sort, setSort] = useState("Newest");
  const experiments = useMemo(() => {
    const query = search.toLowerCase();
    return data.experiments
      .filter(
        (experiment) =>
          (project === "All projects" || experiment.projectId === project) &&
          [
            experiment.title,
            experiment.description,
            experiment.methodology,
            experiment.observations,
            experiment.results,
          ].some((value) => value.toLowerCase().includes(query)),
      )
      .sort((a, b) =>
        sort === "Newest"
          ? b.recordedAt.localeCompare(a.recordedAt)
          : sort === "Oldest"
            ? a.recordedAt.localeCompare(b.recordedAt)
            : a.title.localeCompare(b.title),
      );
  }, [data.experiments, project, search, sort]);
  return (
    <div className="surface overflow-hidden">
      <ModuleToolbar search={search} onSearch={setSearch} count={experiments.length}>
        <Select label="Filter by project" value={project} onChange={setProject}>
          <option value="All projects">All projects</option>
          {data.projects.map((item) => (
            <option key={item.id} value={item.id}>
              {truncate(item.name, 35)}
            </option>
          ))}
        </Select>
        <Select label="Sort experiments" value={sort} onChange={setSort}>
          <option>Newest</option>
          <option>Oldest</option>
          <option>Title A–Z</option>
        </Select>
      </ModuleToolbar>
      {experiments.length ? (
        <div className="divide-y divide-[#deddd4]">
          {experiments.map((experiment, index) => {
            const linkedProject = data.projects.find((item) => item.id === experiment.projectId);
            return (
              <article
                key={experiment.id}
                className="group relative flex gap-4 px-4 py-5 hover:bg-[#efede5] sm:gap-6 sm:px-6"
              >
                <div className="hidden w-12 shrink-0 sm:block">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#cfd2c7] bg-[#e6e7dd] text-[#607057]">
                    <FlaskConical size={17} />
                  </div>
                  {index < experiments.length - 1 && (
                    <div className="mx-auto mt-2 h-[calc(100%-28px)] w-px bg-[#d8d8ce]" />
                  )}
                </div>
                <button
                  className="min-w-0 flex-1 text-left"
                  onClick={() => openView("experiment", experiment.id)}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-[15px] font-semibold text-[#303630] group-hover:text-[#4d6046]">
                      {experiment.title}
                    </h2>
                    {linkedProject && <span className="tag">{linkedProject.name}</span>}
                  </div>
                  <p className="mt-2 text-[13px] leading-5 text-[#6c7169]">
                    {truncate(experiment.description, 170)}
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg border border-[#dfded5] bg-[#eeece5] px-3 py-2 text-[11px] leading-4 text-[#6f746c]">
                      <strong className="text-[#515850]">Method:</strong>{" "}
                      {truncate(experiment.methodology, 80)}
                    </div>
                    <div className="rounded-lg border border-[#dfded5] bg-[#eeece5] px-3 py-2 text-[11px] leading-4 text-[#6f746c]">
                      <strong className="text-[#515850]">Result:</strong>{" "}
                      {truncate(experiment.results, 80)}
                    </div>
                  </div>
                  <p className="mt-3 flex items-center gap-1.5 text-[10px] text-[#8a8e86]">
                    <CalendarDays size={12} /> Recorded {dateLabel(experiment.recordedAt)}
                  </p>
                </button>
                <RowActions
                  onView={() => openView("experiment", experiment.id)}
                  onEdit={() => openEdit("experiment", experiment.id)}
                  onDelete={() => askDelete("experiment", experiment.id, experiment.title)}
                />
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<FlaskConical size={23} />}
          title={
            search || project !== "All projects"
              ? "No matching experiments"
              : "No experiments recorded"
          }
          description={
            search || project !== "All projects"
              ? "Try a broader search or another project."
              : "Create a durable record of your method, observations, and results."
          }
          action={
            !search && project === "All projects" ? (
              <button className="button-primary" onClick={() => openAdd("experiment")}>
                <Plus size={15} /> Add experiment
              </button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}

function RowActions({
  onView,
  onEdit,
  onDelete,
  compact,
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  compact?: boolean;
}) {
  if (compact)
    return (
      <div className="flex items-center gap-0.5">
        <button className="icon-button" onClick={onEdit} aria-label="Edit">
          <Pencil size={14} />
        </button>
        <button className="icon-button danger-hover" onClick={onDelete} aria-label="Delete">
          <Trash2 size={14} />
        </button>
      </div>
    );
  return (
    <div className="flex shrink-0 flex-col items-center gap-1 sm:flex-row">
      <button
        className="hidden rounded-lg px-2.5 py-2 text-[11px] font-semibold text-[#65705d] hover:bg-[#dfe1d8] sm:block"
        onClick={onView}
      >
        View
      </button>
      <button className="icon-button" onClick={onEdit} aria-label="Edit">
        <Pencil size={14} />
      </button>
      <button className="icon-button danger-hover" onClick={onDelete} aria-label="Delete">
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const config = {
    Planning: { icon: CircleDot, className: "bg-[#ece7d9] text-[#756a4f] border-[#ddd3b9]" },
    "In Progress": { icon: Clock3, className: "bg-[#e3e8dc] text-[#506048] border-[#ccd5c4]" },
    Completed: { icon: CheckCircle2, className: "bg-[#e1e7df] text-[#4f6252] border-[#cbd6ca]" },
  }[status];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${config.className}`}
    >
      <Icon size={11} />
      {status}
    </span>
  );
}

function SettingsPage({
  data,
  backendOnline,
  onReset,
}: {
  data: WorkspaceData;
  backendOnline: boolean | null;
  onReset: () => void;
}) {
  const [confirmReset, setConfirmReset] = useState(false);
  const total =
    data.papers.length + data.notes.length + data.projects.length + data.experiments.length;
  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
      <section className="surface overflow-hidden">
        <div className="border-b border-[#deddd4] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#303630]">MERN Stack & Workspace Data</h2>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                backendOnline
                  ? "border border-[#b8d6b8] bg-[#e7f4e7] text-[#2e6b2e]"
                  : "border border-[#e4d3a8] bg-[#fbf5e6] text-[#7a5e19]"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  backendOnline ? "bg-emerald-600" : "bg-amber-500"
                }`}
              />
              {backendOnline ? "Backend Connected (Port 5000)" : "Client Mode (Local Storage Fallback)"}
            </span>
          </div>
          <p className="mt-2 text-[13px] leading-6 text-[#747970]">
            MARGIN is architected on the MERN stack (Node.js, Express, React, Vite, Tailwind CSS, with ready Mongoose data models). REST API calls communicate with the Express backend, with local cache resilience.
          </p>
        </div>
        <div className="grid gap-px bg-[#deddd4] sm:grid-cols-4">
          {[
            ["Papers", data.papers.length],
            ["Notes", data.notes.length],
            ["Projects", data.projects.length],
            ["Experiments", data.experiments.length],
          ].map(([label, count]) => (
            <div key={label} className="bg-[#f5f3eb] p-5">
              <div className="font-serif text-2xl text-[#303630]">{count}</div>
              <div className="mt-1 text-[11px] font-medium text-[#7f837b]">{label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h3 className="text-sm font-semibold text-[#343a34]">Restore demo workspace</h3>
            <p className="mt-1 text-[12px] text-[#7a7f76]">
              Replace all {total} current records with the original demonstration data.
            </p>
          </div>
          <button className="button-secondary shrink-0" onClick={() => setConfirmReset(true)}>
            <RotateCcw size={15} /> Reset demo data
          </button>
        </div>
      </section>
      <section className="surface p-5 sm:p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d2d4c9] bg-[#e7e8de] text-[#617057]">
          <Settings size={18} />
        </div>
        <h2 className="mt-5 font-serif text-xl text-[#303630]">Architecture & Storage</h2>
        <p className="mt-3 text-[13px] leading-6 text-[#747970]">
          In compliance with course requirements, the backend operates in dual-mode (providing in-memory active CRUD and fully typed Mongoose Schemas). MongoDB connectivity can be toggled on when authorized by the instructor.
        </p>
        <div className="mt-6 rounded-xl border border-[#d9d8ce] bg-[#edebe3] p-4 text-[11px] leading-5 text-[#6e746a]">
          <strong className="block text-[#4f574e]">Storage key</strong>
          margin-workspace-v1
        </div>
      </section>
      {confirmReset && (
        <Modal title="Restore demo workspace?" onClose={() => setConfirmReset(false)}>
          <div className="p-6">
            <p className="text-sm leading-6 text-[#686e66]">
              All current records will be replaced with the original demo papers, notes, projects,
              and experiments. This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button className="button-secondary" onClick={() => setConfirmReset(false)}>
                Cancel
              </button>
              <button
                className="button-danger"
                onClick={() => {
                  onReset();
                  setConfirmReset(false);
                }}
              >
                <RotateCcw size={15} /> Restore demo data
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function EntityDialog({
  dialog,
  data,
  onClose,
  onSave,
  onEdit,
  onDelete,
}: {
  dialog: NonNullable<Dialog>;
  data: WorkspaceData;
  onClose: () => void;
  onSave: (entity: Entity, item: Paper | Note | Project | Experiment, isNew: boolean) => void;
  onEdit: (entity: Entity, id: string) => void;
  onDelete: (entity: Entity, id: string, name: string) => void;
}) {
  const records = {
    paper: data.papers,
    note: data.notes,
    project: data.projects,
    experiment: data.experiments,
  };
  const item = dialog.id
    ? records[dialog.entity].find((record) => record.id === dialog.id)
    : undefined;
  if (dialog.mode === "view" && item) {
    return (
      <RecordView
        entity={dialog.entity}
        item={item}
        data={data}
        onClose={onClose}
        onEdit={() => onEdit(dialog.entity, item.id)}
        onDelete={() => onDelete(dialog.entity, item.id, "title" in item ? item.title : item.name)}
      />
    );
  }
  if (dialog.entity === "paper")
    return (
      <PaperForm
        item={item as Paper | undefined}
        onClose={onClose}
        onSave={(value) => onSave("paper", value, !item)}
      />
    );
  if (dialog.entity === "note")
    return (
      <NoteForm
        item={item as Note | undefined}
        papers={data.papers}
        onClose={onClose}
        onSave={(value) => onSave("note", value, !item)}
      />
    );
  if (dialog.entity === "project")
    return (
      <ProjectForm
        item={item as Project | undefined}
        onClose={onClose}
        onSave={(value) => onSave("project", value, !item)}
      />
    );
  return (
    <ExperimentForm
      item={item as Experiment | undefined}
      projects={data.projects}
      onClose={onClose}
      onSave={(value) => onSave("experiment", value, !item)}
    />
  );
}

function FormActions({
  onClose,
  editing,
  label,
}: {
  onClose: () => void;
  editing: boolean;
  label: string;
}) {
  return (
    <div className="sticky bottom-0 flex justify-end gap-2 border-t border-[#deddd4] bg-[#f5f3eb]/95 px-5 py-4 backdrop-blur sm:px-6">
      <button type="button" className="button-secondary" onClick={onClose}>
        Cancel
      </button>
      <button type="submit" className="button-primary">
        {editing ? "Save changes" : `Add ${label}`}
      </button>
    </div>
  );
}

function PaperForm({
  item,
  onClose,
  onSave,
}: {
  item?: Paper;
  onClose: () => void;
  onSave: (item: Paper) => void;
}) {
  const [form, setForm] = useState({
    title: item?.title ?? "",
    authors: item?.authors ?? "",
    year: item?.year.toString() ?? new Date().getFullYear().toString(),
    domain: item?.domain ?? "",
    abstract: item?.abstract ?? "",
    venue: item?.venue ?? "",
    url: item?.url ?? "",
  });
  const [error, setError] = useState("");
  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.authors.trim() || !form.domain.trim() || !form.abstract.trim())
      return setError("Complete all required fields before saving.");
    const year = Number(form.year);
    if (!Number.isInteger(year) || year < 1000 || year > new Date().getFullYear() + 1)
      return setError("Enter a valid four-digit publication year.");
    onSave({
      id: item?.id ?? createId("paper"),
      ...form,
      title: form.title.trim(),
      authors: form.authors.trim(),
      domain: form.domain.trim(),
      abstract: form.abstract.trim(),
      year,
      dateAdded: item?.dateAdded ?? new Date().toISOString(),
    });
  };
  return (
    <Modal
      title={item ? "Edit paper" : "Add a paper"}
      description="Keep the essential citation and a useful abstract together."
      onClose={onClose}
      wide
    >
      <form onSubmit={submit}>
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          {error && <FormError>{error}</FormError>}
          <div className="sm:col-span-2">
            <Field label="Title" required>
              <input
                autoFocus
                className={fieldClass}
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Authors" required>
            <input
              className={fieldClass}
              value={form.authors}
              onChange={(e) => update("authors", e.target.value)}
              placeholder="Comma-separated names"
            />
          </Field>
          <Field label="Publication year" required>
            <input
              className={fieldClass}
              type="number"
              min="1000"
              max={new Date().getFullYear() + 1}
              value={form.year}
              onChange={(e) => update("year", e.target.value)}
            />
          </Field>
          <Field label="Domain" required>
            <input
              className={fieldClass}
              value={form.domain}
              onChange={(e) => update("domain", e.target.value)}
              placeholder="e.g. Ecology"
            />
          </Field>
          <Field label="Venue">
            <input
              className={fieldClass}
              value={form.venue}
              onChange={(e) => update("venue", e.target.value)}
              placeholder="Journal or conference"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="URL or DOI">
              <input
                className={fieldClass}
                type="url"
                value={form.url}
                onChange={(e) => update("url", e.target.value)}
                placeholder="https://doi.org/…"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Abstract" required>
              <textarea
                className={`${fieldClass} min-h-32 resize-y`}
                value={form.abstract}
                onChange={(e) => update("abstract", e.target.value)}
              />
            </Field>
          </div>
        </div>
        <FormActions onClose={onClose} editing={!!item} label="paper" />
      </form>
    </Modal>
  );
}

function NoteForm({
  item,
  papers,
  onClose,
  onSave,
}: {
  item?: Note;
  papers: Paper[];
  onClose: () => void;
  onSave: (item: Note) => void;
}) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [content, setContent] = useState(item?.content ?? "");
  const [paperId, setPaperId] = useState(item?.paperId ?? "");
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim())
      return setError("Add both a title and note content before saving.");
    onSave({
      id: item?.id ?? createId("note"),
      title: title.trim(),
      content: content.trim(),
      paperId,
      createdAt: item?.createdAt ?? new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    });
  };
  return (
    <Modal
      title={item ? "Edit note" : "Add a note"}
      description="Capture a claim, connection, question, or interpretation."
      onClose={onClose}
    >
      <form onSubmit={submit}>
        <div className="space-y-4 p-5 sm:p-6">
          {error && <FormError>{error}</FormError>}
          <Field label="Title" required>
            <input
              autoFocus
              className={fieldClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>
          <Field label="Linked paper">
            <select
              className={fieldClass}
              value={paperId}
              onChange={(e) => setPaperId(e.target.value)}
            >
              <option value="">No linked paper</option>
              {papers.map((paper) => (
                <option key={paper.id} value={paper.id}>
                  {paper.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Content" required>
            <textarea
              className={`${fieldClass} min-h-52 resize-y`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note…"
            />
          </Field>
        </div>
        <FormActions onClose={onClose} editing={!!item} label="note" />
      </form>
    </Modal>
  );
}

function ProjectForm({
  item,
  onClose,
  onSave,
}: {
  item?: Project;
  onClose: () => void;
  onSave: (item: Project) => void;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [category, setCategory] = useState(item?.category ?? "");
  const [status, setStatus] = useState<ProjectStatus>(item?.status ?? "Planning");
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !description.trim() || !category.trim())
      return setError("Complete all required fields before saving.");
    onSave({
      id: item?.id ?? createId("project"),
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      status,
      createdAt: item?.createdAt ?? new Date().toISOString(),
    });
  };
  return (
    <Modal
      title={item ? "Edit project" : "Add a project"}
      description="Define the purpose and current stage of this research effort."
      onClose={onClose}
    >
      <form onSubmit={submit}>
        <div className="space-y-4 p-5 sm:p-6">
          {error && <FormError>{error}</FormError>}
          <Field label="Project name" required>
            <input
              autoFocus
              className={fieldClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="Description" required>
            <textarea
              className={`${fieldClass} min-h-28 resize-y`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" required>
              <input
                className={fieldClass}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Dissertation"
              />
            </Field>
            <Field label="Status" required>
              <select
                className={fieldClass}
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              >
                <option>Planning</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </Field>
          </div>
        </div>
        <FormActions onClose={onClose} editing={!!item} label="project" />
      </form>
    </Modal>
  );
}

function ExperimentForm({
  item,
  projects,
  onClose,
  onSave,
}: {
  item?: Experiment;
  projects: Project[];
  onClose: () => void;
  onSave: (item: Experiment) => void;
}) {
  const [form, setForm] = useState({
    title: item?.title ?? "",
    description: item?.description ?? "",
    methodology: item?.methodology ?? "",
    observations: item?.observations ?? "",
    results: item?.results ?? "",
    projectId: item?.projectId ?? "",
  });
  const [error, setError] = useState("");
  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.methodology.trim() ||
      !form.observations.trim() ||
      !form.results.trim()
    )
      return setError("Complete all required fields before saving.");
    onSave({
      id: item?.id ?? createId("experiment"),
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      methodology: form.methodology.trim(),
      observations: form.observations.trim(),
      results: form.results.trim(),
      recordedAt: item?.recordedAt ?? new Date().toISOString(),
    });
  };
  return (
    <Modal
      title={item ? "Edit experiment" : "Record an experiment"}
      description="Create a traceable record of what you did and what you learned."
      onClose={onClose}
      wide
    >
      <form onSubmit={submit}>
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          {error && <FormError>{error}</FormError>}
          <div className="sm:col-span-2">
            <Field label="Title" required>
              <input
                autoFocus
                className={fieldClass}
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Linked project">
              <select
                className={fieldClass}
                value={form.projectId}
                onChange={(e) => update("projectId", e.target.value)}
              >
                <option value="">No linked project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Description" required>
              <textarea
                className={`${fieldClass} min-h-20 resize-y`}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Methodology" required>
            <textarea
              className={`${fieldClass} min-h-32 resize-y`}
              value={form.methodology}
              onChange={(e) => update("methodology", e.target.value)}
            />
          </Field>
          <Field label="Observations" required>
            <textarea
              className={`${fieldClass} min-h-32 resize-y`}
              value={form.observations}
              onChange={(e) => update("observations", e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Results" required>
              <textarea
                className={`${fieldClass} min-h-24 resize-y`}
                value={form.results}
                onChange={(e) => update("results", e.target.value)}
              />
            </Field>
          </div>
        </div>
        <FormActions onClose={onClose} editing={!!item} label="experiment" />
      </form>
    </Modal>
  );
}

function FormError({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-[#dfc8c1] bg-[#f6eae6] px-3.5 py-2.5 text-[12px] font-medium text-[#8b4239] sm:col-span-2">
      {children}
    </div>
  );
}

function RecordView({
  entity,
  item,
  data,
  onClose,
  onEdit,
  onDelete,
}: {
  entity: Entity;
  item: Paper | Note | Project | Experiment;
  data: WorkspaceData;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const title = "title" in item ? item.title : item.name;
  return (
    <Modal
      title={title}
      description={`${entityLabels[entity][0].toUpperCase()}${entityLabels[entity].slice(1)} details`}
      onClose={onClose}
      wide
    >
      <div className="p-5 sm:p-6">
        {entity === "paper" && <PaperDetails paper={item as Paper} />}
        {entity === "note" && <NoteDetails note={item as Note} papers={data.papers} />}
        {entity === "project" && (
          <ProjectDetails project={item as Project} experiments={data.experiments} />
        )}
        {entity === "experiment" && (
          <ExperimentDetails experiment={item as Experiment} projects={data.projects} />
        )}
      </div>
      <div className="sticky bottom-0 flex items-center justify-between border-t border-[#deddd4] bg-[#f5f3eb]/95 px-5 py-4 backdrop-blur sm:px-6">
        <button className="button-quiet-danger" onClick={onDelete}>
          <Trash2 size={14} /> Delete
        </button>
        <div className="flex gap-2">
          <button className="button-secondary" onClick={onClose}>
            Close
          </button>
          <button className="button-primary" onClick={onEdit}>
            <Pencil size={14} /> Edit
          </button>
        </div>
      </div>
    </Modal>
  );
}

function PaperDetails({ paper }: { paper: Paper }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <span className="tag">{paper.domain}</span>
        <span className="tag">{paper.year}</span>
        {paper.venue && <span className="tag">{paper.venue}</span>}
      </div>
      <DetailBlock label="Authors">{paper.authors}</DetailBlock>
      <DetailBlock label="Abstract">{paper.abstract}</DetailBlock>
      <div className="grid gap-4 sm:grid-cols-2">
        <DetailBlock label="Date added">{dateLabel(paper.dateAdded)}</DetailBlock>
        {paper.url && (
          <DetailBlock label="URL or DOI">
            <a
              className="inline-flex items-center gap-1.5 break-all font-medium text-[#596a50] underline decoration-[#aeb8a7] underline-offset-3 hover:text-[#384732]"
              href={paper.url}
              target="_blank"
              rel="noreferrer"
            >
              {paper.url}
              <ExternalLink size={13} className="shrink-0" />
            </a>
          </DetailBlock>
        )}
      </div>
    </div>
  );
}

function NoteDetails({ note, papers }: { note: Note; papers: Paper[] }) {
  const paper = papers.find((item) => item.id === note.paperId);
  return (
    <div>
      <div className="whitespace-pre-wrap rounded-xl border border-[#dbdad1] bg-[#eeece4] p-5 text-[14px] leading-7 text-[#4b514b]">
        {note.content}
      </div>
      {paper && <DetailBlock label="Linked paper">{paper.title}</DetailBlock>}
      <div className="grid gap-4 sm:grid-cols-2">
        <DetailBlock label="Created">{dateLabel(note.createdAt)}</DetailBlock>
        <DetailBlock label="Last modified">{dateLabel(note.modifiedAt)}</DetailBlock>
      </div>
    </div>
  );
}

function ProjectDetails({ project, experiments }: { project: Project; experiments: Experiment[] }) {
  const linked = experiments.filter((item) => item.projectId === project.id);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={project.status} />
        <span className="tag">{project.category}</span>
      </div>
      <DetailBlock label="Description">{project.description}</DetailBlock>
      <div className="grid gap-4 sm:grid-cols-2">
        <DetailBlock label="Created">{dateLabel(project.createdAt)}</DetailBlock>
        <DetailBlock label="Linked experiments">
          {linked.length ? linked.map((item) => item.title).join(", ") : "None yet"}
        </DetailBlock>
      </div>
    </div>
  );
}

function ExperimentDetails({
  experiment,
  projects,
}: {
  experiment: Experiment;
  projects: Project[];
}) {
  const project = projects.find((item) => item.id === experiment.projectId);
  return (
    <div>
      {project && <span className="tag">{project.name}</span>}
      <DetailBlock label="Description">{experiment.description}</DetailBlock>
      <div className="grid gap-4 sm:grid-cols-2">
        <DetailBlock label="Methodology">{experiment.methodology}</DetailBlock>
        <DetailBlock label="Observations">{experiment.observations}</DetailBlock>
      </div>
      <DetailBlock label="Results">{experiment.results}</DetailBlock>
      <DetailBlock label="Recorded">{dateLabel(experiment.recordedAt)}</DetailBlock>
    </div>
  );
}

function DetailBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-5">
      <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#858a80]">
        {label}
      </div>
      <div className="text-[13px] leading-6 text-[#555b54]">{children}</div>
    </div>
  );
}
