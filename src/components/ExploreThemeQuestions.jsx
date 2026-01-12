import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, RefreshCcw } from "lucide-react";

const STORAGE_KEY = "soundboard_theme_question_favourites_v1";

function safeParseJson(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeQuestionId(themeKey, question) {
  return `${themeKey}::${question}`;
}

export function ExploreThemeQuestions(props) {
  const {
    selectedThemeKey,
    selectedThemeName,
    questionBank,
    count = 4,
  } = props;

  const [open, setOpen] = React.useState(false);
  const [displayQuestions, setDisplayQuestions] = React.useState([]);

  const [favourites, setFavourites] = React.useState(() => {
    if (typeof window === "undefined") return {};
    return safeParseJson(localStorage.getItem(STORAGE_KEY), {});
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
  }, [favourites]);

  const themeKey = selectedThemeKey ?? "";
  const themeQuestions = themeKey ? questionBank[themeKey] ?? [] : [];

  const randomise = React.useCallback(() => {
    if (!themeKey || themeQuestions.length === 0) {
      setDisplayQuestions([]);
      return;
    }

    const picked = shuffle(themeQuestions).slice(
      0,
      Math.min(count, themeQuestions.length)
    );
    setDisplayQuestions(picked);
  }, [themeKey, themeQuestions, count]);

  // Randomise each time it opens
  React.useEffect(() => {
    if (!open) return;
    randomise();
  }, [open, randomise]);

  // Auto change when theme changes while open
  React.useEffect(() => {
    if (!open) return;
    randomise();
  }, [themeKey, open, randomise]);

  const disabled = !selectedThemeKey;
  const themeFavs = favourites[themeKey] ?? {};

  function toggleStar(question) {
    if (!themeKey) return;
    const qid = makeQuestionId(themeKey, question);

    setFavourites((prev) => {
      const nextTheme = { ...(prev[themeKey] ?? {}) };
      nextTheme[qid] = !nextTheme[qid];
      return { ...prev, [themeKey]: nextTheme };
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          title={
            disabled ? "Select a theme first" : "Useful coaching questions"
          }
          className="w-full whitespace-nowrap text-[10px]!"
        >
          Explore this theme
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Explore this theme
            {selectedThemeName ? (
              <span className="ml-2 text-sm font-normal opacity-80">
                {selectedThemeName}
              </span>
            ) : null}
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm opacity-80">Use what fits the moment</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{displayQuestions.length} prompts</Badge>
            <Button
              variant="ghost"
              onClick={randomise}
              disabled={!themeKey || themeQuestions.length === 0}
              title="Refresh questions"
            >
              <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>

        {!themeKey ? (
          <div className="text-sm opacity-80">
            Select a theme to see prompts.
          </div>
        ) : themeQuestions.length === 0 ? (
          <div className="text-sm opacity-80">
            No prompts found for this theme.
          </div>
        ) : (
          <div className="grid gap-3">
            {displayQuestions.map((q) => {
              const qid = makeQuestionId(themeKey, q);
              const starred = Boolean(themeFavs[qid]);

              return (
                <Card key={qid}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm leading-relaxed">{q}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleStar(q)}
                      >
                        <Star
                          className={`h-4 w-4 ${starred ? "fill-current" : ""}`}
                        />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {themeKey && Object.values(themeFavs).some(Boolean) ? (
          <div className="text-xs opacity-70">
            Starred questions are saved on this device.
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
