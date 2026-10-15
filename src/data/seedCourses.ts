import type { Course } from '../types/course';
import type { Quiz } from '../types/quiz';

export const SEED_COURSES: Course[] = [
  {
    id: 'frontend-perf',
    title: 'Frontend Performance Systems',
    tagline: 'Master DOM layout thrashing, critical path rendering, and sub-millisecond frame budgets.',
    description: 'An advanced deep-dive into browser rendering engines (Blink/Gecko), memory allocation profiles, and rendering pipeline optimizations for high-throughput client web applications.',
    difficulty: 'Advanced',
    category: 'Architecture',
    iconName: 'Zap',
    estimatedHours: 6,
    xpReward: 650,
    modules: [
      {
        id: 'mod-crp',
        title: 'Critical Rendering Path & Layout Thrashing',
        description: 'Understand how the browser converts HTML, CSS, and JS into pixels, and how to eliminate forced synchronous layouts.',
        estimatedMinutes: 45,
        quizId: 'quiz-crp',
        lessons: [
          {
            id: 'les-crp-1',
            title: 'DOM, CSSOM, and Render Tree Generation',
            readingTimeMinutes: 10,
            contentMarkdown: `### The Pipeline: Parse to Pixels

When the browser fetches an HTML document, it initiates an iterative parsing process:

1. **Bytes to Tokens**: Converts raw HTTP byte streams into W3C standard tokens (\`TagOpen\`, \`TagClose\`, \`Characters\`).
2. **Tokens to Nodes**: Transforms tokens into DOM element nodes with relational pointers.
3. **DOM Construction**: Assembles the parent-child node hierarchy tree.

Simultaneously, CSS parsing builds the **CSSOM** (CSS Object Model). The browser cannot render visible content until CSS is fully downloaded and parsed because CSS is **render-blocking**.

The **Render Tree** combines only visible DOM nodes with their matching computed CSSOM styles (ignoring \`<head>\`, \`<script>\`, and elements with \`display: none\`).`,
            takeaways: [
              { title: 'CSS is Render-Blocking', description: 'CSSOM construction stops layout and paint until the full stylesheet is evaluated.' },
              { title: 'Render Tree Pruning', description: 'display: none elements are excluded from the Render Tree, while visibility: hidden elements occupy layout geometry.' },
            ],
            codeSnippet: {
              language: 'css',
              code: `/* Optimization: Ensure above-the-fold critical CSS is inlined */
<style>
  :root { --brand: #6366f1; }
  body { margin: 0; background: #0b0f19; color: #f8fafc; font-family: sans-serif; }
  .hero { min-height: 100vh; display: grid; place-items: center; }
</style>`,
            },
          },
          {
            id: 'les-crp-2',
            title: 'Eliminating Forced Synchronous Layouts',
            readingTimeMinutes: 12,
            contentMarkdown: `### The Layout Thrashing Trap

A **forced synchronous layout (FSL)** occurs when JavaScript reads geometry properties (e.g., \`offsetWidth\`, \`scrollTop\`, \`getBoundingClientRect()\`) after having modified the DOM in the same frame.

Normally, the browser batches style recalculations and layout passes at the end of the current microtask. When you read geometry prematurely, you force the browser to compute styles and run layout synchronously before answering your JavaScript query.`,
            takeaways: [
              { title: 'Batch Reads and Writes', description: 'Perform all DOM geometry reads first, then execute all DOM mutations together.' },
              { title: 'Use fastdom or requestAnimationFrame', description: 'Schedule layout mutations to the next frame to prevent frame-rate stutter.' },
            ],
            codeSnippet: {
              language: 'typescript',
              code: `// BAD: Read-write interleaved inside a loop (Causes N forced layouts)
elements.forEach((el) => {
  const height = el.offsetHeight; // READ (Forces layout)
  el.style.height = (height + 10) + 'px'; // WRITE (Invalidates layout)
});

// GOOD: Batch reads, then batch writes
const heights = elements.map((el) => el.offsetHeight); // Single READ pass
elements.forEach((el, i) => {
  el.style.height = (heights[i] + 10) + 'px'; // Single WRITE pass
});`,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'ts-internals',
    title: 'TypeScript Type Gymnastics',
    tagline: 'Master recursive conditional types, template literal pattern matching, and type-level arithmetic.',
    description: 'Explore the limits of TypeScript’s Turing-complete type system. Implement zero-runtime type validators, deep immutability guards, and pattern-matching parsers.',
    difficulty: 'Advanced',
    category: 'Language',
    iconName: 'Code',
    estimatedHours: 8,
    xpReward: 800,
    modules: [
      {
        id: 'mod-cond-types',
        title: 'Conditional Types & Distributed Union Invariants',
        description: 'Understand distributive conditional types, naked type parameters, and how to stop accidental union distribution.',
        estimatedMinutes: 50,
        quizId: 'quiz-cond-types',
        lessons: [
          {
            id: 'les-cond-1',
            title: 'Distributive Conditional Types Explained',
            readingTimeMinutes: 12,
            contentMarkdown: `### Naked Type Distribution

In TypeScript, when a generic type parameter \`T\` appears in a conditional type without being wrapped in a tuple or container, it is termed a **naked type parameter**:

\`\`\`typescript
type ToArray<T> = T extends any ? T[] : never;
\`\`\`

When passed a union type (e.g., \`string | number\`), TypeScript automatically distributes the evaluation across each union branch:
\`\`\`typescript
ToArray<string | number>
// Evaluates to: ToArray<string> | ToArray<number>
// Result: string[] | number[]  (NOT (string | number)[])
\`\`\`

To prevent distribution, wrap \`T\` in a single-element tuple: \`[T] extends [any]\`.`,
            takeaways: [
              { title: 'Naked Type Rule', description: 'Conditional types distribute only over bare generic parameters.' },
              { title: 'Tuple Shielding', description: 'Wrapping arguments in [T] prevents union branching and preserves the unified type.' },
            ],
            codeSnippet: {
              language: 'typescript',
              code: `// Non-distributive version
type SafeArray<T> = [T] extends [any] ? T[] : never;

type Res1 = SafeArray<string | number>;
// Result: (string | number)[]`,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'react19-arch',
    title: 'React 19 Architecture',
    tagline: 'Deep dive into Server Actions, useActionState, optimistic updates, and compiler invariants.',
    description: 'Understand modern React 19 mental models: transitions, optimistic UI rollbacks, Server Components serialization boundaries, and the React Compiler.',
    difficulty: 'Intermediate',
    category: 'Framework',
    iconName: 'Layers',
    estimatedHours: 5,
    xpReward: 550,
    modules: [
      {
        id: 'mod-react19-actions',
        title: 'Actions, useActionState & Transitions',
        description: 'Modern asynchronous state management using native React 19 Action primitives.',
        estimatedMinutes: 40,
        quizId: 'quiz-react19-actions',
        lessons: [
          {
            id: 'les-actions-1',
            title: 'The Action Primitive in React 19',
            readingTimeMinutes: 10,
            contentMarkdown: `### What is an Action in React 19?

An Action is an asynchronous transition function passed to elements or hooks. When an Action executes:

1. **Automatic Pending State**: React transitions automatically manage \`isPending\` without manual \`useState(false)\` flags.
2. **Optimistic Updates**: State can be updated immediately using \`useOptimistic\` and rolled back automatically if the Action throws.
3. **Form Integration**: React forms accept Actions directly via \`<form action={fn}>\`.`,
            takeaways: [
              { title: 'useActionState Replacement', description: 'Replaces verbose useEffect + useState combinations for async mutations.' },
              { title: 'Automatic Error Boundaries', description: 'Action rejections integrate cleanly with Error Boundaries and suspense boundaries.' },
            ],
            codeSnippet: {
              language: 'typescript',
              code: `import { useActionState } from 'react';

async function updateProfile(_prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const res = await api.updateName(name);
  return { success: true, user: res };
}

function ProfileForm() {
  const [state, formAction, isPending] = useActionState(updateProfile, null);
  return (
    <form action={formAction}>
      <input name="name" disabled={isPending} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}`,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'distributed-systems',
    title: 'Distributed Systems & Consensus',
    tagline: 'Raft leader election, split-brain hazards, and Paxos state machine replication.',
    description: 'Explore fault-tolerant state machine replication, quorum mathematics, vector clocks, and crash-recovery models in mission-critical backend systems.',
    difficulty: 'Advanced',
    category: 'Systems',
    iconName: 'Server',
    estimatedHours: 7,
    xpReward: 750,
    modules: [
      {
        id: 'mod-raft',
        title: 'Raft Leader Election & Log Replication',
        description: 'Detailed analysis of Raft terms, randomized election timeouts, and appendEntries heartbeats.',
        estimatedMinutes: 55,
        quizId: 'quiz-raft',
        lessons: [
          {
            id: 'les-raft-1',
            title: 'Raft Leader Election States',
            readingTimeMinutes: 12,
            contentMarkdown: `### The Three Raft States

In the Raft consensus algorithm, any node in the cluster exists in one of three states:

1. **Follower**: Passive state responding to heartbeats from the Leader or candidate vote requests.
2. **Candidate**: State entered when an election timeout fires without receiving a leader heartbeat. Increments current term and requests votes.
3. **Leader**: The elected authority handling client writes, appending log entries, and broadcasting heartbeats.

A candidate wins an election if it obtains votes from a **majority (quorum)** of nodes: floor(N/2) + 1.`,
            takeaways: [
              { title: 'Quorum Rule', description: 'A cluster of 5 nodes requires 3 votes; a cluster of 3 nodes requires 2 votes.' },
              { title: 'Randomized Timeouts', description: 'Election timeouts are randomized (e.g. 150-300ms) to prevent split-vote deadlocks.' },
            ],
            codeSnippet: {
              language: 'typescript',
              code: `// Majority calculation
function calculateQuorum(clusterSize: number): number {
  return Math.floor(clusterSize / 2) + 1;
}

console.log(calculateQuorum(5)); // 3
console.log(calculateQuorum(3)); // 2`,
            },
          },
        ],
      },
    ],
  },
];

export const SEED_QUIZZES: Record<string, Quiz> = {
  'quiz-crp': {
    id: 'quiz-crp',
    moduleId: 'mod-crp',
    courseId: 'frontend-perf',
    title: 'Critical Path & Layout Mastery Assessment',
    description: 'Test your understanding of browser rendering phases, reflow hazards, and DOM geometry reads.',
    passingScorePercentage: 75,
    questions: [
      {
        id: 'q-crp-1',
        type: 'single-choice',
        prompt: 'Why does external CSS block the browser from painting the first frame of a web page?',
        options: [
          { id: 'opt-a', text: 'CSS files download on the main JavaScript execution thread.' },
          { id: 'opt-b', text: 'The browser cannot construct the Render Tree until the complete CSSOM is parsed.' },
          { id: 'opt-c', text: 'CSS parser locks the HTTP socket from fetching images.' },
          { id: 'opt-d', text: 'External CSS disables the HTML tokenizer.' },
        ],
        correctAnswerIds: ['opt-b'],
        explanation: 'Because rules later in a stylesheet can cascade and override earlier rules, the browser halts rendering until the CSSOM is completely constructed.',
        xpValue: 40,
      },
      {
        id: 'q-crp-2',
        type: 'code-output',
        prompt: 'What performance anti-pattern is exhibited in the following code block?',
        codeSnippet: {
          language: 'typescript',
          code: `const boxes = document.querySelectorAll('.box');
boxes.forEach((box) => {
  const currentWidth = box.clientWidth;
  box.style.width = \`\${currentWidth * 1.5}px\`;
});`,
        },
        options: [
          { id: 'opt-1', text: 'Memory Leak via Unbound Closure' },
          { id: 'opt-2', text: 'Forced Synchronous Layout (Layout Thrashing)' },
          { id: 'opt-3', text: 'Event Loop Microtask Starvation' },
          { id: 'opt-4', text: 'Uncached DOM Node Collection' },
        ],
        correctAnswerIds: ['opt-2'],
        explanation: 'Alternating between reading geometry (box.clientWidth) and writing style (box.style.width) forces the browser to recalculate styles and re-layout the page on every single iteration.',
        xpValue: 50,
      },
      {
        id: 'q-crp-3',
        type: 'multi-choice',
        prompt: 'Which of the following CSS properties can be animated using the GPU compositor without triggering Layout or Paint?',
        options: [
          { id: 'opt-transform', text: 'transform' },
          { id: 'opt-opacity', text: 'opacity' },
          { id: 'opt-width', text: 'width' },
          { id: 'opt-top', text: 'top' },
        ],
        correctAnswerIds: ['opt-transform', 'opt-opacity'],
        explanation: 'transform and opacity can be executed directly on the GPU compositor thread without triggering CPU layout or paint recalculations.',
        xpValue: 45,
      },
    ],
  },
  'quiz-cond-types': {
    id: 'quiz-cond-types',
    moduleId: 'mod-cond-types',
    courseId: 'ts-internals',
    title: 'TypeScript Conditional Types Evaluation',
    description: 'Verify your mastery over union distribution, type-level pattern matching, and tuple wrapping.',
    passingScorePercentage: 70,
    questions: [
      {
        id: 'q-ts-1',
        type: 'code-output',
        prompt: 'What is the evaluated type of `Result` in the following snippet?',
        codeSnippet: {
          language: 'typescript',
          code: `type Wrap<T> = T extends any ? { value: T } : never;
type Result = Wrap<string | number>;`,
        },
        options: [
          { id: 'opt-a', text: '{ value: string | number }' },
          { id: 'opt-b', text: '{ value: string } | { value: number }' },
          { id: 'opt-c', text: 'never' },
          { id: 'opt-d', text: '{ value: any }' },
        ],
        correctAnswerIds: ['opt-b'],
        explanation: 'Because T is a naked generic parameter in `T extends any`, the conditional type distributes over each member of the union `string | number`.',
        xpValue: 50,
      },
      {
        id: 'q-ts-2',
        type: 'single-choice',
        prompt: 'How can you prevent a generic parameter T from distributing over a union in a conditional type?',
        options: [
          { id: 'opt-1', text: 'Declare T with readonly constraint: `readonly T extends any`' },
          { id: 'opt-2', text: 'Wrap both sides of the condition in single-element tuples: `[T] extends [any]`' },
          { id: 'opt-3', text: 'Use the `unique` keyword before the type name' },
          { id: 'opt-4', text: 'Cast T with `as const`' },
        ],
        correctAnswerIds: ['opt-2'],
        explanation: 'Wrapping T in a tuple `[T] extends [any]` neutralizes the naked parameter rule, treating the union as a single composite type.',
        xpValue: 45,
      },
    ],
  },
  'quiz-react19-actions': {
    id: 'quiz-react19-actions',
    moduleId: 'mod-react19-actions',
    courseId: 'react19-arch',
    title: 'React 19 Actions & Transitions Exam',
    description: 'Examine your knowledge of useActionState, transitions, and automatic pending states.',
    passingScorePercentage: 66,
    questions: [
      {
        id: 'q-r19-1',
        type: 'single-choice',
        prompt: 'What does the useActionState hook in React 19 return as its 3-element tuple?',
        options: [
          { id: 'opt-a', text: '[state, formAction, isPending]' },
          { id: 'opt-b', text: '[data, error, isLoading]' },
          { id: 'opt-c', text: '[mutate, status, reset]' },
          { id: 'opt-d', text: '[state, setState, abort]' },
        ],
        correctAnswerIds: ['opt-a'],
        explanation: 'useActionState returns: [state, formAction, isPending], handling both current state, the dispatchable action handler, and transition pending status.',
        xpValue: 40,
      },
    ],
  },
  'quiz-raft': {
    id: 'quiz-raft',
    moduleId: 'mod-raft',
    courseId: 'distributed-systems',
    title: 'Raft Consensus Protocol Knowledge Check',
    description: 'Verify your understanding of quorums, leader election, and election timeouts.',
    passingScorePercentage: 70,
    questions: [
      {
        id: 'q-raft-1',
        type: 'single-choice',
        prompt: 'In a 5-node Raft cluster, what is the minimum number of nodes required to form a valid quorum?',
        options: [
          { id: 'opt-2', text: '2 nodes' },
          { id: 'opt-3', text: '3 nodes' },
          { id: 'opt-4', text: '4 nodes' },
          { id: 'opt-5', text: 'All 5 nodes' },
        ],
        correctAnswerIds: ['opt-3'],
        explanation: 'Quorum in Raft requires a strict majority: floor(5 / 2) + 1 = 3 nodes.',
        xpValue: 40,
      },
      {
        id: 'q-raft-2',
        type: 'single-choice',
        prompt: 'Why does Raft use randomized election timeouts (e.g. 150-300ms)?',
        options: [
          { id: 'opt-a', text: 'To encrypt vote messages using random seed keys' },
          { id: 'opt-b', text: 'To prevent split-vote deadlocks where multiple candidates start elections simultaneously' },
          { id: 'opt-c', text: 'To balance TCP network socket bandwidth across peers' },
          { id: 'opt-d', text: 'To simulate artificial latency for benchmarking' },
        ],
        correctAnswerIds: ['opt-b'],
        explanation: 'Randomization disperses timeout triggers so one node times out first, requests votes, and establishes leadership before others time out.',
        xpValue: 45,
      },
    ],
  },
};
