import {
  Home as HomeIcon,
  SlidersVertical,
  CircleDot,
  MessagesSquare,
  Building2,
  Target,
  Puzzle,
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { TM } from "@/lib/themes";
import { getTheme } from "@/lib/themeData";
import Home from "@/pages/Home";
import SoundDesk from "@/pages/SoundDesk";
import ThemeDynamics from "@/pages/ThemeDynamics";
import Communication from "@/pages/Communication";
import BalconiesBasements from "@/pages/BalconiesBasements";
import StrengthsStrategy from "@/pages/StrengthsStrategy";
import ConnectThemes from "@/pages/ConnectThemes";

const PAGES = [
  { id: "home", label: "Home", icon: HomeIcon, Page: Home },
  {
    id: "connect",
    label: "Connect With Your Themes",
    icon: Puzzle,
    Page: ConnectThemes,
    desc: "Match each theme with what it brings and what it needs to be at its best.",
  },
  {
    id: "soundboard",
    label: "Sound Desk",
    icon: SlidersVertical,
    Page: SoundDesk,
    desc: "Mix your top five themes like a live sound desk and notice what you dial up or down.",
  },
  {
    id: "dynamics",
    label: "Theme Dynamics",
    icon: CircleDot,
    Page: ThemeDynamics,
    desc: "Explore how your themes work together as a package to create success.",
  },
  {
    id: "communication",
    label: "Strengths & Communication",
    icon: MessagesSquare,
    Page: Communication,
    desc: "Understand how each theme communicates and how your style shifts across situations.",
  },
  {
    id: "balconies",
    label: "Balconies & Basements",
    icon: Building2,
    Page: BalconiesBasements,
    desc: "See each theme at its best and when overused, and notice where you are today.",
  },
  {
    id: "strategy",
    label: "Strengths Strategy",
    icon: Target,
    Page: StrengthsStrategy,
    desc: "Aim your strengths at a current goal, opportunity or challenge.",
  },
];

export default function App() {
  const [page, setPage] = useLocalStorage("hub:page", "home");
  const [selected, setSelected] = useLocalStorage("hub:themes", []);
  const [participant, setParticipant] = useLocalStorage("hub:participant", "");
  const [logo, setLogo] = useLocalStorage("hub:logo", "");
  const themes = selected.map(getTheme).filter(Boolean);

  const go = (id) => {
    setPage(id);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="app">
      <aside className="sidebar no-print">
        <button className="brand" onClick={() => go("home")}>
          Strengths
          <br />
          Exploration Hub
        </button>
        <nav className="nav">
          {PAGES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              onClick={() => go(id)}
            >
              <Icon size={17} strokeWidth={1.7} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        {themes.length > 0 && (
          <div className="side-themes">
            <div className="side-label">Your themes</div>
            {themes.map((t, i) => (
              <div key={t.key} className="side-theme">
                <span className="dot" style={{ background: t.colour }} />
                <span className="rank">{i + 1}</span>
                <TM>{t.name}</TM>
              </div>
            ))}
            <button className="link" onClick={() => go("home")}>
              Change themes
            </button>
          </div>
        )}
      </aside>

      <main className="main">
        {/* Fixed in print, so the logo sits top right on every PDF page. */}
        {logo && <img className="print-only print-logo" src={logo} alt="" />}
        {PAGES.map(({ id, Page }) => {
          // Pages stay mounted so session notes survive switching activities.
          const needsThemes = id !== "home" && themes.length === 0;
          return (
            <div key={id} hidden={page !== id}>
              {needsThemes ? (
                <NoThemes onGo={() => go("home")} />
              ) : (
                <Page
                  themes={themes}
                  selected={selected}
                  setSelected={setSelected}
                  participant={participant}
                  setParticipant={setParticipant}
                  logo={logo}
                  setLogo={setLogo}
                  go={go}
                  pages={PAGES}
                />
              )}
            </div>
          );
        })}
        <footer className="legal">
          <span className="print-only">
            Strengths Exploration Hub ·{" "}
          </span>
          
          Gallup<span className="mark">®</span>, CliftonStrengths
          <span className="mark">®</span> and the 34 CliftonStrengths theme
          names are trademarks of Gallup, Inc.
        </footer>
      </main>
    </div>
  );
}

function NoThemes({ onGo }) {
  return (
    <div className="empty-page">
      <h2>Choose your themes first</h2>
      <p>
        Select your themes once on the Home page and they will be ready in every
        activity.
      </p>
      <button className="btn primary" onClick={onGo}>
        Choose my themes
      </button>
    </div>
  );
}
