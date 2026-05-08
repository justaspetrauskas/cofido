import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSyncExternalStore } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const navigationMock = vi.hoisted(() => {
  const listeners = new Set<() => void>();
  const history = ["/"];
  let index = 0;
  let cachedSearch = "";
  let cachedSearchParams = new URLSearchParams();

  const notify = () => {
    cachedSearch = getCurrentSearch();
    cachedSearchParams = new URLSearchParams(cachedSearch);
    listeners.forEach((listener) => listener());
  };

  const getCurrentUrl = () => history[index] ?? "/";
  const getCurrentSearch = () => {
    const url = new URL(getCurrentUrl(), "http://localhost");
    return url.search;
  };

  const push = (href: string) => {
    history.splice(index + 1);
    history.push(href);
    index = history.length - 1;
    notify();
  };

  const replace = (href: string) => {
    history[index] = href;
    notify();
  };

  const back = () => {
    if (index === 0) {
      return;
    }

    index -= 1;
    notify();
  };

  const forward = () => {
    if (index >= history.length - 1) {
      return;
    }

    index += 1;
    notify();
  };

  const reset = (href = "/") => {
    history.splice(0, history.length, href);
    index = 0;
    notify();
  };

  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
    getPathname: () => new URL(getCurrentUrl(), "http://localhost").pathname,
    getSearchParams: () => {
      const search = getCurrentSearch();

      if (search !== cachedSearch) {
        cachedSearch = search;
        cachedSearchParams = new URLSearchParams(search);
      }

      return cachedSearchParams;
    },
    router: {
      push,
      replace,
      back,
      forward,
      prefetch: vi.fn(),
      refresh: vi.fn(),
    },
    reset,
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => navigationMock.router,
  usePathname: () =>
    useSyncExternalStore(navigationMock.subscribe, () => navigationMock.getPathname(), () => "/"),
  useSearchParams: () =>
    useSyncExternalStore(
      navigationMock.subscribe,
      () => navigationMock.getSearchParams(),
      () => new URLSearchParams(),
    ),
}));

import { createRecipe } from "@/lib/brewing";
import { getDefaultCoffeeState, useCoffeeStore } from "@/lib/coffee-store";

import { CoffeeApp } from "./coffee-app";

