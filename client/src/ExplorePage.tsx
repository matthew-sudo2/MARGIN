import { useMemo, useState } from "react";
import { ArrowUpRight, SearchX } from "lucide-react";
import { EmptyState, SearchInput } from "./components";
import type { Paper } from "./data";

export default function ExplorePage({
  papers,
  onOpenPaper,
}: {
  papers: Paper[];
  onOpenPaper: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All research areas");

  const domains = useMemo(
    () => Array.from(new Set(papers.map((paper) => paper.domain).filter(Boolean))).sort(),
    [papers],
  );
  const filteredPapers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return papers.filter((paper) => {
      const matchesDomain = selectedDomain === "All research areas" || paper.domain === selectedDomain;
      const searchable = [paper.title, paper.authors, paper.domain, paper.venue, paper.abstract]
        .join(" ")
        .toLocaleLowerCase();
      return matchesDomain && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [papers, query, selectedDomain]);

  return (
    <section aria-label="Explore research" className="space-y-7">
      <div className="max-w-2xl">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search papers, authors, and research areas"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[#d9d7cd] pb-4">
        <span className="mr-1 text-[12px] font-medium text-[#71766e]">Research areas</span>
        {["All research areas", ...domains].map((domain) => (
          <button
            key={domain}
            type="button"
            aria-pressed={selectedDomain === domain}
            onClick={() => setSelectedDomain(domain)}
            className={`text-left text-[13px] transition-colors ${
              selectedDomain === domain
                ? "font-semibold text-[#465440]"
                : "text-[#71766e] hover:text-[#292d29]"
            }`}
          >
            {domain}
          </button>
        ))}
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <h2 className="font-serif text-[22px] text-[#292d29]">Papers</h2>
          <span className="text-[12px] text-[#71766e]">
            {filteredPapers.length} {filteredPapers.length === 1 ? "result" : "results"}
          </span>
        </div>

        {filteredPapers.length ? (
          <ul className="divide-y divide-[#d9d7cd]">
            {filteredPapers.map((paper) => (
              <li key={paper.id}>
                <button
                  type="button"
                  onClick={() => onOpenPaper(paper.id)}
                  className="group flex w-full items-start justify-between gap-5 py-5 text-left"
                >
                  <span className="min-w-0">
                    <span className="block text-[16px] font-medium leading-6 text-[#292d29] group-hover:text-[#465440]">
                      {paper.title}
                    </span>
                    <span className="mt-1 block text-[13px] leading-5 text-[#71766e]">
                      {paper.authors}
                    </span>
                    <span className="mt-2 block text-[12px] leading-5 text-[#71766e]">
                      {[paper.venue, paper.year, paper.domain].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    size={17}
                    className="mt-1 shrink-0 text-[#8a8d84] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#465440]"
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={<SearchX size={22} />}
            title="No papers found"
            description="Try a different search or research area."
          />
        )}
      </div>
    </section>
  );
}
