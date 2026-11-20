import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Download,
  Filter,
  Globe2,
  Heart,
  Library,
  LockKeyhole,
  Menu,
  Quote,
  Search,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import "./discovery.css";

type StudioPage = "Foundations" | "Components" | "Desktop Screens" | "Mobile Screens";
type ResearchScreen =
  | "Home"
  | "Search"
  | "Paper"
  | "Profile"
  | "Topics"
  | "Sign in"
  | "Create account"
  | "Premium";

const studioPages: StudioPage[] = [
  "Foundations",
  "Components",
  "Desktop Screens",
  "Mobile Screens",
];
const desktopScreens: ResearchScreen[] = [
  "Home",
  "Search",
  "Paper",
  "Profile",
  "Topics",
  "Sign in",
  "Create account",
  "Premium",
];
const mobileScreens: ResearchScreen[] = ["Home", "Search", "Paper", "Profile", "Sign in"];

const papers = [
  {
    title: "Everyday stewardship in shared urban landscapes",
    authors: "Lina Moreno, David Kim",
    detail: "Journal of Civic Ecology · 2024",
    topic: "Urban Studies",
  },
  {
    title: "Small archives, long memories: a neighborhood study",
    authors: "Amara Okafor, Elise Laurent",
    detail: "Public History Review · 2023",
    topic: "History",
  },
  {
    title: "Mapping care networks through community gardens",
    authors: "Sofia Bennett, Ravi Shah",
    detail: "Social Research Quarterly · 2022",
    topic: "Community Research",
  },
];

const topics = [
  "Urban Studies",
  "Ecology",
  "Public Health",
  "History",
  "Education",
  "Information Science",
];

export default function ResearchDesignStudio() {
  const [studioPage, setStudioPage] = useState<StudioPage>("Desktop Screens");
  const [desktopScreen, setDesktopScreen] = useState<ResearchScreen>("Home");
  const [mobileScreen, setMobileScreen] = useState<ResearchScreen>("Home");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");

  const showMessage = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const navigateFromHeader = (screen: ResearchScreen) => {
    if (studioPage === "Mobile Screens") setMobileScreen(screen);
    else setDesktopScreen(screen);
  };

  return (
    <section className="research-studio" aria-label="Research discovery design preview">
      <header className="studio-heading">
        <div>
          <p className="studio-eyebrow">MARGIN · DISCOVERY EXPERIENCE</p>
          <h2>Research, in context.</h2>
          <p className="studio-description">
            An editorial discovery experience built around the work, its ideas, and the people
            behind it.
          </p>
        </div>
        <span className="studio-status">
          <span />
          Preview · sample content
        </span>
      </header>

      <nav className="studio-tabs" aria-label="Design pages">
        {studioPages.map((name) => (
          <button
            key={name}
            type="button"
            aria-current={studioPage === name ? "page" : undefined}
            onClick={() => setStudioPage(name)}
          >
            {name}
          </button>
        ))}
      </nav>

      <div className="studio-page" key={studioPage}>
        {studioPage === "Foundations" && <FoundationsPage />}
        {studioPage === "Components" && <ComponentsPage onMessage={showMessage} />}
        {studioPage === "Desktop Screens" && (
          <ScreenGallery
            title="Desktop screens"
            screens={desktopScreens}
            selected={desktopScreen}
            onSelect={setDesktopScreen}
            query={query}
            setQuery={setQuery}
            onNavigate={navigateFromHeader}
            onMessage={showMessage}
          />
        )}
        {studioPage === "Mobile Screens" && (
          <ScreenGallery
            title="Mobile screens"
            screens={mobileScreens}
            selected={mobileScreen}
            onSelect={setMobileScreen}
            query={query}
            setQuery={setQuery}
            onNavigate={navigateFromHeader}
            onMessage={showMessage}
            mobile
          />
        )}
      </div>
      {toast && (
        <div className="studio-toast" role="status">
          {toast}
        </div>
      )}
    </section>
  );
}

function ScreenGallery({
  title,
  screens,
  selected,
  onSelect,
  query,
  setQuery,
  onNavigate,
  onMessage,
  mobile = false,
}: {
  title: string;
  screens: ResearchScreen[];
  selected: ResearchScreen;
  onSelect: (screen: ResearchScreen) => void;
  query: string;
  setQuery: (query: string) => void;
  onNavigate: (screen: ResearchScreen) => void;
  onMessage: (message: string) => void;
  mobile?: boolean;
}) {
  return (
    <section className={`gallery-page${mobile ? " gallery-page--mobile" : ""}`}>
      <div className="gallery-toolbar">
        <div>
          <h3>{title}</h3>
          <p>
            {mobile
              ? "390px frame · adaptive navigation and stacked content"
              : "1440px layout · open editorial grid and three-column reading views"}
          </p>
        </div>
        {!mobile && <span className="gallery-measure">1440 × flexible</span>}
      </div>
      <nav className="screen-picker" aria-label={`${title} list`}>
        {screens.map((screen) => (
          <button
            key={screen}
            type="button"
            aria-pressed={selected === screen}
            onClick={() => onSelect(screen)}
          >
            {screen}
          </button>
        ))}
      </nav>
      <div className={mobile ? "mobile-artboard" : "desktop-artboard"}>
        {mobile && (
          <div className="mobile-artboard-label">
            <span />
            390 px · MARGIN research
          </div>
        )}
        <ResearchSite
          screen={selected}
          query={query}
          setQuery={setQuery}
          onNavigate={onNavigate}
          onMessage={onMessage}
          mobile={mobile}
        />
      </div>
    </section>
  );
}

