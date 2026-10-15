# Design Research & Visual Identity — LearnDeck

## 1. Aesthetic Direction: Nordic Academic Editorial

LearnDeck avoids playful "cartoon gamification" common in consumer apps, adopting a refined **Nordic Academic Editorial** aesthetic tailored for senior engineers:

- **Deep Slate Canvas (`#0B0F19`)**: An ultra-deep navy-slate background that reduces ocular fatigue during long study sessions.
- **Elevated Slate Surfaces (`#1E293B`, `#161F30`)**: Measured contrast card containers with `#334155` structural dividing borders.
- **Nordic Indigo (`#6366F1`)**: Primary interactive color reflecting focused contemplation, intellectual clarity, and precision.
- **Mastery Emerald (`#10B981`)**: Rewarding success indicators for high retention, correct quiz answers, and module mastery.
- **Streak Amber (`#F59E0B`)**: Subtle, non-anxious notification for daily streaks and overdue Leitner intervals.
- **High-Density Typography**:
  - **Headings & Editorial**: Inter / DM Sans with tight tracking (`-0.025em`) for intellectual authority.
  - **Code & Statistics**: JetBrains Mono tabular figures for code prediction blocks, timestamps, and Leitner box metrics.

---

## 2. Accessibility & Interaction Specs (WCAG 2.1 AA)

- **Keyboard-First Flashcard Interface**:
  - <kbd>Space</kbd> or <kbd>Enter</kbd>: Flip card front/back with smooth 3D CSS transform.
  - <kbd>1</kbd>: Again (Demote to Box 1)
  - <kbd>2</kbd>: Hard (Retain in current Box)
  - <kbd>3</kbd>: Good (Promote to $B_{i+1}$)
  - <kbd>4</kbd>: Easy (Promote to $B_{i+1}$ + bonus XP)
- **High Contrast Focus Rings**: Strict 2px `#6366F1` focus indicators with outline offset on all interactive buttons, card radios, and checkboxes.
- **Screen Reader Announcements**: Live region (`aria-live="polite"`) updates on card flip, quiz question advancement, and score computation.
