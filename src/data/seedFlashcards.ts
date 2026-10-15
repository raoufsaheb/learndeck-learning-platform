import type { Flashcard } from '../types/flashcard';

export const SEED_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    courseId: 'frontend-perf',
    category: 'Rendering Engine',
    front: {
      prompt: 'What is "Layout Thrashing" and how does it degrade browser frame rendering?',
      codeSnippet: {
        language: 'typescript',
        code: `elements.forEach(el => {
  const h = el.clientHeight;
  el.style.height = (h + 5) + 'px';
});`,
      },
    },
    back: {
      solution: 'Forced Synchronous Layout',
      explanation: 'Occurs when JavaScript alternates between reading geometry properties and writing styles in a loop, forcing synchronous reflows on each iteration.',
      keyTakeaway: 'Read all measurements first in batch, then mutate styles in a subsequent pass or via requestAnimationFrame.',
    },
    box: 1,
    lastReviewedAt: '2026-10-14T10:00:00.000Z',
    nextReviewDue: '2026-10-15',
    timesReviewed: 3,
    timesCorrect: 2,
  },
  {
    id: 'fc-2',
    courseId: 'frontend-perf',
    category: 'Compositor',
    front: {
      prompt: 'Which two CSS properties can be animated strictly on the GPU compositor thread without triggering layout or paint?',
    },
    back: {
      solution: 'transform and opacity',
      explanation: 'Changes to transform and opacity skip both Layout and Paint stages and are computed directly on the compositor layer on the GPU.',
      keyTakeaway: 'Prefer transform: translate3d() and opacity over top/left/margin for smooth 60fps animations.',
    },
    box: 3,
    lastReviewedAt: '2026-10-08T14:30:00.000Z',
    nextReviewDue: '2026-10-15',
    timesReviewed: 6,
    timesCorrect: 5,
  },
  {
    id: 'fc-3',
    courseId: 'ts-internals',
    category: 'Type System',
    front: {
      prompt: 'What happens when a conditional type evaluates a naked generic parameter with a union type argument?',
      codeSnippet: {
        language: 'typescript',
        code: 'type ToArray<T> = T extends any ? T[] : never;',
      },
    },
    back: {
      solution: 'Union Distribution',
      explanation: 'TypeScript distributes the condition across each branch of the union. For example, ToArray<A | B> evaluates to A[] | B[].',
      keyTakeaway: 'Wrap in tuples `[T] extends [any]` to prevent distributive behavior and preserve (A | B)[].',
    },
    box: 2,
    lastReviewedAt: '2026-10-12T16:00:00.000Z',
    nextReviewDue: '2026-10-15',
    timesReviewed: 4,
    timesCorrect: 3,
  },
  {
    id: 'fc-4',
    courseId: 'react19-arch',
    category: 'React 19',
    front: {
      prompt: 'What tuple elements are returned by React 19’s useActionState hook?',
    },
    back: {
      solution: '[state, formAction, isPending]',
      explanation: 'useActionState manages async state mutations, providing the latest resolved state, the action dispatcher, and pending transition status.',
      keyTakeaway: 'Replaces boilerplate useState + useEffect + isSubmitting flags in form submissions.',
    },
    box: 4,
    lastReviewedAt: '2026-10-01T09:00:00.000Z',
    nextReviewDue: '2026-10-15',
    timesReviewed: 8,
    timesCorrect: 8,
  },
  {
    id: 'fc-5',
    courseId: 'distributed-systems',
    category: 'Consensus',
    front: {
      prompt: 'In Raft consensus, how is the minimum quorum calculated for a cluster of N nodes?',
    },
    back: {
      solution: 'Math.floor(N / 2) + 1',
      explanation: 'A quorum requires a strict majority of nodes to prevent split-brain states where two separate partitions elect independent leaders.',
      keyTakeaway: 'For N=5, quorum=3; for N=3, quorum=2; odd cluster sizes provide optimal fault tolerance.',
    },
    box: 5,
    lastReviewedAt: '2026-09-15T11:00:00.000Z',
    nextReviewDue: '2026-10-15',
    timesReviewed: 12,
    timesCorrect: 12,
  },
  {
    id: 'fc-6',
    courseId: 'frontend-perf',
    category: 'Metrics',
    front: {
      prompt: 'What Core Web Vital metric measures UI responsiveness to user input delays?',
    },
    back: {
      solution: 'INP (Interaction to Next Paint)',
      explanation: 'INP measures the latency of all user interactions (clicks, taps, keystrokes) throughout the page lifecycle, reporting the worst delay.',
      keyTakeaway: 'A good INP score is under 200 milliseconds.',
    },
    box: 2,
    lastReviewedAt: '2026-10-13T10:00:00.000Z',
    nextReviewDue: '2026-10-16',
    timesReviewed: 2,
    timesCorrect: 2,
  },
];