function FoundationsPage() {
  const colors = [
    ["Canvas", "#FAFAFA", "var(--neutral-50)"],
    ["Surface", "#FFFFFF", "var(--neutral-0)"],
    ["Quiet surface", "#F0F0F0", "var(--neutral-100)"],
    ["Secondary", "#5C5C5C", "var(--neutral-600)"],
    ["Primary text", "#202020", "var(--neutral-950)"],
    ["MARGIN olive", "#48563E", "var(--olive-700)"],
  ];
  const spacing = [4, 8, 12, 16, 24, 32, 48, 64];

  return (
    <div className="foundations-page">
      <div className="foundation-intro">
        <div>
          <h3>Foundations</h3>
          <p>
            The discovery pages inherit MARGIN’s established palette and 4px rhythm. Layout and
            content structure take their cue from research publishing.
          </p>
        </div>
        <span className="foundation-note">Existing MARGIN tokens retained</span>
      </div>
      <section className="foundation-section" aria-labelledby="color-token-title">
        <div className="foundation-section-title">
          <h4 id="color-token-title">Color</h4>
          <p>Neutral surfaces with one olive action color</p>
        </div>
        <div className="token-swatches">
          {colors.map(([name, hex, token]) => (
            <div className="token-swatch" key={name}>
              <span style={{ background: token }} />
              <div>
                <strong>{name}</strong>
                <code>{hex}</code>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="foundation-columns">
        <section className="foundation-section">
          <div className="foundation-section-title">
            <h4>Type</h4>
            <p>One interface family, three core sizes</p>
          </div>
          <div className="type-specimens">
            <div>
              <span>Title · 28 / 36 · 600</span>
              <strong className="type-title-sample">A question worth following</strong>
            </div>
            <div>
              <span>Body · 16 / 24 · 400</span>
              <p>Research is easier to follow when the source, subject, and context stay close.</p>
            </div>
            <div>
              <span>Small · 14 / 20 · 500</span>
              <p className="type-small-sample">Journal of Civic Ecology · 2024</p>
            </div>
          </div>
        </section>
        <section className="foundation-section">
          <div className="foundation-section-title">
            <h4>Spacing</h4>
            <p>4px base unit · content separation uses multiples</p>
          </div>
          <div className="spacing-scale">
            {spacing.map((step) => (
              <div key={step}>
                <span>{step}px</span>
                <i style={{ width: `${step * 2}px` }} />
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="foundation-section">
        <div className="foundation-section-title">
          <h4>Shape, depth & motion</h4>
          <p>Quiet utility surfaces; hierarchy comes from spacing and alignment</p>
        </div>
        <div className="foundation-principles">
          <div>
            <span className="radius-sample radius-four" />
            <strong>4px controls</strong>
            <small>Inputs and actions</small>
          </div>
          <div>
            <span className="radius-sample radius-eight" />
            <strong>8px overlays</strong>
            <small>Dialogs and menus</small>
          </div>
          <div>
            <span className="depth-sample" />
            <strong>No ambient shadows</strong>
            <small>Use borders only where needed</small>
          </div>
          <div>
            <span className="motion-sample">
              <ArrowRight size={16} />
            </span>
            <strong>160–240ms</strong>
            <small>Color, underline, and image reveal</small>
          </div>
        </div>
      </section>
    </div>
  );
}

function ComponentsPage({ onMessage }: { onMessage: (message: string) => void }) {
  const [tab, setTab] = useState("Papers");
  const [saved, setSaved] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="components-page">
      <div className="foundation-intro">
        <div>
          <h3>Components</h3>
          <p>
            Shared controls and editorial patterns, shown with their active, idle, hover, focus, and
            unavailable states.
          </p>
        </div>
        <span className="foundation-note">Built from MARGIN tokens</span>
      </div>
      <div className="component-grid">
        <section className="component-specimen">
          <div className="specimen-heading">
            <h4>Actions</h4>
            <span>Primary · secondary · text</span>
          </div>
          <div className="specimen-row">
            <button
              type="button"
              className="research-button research-button--primary"
              onClick={() => onMessage("Primary action selected")}
            >
              Read paper <ArrowRight size={15} />
            </button>
            <button
              type="button"
              className="research-button research-button--outline"
              onClick={() => onMessage("Secondary action selected")}
            >
              Follow topic
            </button>
            <button
              type="button"
              className="research-text-button"
              onClick={() => onMessage("Link action selected")}
            >
              View all <ArrowRight size={14} />
            </button>
            <button type="button" className="research-button research-button--primary" disabled>
              Unavailable
            </button>
          </div>
        </section>
        <section className="component-specimen">
          <div className="specimen-heading">
            <h4>Search field</h4>
            <span>Idle · filled · focus</span>
          </div>
          <label className="research-search research-search--specimen">
            <Search size={18} aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search papers, people, and topics"
            />
            <kbd>⌘ K</kbd>
          </label>
        </section>
        <section className="component-specimen">
          <div className="specimen-heading">
            <h4>Category tabs</h4>
            <span>One active state</span>
          </div>
          <div className="research-categories" role="tablist" aria-label="Example categories">
            {["Papers", "People", "Topics"].map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={tab === item}
                onClick={() => setTab(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>
        <section className="component-specimen">
          <div className="specimen-heading">
            <h4>Paper row</h4>
            <span>Content first · no enclosing card</span>
          </div>
          <PaperRow
            paper={papers[0]}
            onOpen={() => onMessage("Sample paper opened")}
            onDownload={() => onMessage("Document preview is ready")}
          />
        </section>
        <section className="component-specimen">
          <div className="specimen-heading">
            <h4>Relationship actions</h4>
            <span>Saved and followed</span>
          </div>
          <div className="specimen-row">
            <button
              type="button"
              className={`research-follow${followed ? " is-following" : ""}`}
              aria-pressed={followed}
              onClick={() => setFollowed(!followed)}
            >
              {followed ? <Check size={15} /> : <Users size={15} />}
              {followed ? "Following" : "Follow"}
            </button>
            <button
              type="button"
              className={`research-save${saved ? " is-saved" : ""}`}
              aria-pressed={saved}
              onClick={() => setSaved(!saved)}
            >
              {saved ? <Check size={15} /> : <Bookmark size={15} />}
              {saved ? "Saved" : "Save"}
            </button>
            <span className="research-chip">Urban Studies</span>
            <span className="research-chip research-chip--muted">
              <LockKeyhole size={12} />
              Member feature
            </span>
          </div>
        </section>
        <section className="component-specimen">
          <div className="specimen-heading">
            <h4>Author line</h4>
            <span>Profile and affiliation</span>
          </div>
          <div className="author-line">
            <span className="author-monogram">MC</span>
            <div>
              <strong>Maya Chen</strong>
              <small>Civic ecology · North Coast Institute</small>
            </div>
            <button
              type="button"
              className="research-follow"
              onClick={() => setFollowed(!followed)}
            >
              {followed ? "Following" : "Follow"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function ResearchSite({
  screen,
  query,
  setQuery,
  onNavigate,
  onMessage,
  mobile,
}: {
  screen: ResearchScreen;
  query: string;
  setQuery: (query: string) => void;
  onNavigate: (screen: ResearchScreen) => void;
  onMessage: (message: string) => void;
  mobile: boolean;
}) {
  const [following, setFollowing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState("Papers");

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onNavigate("Search");
  };

  const submitAuth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthMessage(
      "This is a design preview. Account access will connect to your research service.",
    );
  };

  return (
    <div className={`research-site${mobile ? " research-site--mobile" : ""}`}>
      <header className="research-masthead">
        {mobile && (
          <button
            className="research-menu-button"
            aria-label="Open menu"
            onClick={() => onNavigate("Home")}
          >
            <Menu size={19} />
          </button>
        )}
        <button
          type="button"
          className="research-wordmark"
          onClick={() => onNavigate("Home")}
          aria-label="MARGIN home"
        >
          <span className="research-mark">M</span>
          <span>MARGIN</span>
        </button>
        <form
          className="research-search research-header-search"
          onSubmit={submitSearch}
          role="search"
        >
          <Search size={18} aria-hidden="true" />
          <input
            aria-label="Search research"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search papers, people, and topics"
          />
          <button type="submit" aria-label="Submit search">
            <ArrowRight size={16} />
          </button>
        </form>
        <nav className="research-top-links" aria-label="Research navigation">
          <button
            type="button"
            aria-current={screen === "Search" ? "page" : undefined}
            onClick={() => onNavigate("Search")}
          >
            Papers
          </button>
          <button
            type="button"
            aria-current={screen === "Topics" ? "page" : undefined}
            onClick={() => onNavigate("Topics")}
          >
            Topics
          </button>
          <button
            type="button"
            aria-current={screen === "Profile" ? "page" : undefined}
            onClick={() => onNavigate("Profile")}
          >
            People
          </button>
        </nav>
        {!mobile && (
          <div className="research-account-links">
            <button
              type="button"
              className="research-login-link"
              onClick={() => onNavigate("Sign in")}
            >
              Sign in
            </button>
            <button
              type="button"
              className="research-button research-button--primary research-create-link"
              onClick={() => onNavigate("Create account")}
            >
              Create account
            </button>
          </div>
        )}
        {mobile && (
          <button
            type="button"
            className="research-user-button"
            aria-label="Open sign in"
            onClick={() => onNavigate("Sign in")}
          >
            <UserRound size={19} />
          </button>
        )}
      </header>

      {screen === "Home" && (
        <HomeScreen
          query={query}
          setQuery={setQuery}
          onSubmit={submitSearch}
          onNavigate={onNavigate}
        />
      )}
      {screen === "Search" && (
        <SearchScreen
          query={query}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          onOpenPaper={() => onNavigate("Paper")}
          onMessage={onMessage}
        />
      )}
      {screen === "Paper" && (
        <PaperScreen
          saved={saved}
          setSaved={setSaved}
          onMessage={onMessage}
          onNavigate={onNavigate}
        />
      )}
      {screen === "Profile" && (
        <ProfileScreen
          following={following}
          setFollowing={setFollowing}
          onOpenPaper={() => onNavigate("Paper")}
        />
      )}
      {screen === "Topics" && <TopicsScreen onSearch={() => onNavigate("Search")} />}
      {(screen === "Sign in" || screen === "Create account") && (
        <AuthScreen
          createAccount={screen === "Create account"}
          onNavigate={onNavigate}
          onSubmit={submitAuth}
          message={authMessage}
        />
      )}
      {screen === "Premium" && <PremiumScreen onNavigate={onNavigate} />}

      <ResearchFooter mobile={mobile} onNavigate={onNavigate} />
    </div>
  );
}

function HomeScreen({
  query,
  setQuery,
  onSubmit,
  onNavigate,
}: {
  query: string;
  setQuery: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onNavigate: (screen: ResearchScreen) => void;
}) {
  return (
    <main className="research-main research-home">
      <section className="research-hero">
        <div className="research-hero-copy">
          <span className="research-kicker">A workspace for open questions</span>
          <h1>
            Research begins
            <br />
            with a question.
          </h1>
          <p>Find the work, ideas, and people that move your inquiry forward.</p>
          <form className="research-search research-hero-search" onSubmit={onSubmit}>
            <Search size={19} aria-hidden="true" />
            <input
              aria-label="Search research"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try a topic or a paper title"
            />
            <button type="submit" aria-label="Search">
              <ArrowRight size={17} />
            </button>
          </form>
          <button
            type="button"
            className="research-text-button hero-browse-link"
            onClick={() => onNavigate("Topics")}
          >
            Browse research topics <ArrowRight size={15} />
          </button>
        </div>
        <div className="research-photo-essay" aria-label="Research editorial photography">
          <figure className="research-photo-main">
            <img
              src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=85"
              alt="Open notebook with handwritten research notes"
            />
            <figcaption>Field notes · 06:42 AM</figcaption>
          </figure>
          <figure className="research-photo-detail">
            <img
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=700&q=85"
              alt="Quiet reading room in a public library"
            />
          </figure>
          <span className="photo-index">01 / 03</span>
        </div>
      </section>
      <section className="research-proof-line" aria-label="Research workspace values">
        <div>
          <BookOpen size={18} />
          <strong>Start with the source</strong>
          <span>Keep reading close to the question.</span>
        </div>
        <div>
          <Users size={18} />
          <strong>Follow ideas and people</strong>
          <span>Trace a subject across disciplines.</span>
        </div>
        <div>
          <Globe2 size={18} />
          <strong>Open discovery</strong>
          <span>Explore work from every field.</span>
        </div>
      </section>
      <section className="research-home-section">
        <div className="research-section-head">
          <div>
            <span className="research-kicker">A few places to begin</span>
            <h2>Follow the question.</h2>
          </div>
          <button
            type="button"
            className="research-text-button"
            onClick={() => onNavigate("Topics")}
          >
            All topics <ArrowRight size={15} />
          </button>
        </div>
        <div className="research-topic-grid">
          {topics.slice(0, 4).map((topic, index) => (
            <button
              type="button"
              key={topic}
              className="research-topic-item"
              onClick={() => onNavigate("Topics")}
            >
              <span>0{index + 1}</span>
              <strong>{topic}</strong>
              <ArrowUpRight size={17} />
            </button>
          ))}
        </div>
      </section>
      <section className="research-membership-band">
        <div>
          <span className="research-kicker">For the work that takes time</span>
          <h2>Keep a wider view of your field.</h2>
          <p>
            Tools for discovering related work, following citations, and returning to ideas when you
            need them.
          </p>
        </div>
        <button
          type="button"
          className="research-button research-button--outline"
          onClick={() => onNavigate("Premium")}
        >
          Explore research tools <ArrowRight size={15} />
        </button>
      </section>
    </main>
  );
}

function SearchScreen({
  query,
  activeCategory,
  setActiveCategory,
  filtersOpen,
  setFiltersOpen,
  onOpenPaper,
  onMessage,
}: {
  query: string;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  onOpenPaper: () => void;
  onMessage: (message: string) => void;
}) {
  const categories = ["Papers", "People", "Topics", "Videos"];
  return (
    <main className="research-main research-search-page">
      <div className="research-page-title">
        <div>
          <span className="research-kicker">Explore the literature</span>
          <h1>Search results</h1>
          <p>
            {query ? (
              <>
                Showing sample results for <strong>“{query}”</strong>
              </>
            ) : (
              "Explore recent work across research fields."
            )}
          </p>
        </div>
        <span className="result-count">6 sample results</span>
      </div>
      <nav className="research-categories" aria-label="Search result type" role="tablist">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={category === activeCategory}
            onClick={() => setActiveCategory(category)}
          >
            {category}
            {category === "Papers" && <span>6</span>}
          </button>
        ))}
      </nav>
      <div className="research-results-layout">
        <aside
          className={`research-filters${filtersOpen ? " is-open" : ""}`}
          aria-label="Search filters"
        >
          <div className="filter-title">
            <h2>Refine results</h2>
            <button type="button" onClick={() => onMessage("Search filters reset")}>
              Clear
            </button>
          </div>
          <fieldset>
            <legend>Publication date</legend>
            <label>
              <input type="radio" name="date" defaultChecked /> Any time
            </label>
            <label>
              <input type="radio" name="date" /> Since 2020
            </label>
            <label>
              <input type="radio" name="date" /> Since 2015
            </label>
          </fieldset>
          <fieldset>
            <legend>Document type</legend>
            <label>
              <input type="checkbox" /> Journal articles
            </label>
            <label>
              <input type="checkbox" /> Working papers
            </label>
            <label>
              <input type="checkbox" /> Books & chapters
            </label>
          </fieldset>
          <fieldset>
            <legend>Research field</legend>
            <label>
              <input type="checkbox" /> Social sciences
            </label>
            <label>
              <input type="checkbox" /> Environmental studies
            </label>
          </fieldset>
        </aside>
        <section className="research-results" aria-label="Research results">
          <div className="results-toolbar">
            <button
              type="button"
              className="research-filter-toggle"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <Filter size={15} />
              Filters
            </button>
            <label>
              Sort by{" "}
              <select aria-label="Sort results">
                <option>Relevance</option>
                <option>Most recent</option>
                <option>Most read</option>
              </select>
              <ChevronDown size={14} />
            </label>
          </div>
          <div className="results-list">
            {papers.map((paper, index) => (
              <PaperRow
                key={paper.title}
                paper={paper}
                index={index}
                onOpen={onOpenPaper}
                onDownload={() => onMessage("Document preview is ready")}
              />
            ))}
          </div>
          <button
            type="button"
            className="research-load-more"
            onClick={() => onMessage("You’re viewing all sample results")}
          >
            Show more sample results <ArrowDownIcon />
          </button>
        </section>
      </div>
    </main>
  );
}

function ArrowDownIcon() {
  return <ChevronDown size={15} aria-hidden="true" />;
}

function PaperRow({
  paper,
  index = 0,
  onOpen,
  onDownload,
}: {
  paper: (typeof papers)[number];
  index?: number;
  onOpen: () => void;
  onDownload: () => void;
}) {
  return (
    <article className="research-paper-row">
      <button type="button" className="paper-open" onClick={onOpen}>
        <span className="paper-index">{String(index + 1).padStart(2, "0")}</span>
        <span className="paper-copy">
          <span className="paper-topic">{paper.topic}</span>
          <strong>{paper.title}</strong>
          <span className="paper-authors">{paper.authors}</span>
          <span className="paper-published">{paper.detail}</span>
        </span>
        <ChevronRight size={17} className="paper-chevron" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="paper-download"
        onClick={onDownload}
        aria-label={`Preview ${paper.title}`}
      >
        <Download size={15} />
        <span>Preview</span>
      </button>
    </article>
  );
}

function PaperScreen({
  saved,
  setSaved,
  onMessage,
  onNavigate,
}: {
  saved: boolean;
  setSaved: (saved: boolean) => void;
  onMessage: (message: string) => void;
  onNavigate: (screen: ResearchScreen) => void;
}) {
  return (
    <main className="research-main research-paper-page">
      <nav className="research-breadcrumbs" aria-label="Breadcrumb">
        <button type="button" onClick={() => onNavigate("Search")}>
          Papers
        </button>
        <ChevronRight size={13} />
        <button type="button" onClick={() => onNavigate("Topics")}>
          Urban Studies
        </button>
        <ChevronRight size={13} />
        <span>Paper details</span>
      </nav>
      <section className="paper-detail-hero">
        <div className="paper-detail-copy">
          <span className="research-kicker">Research article · 2024</span>
          <h1>Everyday stewardship in shared urban landscapes</h1>
          <button type="button" className="paper-author-link" onClick={() => onNavigate("Profile")}>
            Lina Moreno <span>·</span> David Kim <span>·</span> North Coast Institute
          </button>
          <div className="paper-detail-actions">
            <button
              type="button"
              className="research-button research-button--primary"
              onClick={() => onMessage("Document preview is ready")}
            >
              Read paper <ArrowRight size={15} />
            </button>
            <button
              type="button"
              className={`research-save${saved ? " is-saved" : ""}`}
              aria-pressed={saved}
              onClick={() => setSaved(!saved)}
            >
              {saved ? <Check size={15} /> : <Bookmark size={15} />}
              {saved ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              className="research-save"
              onClick={() => onMessage("Citation copied in the preview")}
            >
              <Quote size={15} />
              Cite
            </button>
          </div>
          <div className="paper-detail-stats">
            <span>
              <strong>1,248</strong> reads
            </span>
            <span>
              <strong>86</strong> saves
            </span>
            <span>
              <Clock3 size={14} />
              12 min read
            </span>
          </div>
        </div>
        <div className="paper-cover" aria-label="Sample paper cover">
          <div className="cover-rule" />
          <span>
            MARGIN
            <br />
            FIELD NOTES
          </span>
          <strong>
            Shared
            <br />
            landscapes
          </strong>
          <small>URBAN STUDIES · 2024</small>
          <div className="cover-glyph" />
        </div>
      </section>
      <div className="paper-content-grid">
        <nav className="paper-outline" aria-label="On this page">
          <span>On this page</span>
          <button type="button" className="is-current">
            Abstract
          </button>
          <button type="button" onClick={() => onMessage("Section preview selected")}>
            Approach
          </button>
          <button type="button" onClick={() => onMessage("Section preview selected")}>
            Findings
          </button>
          <button type="button" onClick={() => onMessage("Section preview selected")}>
            References
          </button>
        </nav>
        <article className="paper-reading">
          <h2>Abstract</h2>
          <p>
            This study follows how residents care for shared green spaces across three
            neighborhoods. Through interviews and repeated site visits, it traces the small routines
            that help public places remain welcoming, useful, and connected to local life.
          </p>
          <p>
            Rather than treating stewardship as a formal program, the research considers it as a
            series of practical relationships between people, plants, and the places they share.
          </p>
          <div className="paper-keywords">
            <span>Keywords</span>
            {["Urban commons", "Public space", "Stewardship"].map((tag) => (
              <button type="button" key={tag} onClick={() => onNavigate("Topics")}>
                {tag}
              </button>
            ))}
          </div>
          <blockquote>
            <span>“</span>Care is less a single act than a pattern people can return to.
          </blockquote>
          <button
            type="button"
            className="research-text-button"
            onClick={() => onMessage("Full text preview is ready")}
          >
            Continue to full text <ArrowRight size={15} />
          </button>
        </article>
        <aside className="paper-author-panel">
          <span className="research-kicker">About the authors</span>
          <AuthorMini
            name="Lina Moreno"
            detail="Civic ecology · North Coast Institute"
            onClick={() => onNavigate("Profile")}
          />
          <AuthorMini
            name="David Kim"
            detail="Urban studies · North Coast Institute"
            onClick={() => onNavigate("Profile")}
          />
          <button
            type="button"
            className="research-text-button"
            onClick={() => onNavigate("Profile")}
          >
            View author profile <ArrowRight size={14} />
          </button>
        </aside>
      </div>
      <section className="paper-related">
        <div className="research-section-head">
          <div>
            <span className="research-kicker">Keep reading</span>
            <h2>Related work</h2>
          </div>
          <button
            type="button"
            className="research-text-button"
            onClick={() => onNavigate("Search")}
          >
            All papers <ArrowRight size={14} />
          </button>
        </div>
        <div className="related-list">
          {papers.slice(1).map((paper, index) => (
            <PaperRow
              key={paper.title}
              paper={paper}
              index={index + 1}
              onOpen={() => onMessage("Related paper opened")}
              onDownload={() => onMessage("Document preview is ready")}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function AuthorMini({
  name,
  detail,
  onClick,
}: {
  name: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className="author-mini" onClick={onClick}>
      <span className="author-monogram">
        {name
          .split(" ")
          .map((part) => part[0])
          .join("")}
      </span>
      <span>
        <strong>{name}</strong>
        <small>{detail}</small>
      </span>
      <ChevronRight size={15} />
    </button>
  );
}

function ProfileScreen({
  following,
  setFollowing,
  onOpenPaper,
}: {
  following: boolean;
  setFollowing: (following: boolean) => void;
  onOpenPaper: () => void;
}) {
  const [profileTab, setProfileTab] = useState("Papers");
  return (
    <main className="research-main research-profile-page">
      <div className="profile-layout">
        <aside className="profile-sidebar">
          <img
            className="profile-avatar"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=85"
            alt="Portrait of researcher Maya Chen"
          />
          <span className="research-kicker">Researcher</span>
          <h1>Maya Chen</h1>
          <p>Community ecology and the shared spaces where it takes root.</p>
          <span className="profile-affiliation">
            North Coast Institute
            <br />
            Center for Civic Ecology
          </span>
          <button
            type="button"
            className={`research-button research-button--primary profile-follow${following ? " is-following" : ""}`}
            aria-pressed={following}
            onClick={() => setFollowing(!following)}
          >
            {following ? <Check size={15} /> : <Users size={15} />}
            {following ? "Following" : "Follow researcher"}
          </button>
          <div className="profile-stats">
            <div>
              <strong>1,284</strong>
              <span>Followers</span>
            </div>
            <div>
              <strong>18</strong>
              <span>Papers</span>
            </div>
            <div>
              <strong>7</strong>
              <span>Topics</span>
            </div>
          </div>
        </aside>
        <section className="profile-work">
          <div className="profile-work-heading">
            <div>
              <span className="research-kicker">Research profile</span>
              <h2>Work by Maya</h2>
            </div>
            <button type="button" className="research-text-button">
              Share profile <ArrowUpRight size={14} />
            </button>
          </div>
          <nav className="research-categories profile-tabs" aria-label="Profile content">
            {["Papers", "Projects", "About"].map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={profileTab === item}
                onClick={() => setProfileTab(item)}
              >
                {item}
              </button>
            ))}
          </nav>
          {profileTab === "Papers" ? (
            <div className="results-list profile-paper-list">
              {papers.map((paper, index) => (
                <PaperRow
                  key={paper.title}
                  paper={paper}
                  index={index}
                  onOpen={onOpenPaper}
                  onDownload={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="profile-placeholder">
              <h3>{profileTab === "Projects" ? "Current work" : "About Maya"}</h3>
              <p>
                {profileTab === "Projects"
                  ? "Community gardens as neighborhood infrastructure"
                  : "Maya studies how everyday relationships shape the long-term care of shared urban environments."}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function TopicsScreen({ onSearch }: { onSearch: () => void }) {
  const [topic, setTopic] = useState("Urban Studies");
  return (
    <main className="research-main research-topics-page">
      <div className="research-page-title">
        <div>
          <span className="research-kicker">Explore ideas across fields</span>
          <h1>Research topics</h1>
          <p>Start with a subject. Follow it toward new questions and unexpected connections.</p>
        </div>
      </div>
      <div className="topic-index-layout">
        <aside className="topic-index">
          <span>Browse by field</span>
          {["Social sciences", "Life sciences", "Humanities", "Technology"].map((field, index) => (
            <button
              key={field}
              type="button"
              className={index === 0 ? "is-selected" : ""}
              onClick={() => setTopic(field)}
            >
              {field}
              <ChevronRight size={15} />
            </button>
          ))}
        </aside>
        <section className="topic-detail">
          <div className="topic-detail-head">
            <span className="research-kicker">Field · 01</span>
            <h2>{topic}</h2>
            <p>
              Work that looks closely at how people shape, share, and care for the places they
              inhabit.
            </p>
            <div className="topic-metrics">
              <span>
                <strong>18,420</strong> papers
              </span>
              <span>
                <strong>2,140</strong> researchers
              </span>
            </div>
            <button
              type="button"
              className="research-button research-button--outline"
              onClick={onSearch}
            >
              Explore papers <ArrowRight size={15} />
            </button>
          </div>
          <div className="topic-list">
            <span>Related topics</span>
            {[
              "Community research",
              "Public space",
              "Civic ecology",
              "Environmental justice",
              "Urban design",
              "Neighborhood studies",
            ].map((item, index) => (
              <button type="button" key={item} onClick={() => setTopic(item)}>
                <span>0{index + 1}</span>
                <strong>{item}</strong>
                <ArrowUpRight size={15} />
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function AuthScreen({
  createAccount,
  onNavigate,
  onSubmit,
  message,
}: {
  createAccount: boolean;
  onNavigate: (screen: ResearchScreen) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  message: string;
}) {
  return (
    <main className="research-main research-auth-page">
      <div className="auth-context">
        <span className="research-kicker">A place for your work</span>
        <h1>{createAccount ? "Make space for new questions." : "Return to your research."}</h1>
        <p>Save the sources you find, keep track of ideas, and pick up where you left off.</p>
        <div className="auth-context-note">
          <BookOpen size={18} />
          <span>Your research stays organized around the work itself.</span>
        </div>
      </div>
      <form className="research-auth-form" onSubmit={onSubmit}>
        <span className="research-kicker">MARGIN account</span>
        <h2>{createAccount ? "Create an account" : "Sign in"}</h2>
        <p>
          {createAccount
            ? "Start a research workspace of your own."
            : "Continue to your research workspace."}
        </p>
        <button
          type="button"
          className="research-institution-button"
          onClick={() => onNavigate("Sign in")}
        >
          <Globe2 size={17} />
          Continue with your institution
        </button>
        <div className="auth-divider">
          <span>or use email</span>
        </div>
        {createAccount && (
          <label className="research-field">
            <span>Name</span>
            <input required name="name" autoComplete="name" placeholder="Your name" />
          </label>
        )}
        <label className="research-field">
          <span>Email</span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@university.edu"
          />
        </label>
        <label className="research-field">
          <span>Password</span>
          <input
            required
            type="password"
            name="password"
            autoComplete={createAccount ? "new-password" : "current-password"}
            minLength={8}
            placeholder="At least 8 characters"
          />
        </label>
        {createAccount && (
          <label className="research-terms">
            <input type="checkbox" required />
            <span>I agree to the sample terms and privacy statement.</span>
          </label>
        )}
        <button type="submit" className="research-button research-button--primary auth-submit">
          {createAccount ? "Create account" : "Sign in"}
          <ArrowRight size={15} />
        </button>
        {message && (
          <p className="auth-feedback" role="status">
            {message}
          </p>
        )}
        <p className="auth-switch">
          {createAccount ? "Already have an account?" : "New to MARGIN?"}{" "}
          <button
            type="button"
            onClick={() => onNavigate(createAccount ? "Sign in" : "Create account")}
          >
            {createAccount ? "Sign in" : "Create an account"}
          </button>
        </p>
        <small className="auth-privacy">
          This is a non-connected preview. Form details are not sent or stored.
        </small>
      </form>
    </main>
  );
}

function PremiumScreen({ onNavigate }: { onNavigate: (screen: ResearchScreen) => void }) {
  return (
    <main className="research-main research-premium-page">
      <section className="premium-hero">
        <div>
          <span className="research-kicker">MARGIN research tools</span>
          <h1>
            Spend more time
            <br />
            with the work.
          </h1>
          <p>
            Go deeper into the literature, gather related sources, and follow a field as it changes.
          </p>
          <button
            type="button"
            className="research-button research-button--primary"
            onClick={() => onNavigate("Create account")}
          >
            See membership options <ArrowRight size={15} />
          </button>
        </div>
        <div className="premium-mark">
          <span>
            <Sparkles size={24} />
          </span>
          <small>
            FOR THE NEXT
            <br />
            QUESTION
          </small>
        </div>
      </section>
      <section className="premium-features">
        <div className="research-section-head">
          <div>
            <span className="research-kicker">More room to explore</span>
            <h2>Research tools that stay close to the question.</h2>
          </div>
        </div>
        <div className="premium-feature-list">
          <article>
            <span>01</span>
            <h3>Search across full text</h3>
            <p>Find a phrase or idea inside documents and references.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Gather related work</h3>
            <p>Build a reading list from the literature around one source.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Follow new work</h3>
            <p>Return to saved searches when a field adds something new.</p>
          </article>
        </div>
        <p className="premium-preview-note">
          <LockKeyhole size={14} /> Membership details and pricing appear in the connected account
          experience.
        </p>
      </section>
    </main>
  );
}

function ResearchFooter({
  mobile,
  onNavigate,
}: {
  mobile: boolean;
  onNavigate: (screen: ResearchScreen) => void;
}) {
  return (
    <footer className="research-footer">
      <button
        type="button"
        className="research-wordmark footer-wordmark"
        onClick={() => onNavigate("Home")}
      >
        <span className="research-mark">M</span>
        <span>MARGIN</span>
      </button>
      <span>Research has room to grow.</span>
      {!mobile && (
        <nav aria-label="Footer navigation">
          <button type="button" onClick={() => onNavigate("Search")}>
            Papers
          </button>
          <button type="button" onClick={() => onNavigate("Topics")}>
            Topics
          </button>
          <button type="button" onClick={() => onNavigate("Premium")}>
            Research tools
          </button>
        </nav>
      )}
    </footer>
  );
}