describe("CoffeeApp", () => {
  beforeEach(() => {
    localStorage.clear();
    navigationMock.reset("/");
    useCoffeeStore.setState(getDefaultCoffeeState(), true);
  });

  it("guides a new user from landing to the composer and straight into brewing", async () => {
    const user = userEvent.setup();

    render(<CoffeeApp />);

    expect(
      screen.getByRole("heading", { name: "A calm guide for better coffee." }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Start Brewing" }));
    await user.click(await screen.findByRole("button", { name: "Choose Pour-over" }, { timeout: 5000 }));

    expect(await screen.findByRole("heading", { name: "Build your brew" })).toBeInTheDocument();
    expect(screen.getAllByText("Pour-over").length).toBeGreaterThan(0);
    expect(screen.getAllByText("1:16").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Start Brewing" }));

    expect(await screen.findByRole("heading", { name: "Heat water" })).toBeInTheDocument();
    expect(screen.getByText("Step 1 of 8")).toBeInTheDocument();
  });

  it("recommends a brew from a taste-first quick start", async () => {
    const user = userEvent.setup();

    render(<CoffeeApp />);

    await user.click(screen.getByRole("button", { name: "Bold" }));
    await user.click(screen.getByRole("button", { name: "3 min" }));
    await user.click(screen.getByRole("button", { name: "Full kit" }));
    await user.click(screen.getByRole("button", { name: "Recommend my brew" }));

    expect(await screen.findByRole("heading", { name: "Build your brew" })).toBeInTheDocument();
    expect(screen.getAllByText("Espresso").length).toBeGreaterThan(0);
    expect(screen.getAllByText("1:15").length).toBeGreaterThan(0);
    expect(screen.getByText("Recommended for bold coffee in 3 min with your full kit.")).toBeInTheDocument();
  });

  it("keeps the active screen in a freer full-bleed layout instead of a framed card", async () => {
    const user = userEvent.setup();

    render(<CoffeeApp />);

    expect(screen.getByTestId("persistent-motion-field")).toHaveAttribute("data-persistent", "true");
    expect(screen.getByTestId("motion-system-root")).toHaveAttribute("data-motion-system", "shared");
    expect(screen.getByTestId("screen-shell")).toHaveAttribute("data-layout", "freeform");
    expect(screen.getByTestId("screen-shell")).toHaveAttribute("data-art-direction", "matisse");
    expect(screen.getByTestId("screen-shell")).toHaveAttribute("data-shared-motion", "enabled");
    expect(screen.getByTestId("screen-shell")).toHaveAttribute("data-spring", "ritual");
    expect(screen.getByTestId("screen-shell")).toHaveAttribute("data-background-overflow", "visible");
    expect(screen.getByTestId("matisse-cutouts")).toBeInTheDocument();
    expect(screen.getByTestId("matisse-cutouts")).toHaveAttribute("data-crop", "none");
    expect(screen.getByTestId("shared-title")).toHaveAttribute("data-shared-element", "title");

    await user.click(screen.getByRole("button", { name: "Start Brewing" }));
    await user.click(await screen.findByRole("button", { name: "Choose Pour-over" }));

    expect(screen.getAllByTestId("persistent-motion-field")).toHaveLength(1);
    expect(screen.getByTestId("screen-shell")).toHaveAttribute("data-layout", "freeform");
    expect(screen.getByTestId("screen-body")).toHaveAttribute("data-density", "airy");
    expect(screen.getByTestId("screen-body")).toHaveAttribute("data-composition", "centered-column");
    expect(screen.getByTestId("screen-shell")).toHaveAttribute("data-art-direction", "matisse");
  });

  it("uses a lighter background motion mode on compact viewports", () => {
    const originalMatchMedia = window.matchMedia;

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("max-width: 768px"),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<CoffeeApp />);

    expect(screen.getByTestId("persistent-motion-field")).toHaveAttribute("data-performance-mode", "lite");
    expect(screen.queryByTestId("matisse-cutouts")).not.toBeInTheDocument();

    window.matchMedia = originalMatchMedia;
  });

  it("reads deep links and browser history from route state", async () => {
    navigationMock.reset("/?view=compose&method=french-press");

    render(<CoffeeApp />);

    expect(screen.getByRole("heading", { name: "Build your brew" })).toBeInTheDocument();
    expect(screen.getAllByText("French Press").length).toBeGreaterThan(0);

    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Change method" }));
    expect(await screen.findByRole("heading", { name: "Choose a brew method" })).toBeInTheDocument();

    navigationMock.router.back();

    expect(await screen.findByRole("heading", { name: "Build your brew" })).toBeInTheDocument();
    expect(screen.getAllByText("French Press").length).toBeGreaterThan(0);
  });

  it("updates recipe stats when the cup size and brew ratio controls change", async () => {
    const user = userEvent.setup();

    render(<CoffeeApp />);

    await user.click(screen.getByRole("button", { name: "Start Brewing" }));
    await user.click(await screen.findByRole("button", { name: "Choose Pour-over" }));

    expect(await screen.findByRole("button", { name: "Balanced · 1:16" })).toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: "Strength" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Balanced · 1:16" })).toHaveAttribute(
      "data-selected",
      "true",
    );
    expect(screen.getAllByText("1:16").length).toBeGreaterThan(0);
    expect(screen.getByText("15 g")).toBeInTheDocument();
    expect(screen.getByText("240 ml")).toBeInTheDocument();
    expect(screen.getByText("Method cues")).toBeInTheDocument();
    expect(screen.getByText("Drawdown too fast: grind finer or slow the pour.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "4 cups" }));
    await user.click(screen.getByRole("button", { name: "Bold · 1:15" }));

    expect(screen.getByRole("button", { name: "Bold · 1:15" })).toHaveAttribute(
      "data-selected",
      "true",
    );
    expect(screen.getAllByText("1:15").length).toBeGreaterThan(0);
    expect(screen.getByText("64 g")).toBeInTheDocument();
    expect(screen.getByText("960 ml")).toBeInTheDocument();
    expect(screen.getByText("Bolder body with a tighter ratio.")).toBeInTheDocument();
  });

  it("keeps advanced options hidden until needed and applies skill changes in place", async () => {
    const user = userEvent.setup();

    render(<CoffeeApp />);

    await user.click(screen.getByRole("button", { name: "Start Brewing" }));
    await user.click(await screen.findByRole("button", { name: "Choose Pour-over" }));

    expect(await screen.findByRole("button", { name: "Advanced options" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Intermediate" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Advanced options" }));
    await user.click(screen.getByRole("button", { name: "Intermediate" }));
    await user.click(screen.getByRole("button", { name: "Scale" }));

    expect(screen.getByRole("button", { name: "Intermediate" })).toHaveAttribute(
      "data-selected",
      "true",
    );
    expect(screen.getByRole("button", { name: "Scale" })).toHaveAttribute("data-selected", "true");
    expect(screen.getByText("Skill: Intermediate")).toBeInTheDocument();
  });

  it("shows and clears missing equipment guidance in composer as gear selection changes", async () => {
    const user = userEvent.setup();

    render(<CoffeeApp />);

    await user.click(screen.getByRole("button", { name: "Start Brewing" }));
    await user.click(await screen.findByRole("button", { name: "Choose Pour-over" }));
    expect(await screen.findByRole("heading", { name: "Build your brew" })).toBeInTheDocument();

    expect(
      screen.getByText(
        "Missing required equipment for Pour-over: Kettle, Filters. Add gear in Advanced options or change method.",
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Advanced options" }));
    await user.click(screen.getByRole("button", { name: "Kettle" }));
    await user.click(screen.getByRole("button", { name: "Filters" }));

    expect(
      screen.queryByText(
        "Missing required equipment for Pour-over: Kettle, Filters. Add gear in Advanced options or change method.",
      ),
    ).not.toBeInTheDocument();
  });

  it("renders abstract motion scenes on the key ritual surfaces", async () => {
    const user = userEvent.setup();

    render(<CoffeeApp />);

    expect(screen.getByTestId("ambient-scene-landing")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Start Brewing" }));
    await user.click(await screen.findByRole("button", { name: "Choose Pour-over" }));

    expect(await screen.findByTestId("ambient-scene-composer")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Start Brewing" }));

    expect(await screen.findByTestId("ambient-scene-brewing")).toBeInTheDocument();

    const recipe = createRecipe({
      method: "pour-over",
      cups: 1,
      skillLevel: "beginner",
      strength: 55,
      equipment: [],
    });

    useCoffeeStore.setState({
      ...getDefaultCoffeeState(),
      completionSummary: {
        recipe,
        startedAt: 1_000,
        completedAt: 2_000,
        feedback: null,
      },
    });

    render(<CoffeeApp />);

    expect(screen.getAllByTestId("ambient-scene-completion").length).toBeGreaterThan(0);
  });

  it("lets the user slide through brew method cards with animated illustrations", async () => {
    const user = userEvent.setup();

    render(<CoffeeApp />);

    await user.click(screen.getByRole("button", { name: "Start Brewing" }));

    expect(await screen.findByRole("heading", { name: "Choose a brew method" })).toBeInTheDocument();
    expect(screen.getAllByText("Pour-over").length).toBeGreaterThan(0);
    expect(screen.getByTestId("method-illustration-pour-over")).toBeInTheDocument();
    expect(screen.getByTestId("method-illustration-stage")).toHaveAttribute("data-art-style", "matisse");
    expect(screen.getByTestId("method-illustration-stage")).toHaveAttribute("data-background", "transparent");
    expect(screen.getByTestId("method-illustration-stage")).toHaveAttribute("data-alignment", "centered");
    expect(screen.getByText("10 min ritual")).toBeInTheDocument();
    expect(screen.getByText("Clarity first")).toBeInTheDocument();
    expect(screen.getByText("Kettle + filter")).toBeInTheDocument();
    expect(screen.getByTestId("method-slider-stage")).toHaveAttribute("data-controls-visible", "true");

    fireEvent.keyDown(screen.getByTestId("method-slider-stage"), {
      key: "ArrowRight",
      code: "ArrowRight",
    });

    expect(await screen.findByRole("button", { name: "Choose French Press" })).toBeInTheDocument();

    fireEvent.keyDown(screen.getByTestId("method-slider-stage"), { key: "ArrowLeft", code: "ArrowLeft" });

    expect(await screen.findByRole("button", { name: "Choose Pour-over" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next method" }));

    expect(await screen.findByTestId("method-illustration-french-press")).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: "Choose French Press" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous method" }));

    expect(await screen.findByRole("button", { name: "Choose Pour-over" })).toBeInTheDocument();
  });

  it("renders recognizable visual markers for each brewing method illustration", async () => {
    const user = userEvent.setup();

    render(<CoffeeApp />);

    await user.click(screen.getByRole("button", { name: "Start Brewing" }));

    expect(await screen.findByTestId("method-illustration-pour-over")).toBeInTheDocument();
    expect(screen.getByTestId("method-feature-pour-over-dripper")).toBeInTheDocument();
    expect(screen.getByTestId("method-feature-pour-over-kettle-stream")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next method" }));
    expect(await screen.findByTestId("method-illustration-french-press")).toBeInTheDocument();
    expect(screen.getByTestId("method-feature-french-press-plunger")).toBeInTheDocument();
    expect(screen.getByTestId("method-feature-french-press-handle")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next method" }));
    expect(await screen.findByTestId("method-illustration-aeropress")).toBeInTheDocument();
    expect(screen.getByTestId("method-feature-aeropress-chamber")).toBeInTheDocument();
    expect(screen.getByTestId("method-feature-aeropress-plunger")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next method" }));
    expect(await screen.findByTestId("method-illustration-espresso")).toBeInTheDocument();
    expect(screen.getByTestId("method-feature-espresso-portafilter")).toBeInTheDocument();
    expect(screen.getByTestId("method-feature-espresso-cup")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next method" }));
    expect(await screen.findByTestId("method-illustration-cold-brew")).toBeInTheDocument();
    expect(screen.getByTestId("method-feature-cold-brew-jar")).toBeInTheDocument();
    expect(screen.getByTestId("method-feature-cold-brew-ice")).toBeInTheDocument();
  });

  it("shows the returning-user dashboard with a saved recipe and active brew", () => {
    const recipe = createRecipe({
      method: "french-press",
      cups: 2,
      skillLevel: "intermediate",
      strength: 70,
      equipment: ["grinder", "kettle", "scale"],
    });

    useCoffeeStore.setState({
      ...getDefaultCoffeeState(),
      savedRecipes: [
        {
          id: "saved-1",
          name: "Weekend Press",
          createdAt: 2_000,
          feedback: "perfect",
          recipe,
        },
      ],
      activeBrew: {
        id: "brew-1",
        recipe,
        startedAt: 1_000,
        currentStepIndex: 2,
        status: "paused",
        timerStartedAt: null,
        remainingTimerSeconds: null,
      },
    });

    render(<CoffeeApp />);

    expect(screen.getByRole("heading", { name: "Welcome back" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue last brew" })).toBeInTheDocument();
    expect(screen.getByText("Paused on Add coffee")).toBeInTheDocument();
    expect(screen.getAllByText("Weekend Press").length).toBeGreaterThan(0);
  });

  it("surfaces adaptive next-brew guidance and recent wins on the dashboard", async () => {
    const user = userEvent.setup();
    const frenchPressRecipe = createRecipe({
      method: "french-press",
      cups: 2,
      skillLevel: "intermediate",
      strength: 55,
      equipment: ["grinder", "kettle", "scale"],
    });
    const aeropressRecipe = createRecipe({
      method: "aeropress",
      cups: 1,
      skillLevel: "beginner",
      strength: 55,
      equipment: ["kettle"],
    });

    navigationMock.reset("/?view=dashboard");
    useCoffeeStore.setState({
      ...getDefaultCoffeeState(),
      savedRecipes: [
        {
          id: "saved-1",
          name: "Daily Press",
          createdAt: 3_000,
          feedback: "too-weak",
          recipe: frenchPressRecipe,
        },
        {
          id: "saved-2",
          name: "Bright Aero",
          createdAt: 2_000,
          feedback: "perfect",
          recipe: aeropressRecipe,
        },
      ],
    });

    render(<CoffeeApp />);

    expect(screen.getByText("Recommended next brew")).toBeInTheDocument();
    expect(screen.getByText("Try Daily Press at 1:15 next.")).toBeInTheDocument();
    expect(screen.getByText("Recent win")).toBeInTheDocument();
    expect(screen.getAllByText("Bright Aero").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Use suggestion" }));
    expect(await screen.findByRole("heading", { name: "Build your brew" })).toBeInTheDocument();
    expect(screen.getAllByText("French Press").length).toBeGreaterThan(0);
    expect(screen.getAllByText("1:15").length).toBeGreaterThan(0);
  });

  it("lets the brewing action buttons pause, skip a timer, and continue to the next step", async () => {
    const user = userEvent.setup();
    const now = Date.now();
    const recipe = createRecipe({
      method: "pour-over",
      cups: 1,
      skillLevel: "beginner",
      strength: 55,
      equipment: [],
    });

    navigationMock.reset("/?view=brewing");
    useCoffeeStore.setState({
      ...getDefaultCoffeeState(),
      activeBrew: {
        id: "brew-1",
        recipe,
        startedAt: now,
        currentStepIndex: 4,
        status: "brewing",
        timerStartedAt: now,
        remainingTimerSeconds: 30,
      },
    });

    render(<CoffeeApp />);

    expect(screen.getByRole("heading", { name: "Bloom" })).toBeInTheDocument();
    expect(screen.getByTestId("brew-progress")).toHaveAttribute("data-emphasis", "primary");
    expect(screen.getByText("Press space to pause or resume.")).toBeInTheDocument();
    expect(screen.getByText("Next: Pour in circles")).toBeInTheDocument();
    expect(screen.getByText("Remaining guided time: 3 min 15s")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Skip timer" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Lost my place" })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: " ", code: "Space" });
    expect(screen.getByRole("button", { name: "Resume" })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: " ", code: "Space" });
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Pause" }));
    expect(screen.getByRole("button", { name: "Resume" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Lost my place" }));
    expect(
      screen.getByText("Finish bloom, then move to Pour in circles. Cue: Wet every ground and let it breathe."),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Skip timer" }));
    expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(await screen.findByRole("heading", { name: "Pour in circles" })).toBeInTheDocument();
  });

  it("renders a circular SVG progress ring on the brewing timer that reflects remaining time", () => {
    const now = Date.now();
    const recipe = createRecipe({
      method: "pour-over",
      cups: 1,
      skillLevel: "beginner",
      strength: 55,
      equipment: [],
    });

    // Step index 4 is "Bloom" with timerSeconds=45
    navigationMock.reset("/?view=brewing");
    useCoffeeStore.setState({
      ...getDefaultCoffeeState(),
      activeBrew: {
        id: "brew-timer-ring",
        recipe,
        startedAt: now,
        currentStepIndex: 4,
        status: "paused",
        timerStartedAt: null,
        remainingTimerSeconds: 45,
      },
    });

    render(<CoffeeApp />);

    expect(screen.getByTestId("timer-ring-svg")).toBeInTheDocument();

    const progressArc = screen.getByTestId("timer-ring-progress");
    expect(progressArc).toBeInTheDocument();
    expect(progressArc).toHaveAttribute("data-remaining", "45");
    expect(progressArc).toHaveAttribute("data-total", "45");

    // Step index 5 (no timer) — shows "none" for total
    useCoffeeStore.setState({
      ...getDefaultCoffeeState(),
      activeBrew: {
        id: "brew-timer-ring-no-timer",
        recipe,
        startedAt: now,
        currentStepIndex: 7,
        status: "paused",
        timerStartedAt: null,
        remainingTimerSeconds: null,
      },
    });

    render(<CoffeeApp />);

    const progressArcNoTimer = screen.getAllByTestId("timer-ring-progress").at(-1)!;
    expect(progressArcNoTimer).toHaveAttribute("data-remaining", "none");
    expect(progressArcNoTimer).toHaveAttribute("data-total", "none");
  });

  it("shows step progress dots on the brewing screen to indicate completed, current, and remaining steps", () => {
    const now = Date.now();
    const recipe = createRecipe({
      method: "pour-over",
      cups: 1,
      skillLevel: "beginner",
      strength: 55,
      equipment: [],
    });

    // pour-over has 8 steps; step index 4 is "Bloom"
    navigationMock.reset("/?view=brewing");
    useCoffeeStore.setState({
      ...getDefaultCoffeeState(),
      activeBrew: {
        id: "brew-step-dots",
        recipe,
        startedAt: now,
        currentStepIndex: 4,
        status: "paused",
        timerStartedAt: null,
        remainingTimerSeconds: 45,
      },
    });

    render(<CoffeeApp />);

    const dotsContainer = screen.getByTestId("brew-step-dots");
    expect(dotsContainer).toBeInTheDocument();

    const dots = dotsContainer.querySelectorAll("[data-testid='brew-step-dot']");
    expect(dots).toHaveLength(8);

    // Steps 0-3 are complete
    for (let i = 0; i < 4; i++) {
      expect(dots[i]).toHaveAttribute("data-state", "complete");
      expect(dots[i]).toHaveAttribute("aria-label", `Step ${i + 1}, complete`);
    }

    // Step 4 is current
    expect(dots[4]).toHaveAttribute("data-state", "current");
    expect(dots[4]).toHaveAttribute("aria-label", "Step 5, current");

    // Steps 5-7 are remaining
    for (let i = 5; i < 8; i++) {
      expect(dots[i]).toHaveAttribute("data-state", "remaining");
      expect(dots[i]).toHaveAttribute("aria-label", `Step ${i + 1}`);
    }
  });

  it("marks the brewing timer section as centered-layout so the ring is the visual anchor", () => {
    const now = Date.now();
    const recipe = createRecipe({
      method: "pour-over",
      cups: 1,
      skillLevel: "beginner",
      strength: 55,
      equipment: [],
    });

    navigationMock.reset("/?view=brewing");
    useCoffeeStore.setState({
      ...getDefaultCoffeeState(),
      activeBrew: {
        id: "brew-centered-layout",
        recipe,
        startedAt: now,
        currentStepIndex: 4,
        status: "paused",
        timerStartedAt: null,
        remainingTimerSeconds: 45,
      },
    });

    render(<CoffeeApp />);

    expect(screen.getByTestId("timer-stage")).toHaveAttribute("data-layout", "centered");
  });

  it("shows the timer countdown inside the ring center and removes it from below the ring", () => {
    const now = Date.now();
    const recipe = createRecipe({
      method: "pour-over",
      cups: 1,
      skillLevel: "beginner",
      strength: 55,
      equipment: [],
    });

    // Step index 4 is "Bloom" with timerSeconds=45 and visual="steam"
    navigationMock.reset("/?view=brewing");
    useCoffeeStore.setState({
      ...getDefaultCoffeeState(),
      activeBrew: {
        id: "brew-ring-countdown",
        recipe,
        startedAt: now,
        currentStepIndex: 4,
        status: "paused",
        timerStartedAt: null,
        remainingTimerSeconds: 45,
      },
    });

    render(<CoffeeApp />);

    const ringContent = screen.getByTestId("timer-ring-content");
    expect(ringContent).toHaveTextContent("00:45");
    expect(ringContent).not.toHaveTextContent("steam");

    // Step index 7 is "Serve" with no timer and visual="cup"
    useCoffeeStore.setState({
      ...getDefaultCoffeeState(),
      activeBrew: {
        id: "brew-ring-ready",
        recipe,
        startedAt: now,
        currentStepIndex: 7,
        status: "paused",
        timerStartedAt: null,
        remainingTimerSeconds: null,
      },
    });

    render(<CoffeeApp />);

    const ringContents = screen.getAllByTestId("timer-ring-content");
    const lastRingContent = ringContents.at(-1)!;
    expect(lastRingContent).toHaveTextContent("Ready");
    expect(lastRingContent).not.toHaveTextContent("cup");
  });

  it("lets completion and dashboard buttons save a recipe and start a new brew", async () => {
    const user = userEvent.setup();
    const recipe = createRecipe({
      method: "french-press",
      cups: 2,
      skillLevel: "intermediate",
      strength: 70,
      equipment: ["grinder", "kettle"],
    });

    navigationMock.reset("/?view=completion");
    useCoffeeStore.setState({
      ...getDefaultCoffeeState(),
      completionSummary: {
        recipe,
        startedAt: 1_000,
        completedAt: 2_000,
        feedback: null,
      },
    });

    render(<CoffeeApp />);

    expect(screen.queryByText("Fix my next cup")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Too weak" }));
    expect(screen.getByText("Fix my next cup")).toBeInTheDocument();
    expect(screen.getByText("Steep 30 seconds longer next time.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Too strong" }));
    expect(screen.getByText("Use a slightly coarser grind next time.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Save Recipe" }));
    expect(await screen.findByRole("heading", { name: "Welcome back" })).toBeInTheDocument();
    expect(screen.getByText("French Press for 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Brew again" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Start new brew" }));
    expect(await screen.findByRole("heading", { name: "Choose a brew method" })).toBeInTheDocument();
  });
});
