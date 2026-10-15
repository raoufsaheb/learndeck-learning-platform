import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CourseCatalog } from '../src/components/courses/CourseCatalog';
import { CourseCard } from '../src/components/courses/CourseCard';
import { SEED_COURSES } from '../src/data/seedCourses';

describe('Course Catalog & Components', () => {
  it('renders all course cards in catalog', () => {
    render(<CourseCatalog onStartQuiz={vi.fn()} />);

    expect(screen.getByText('Frontend Performance Systems')).toBeInTheDocument();
    expect(screen.getByText('TypeScript Type Gymnastics')).toBeInTheDocument();
    expect(screen.getByText('React 19 Architecture')).toBeInTheDocument();
    expect(screen.getByText('Distributed Systems & Consensus')).toBeInTheDocument();
  });

  it('filters courses by category pill', async () => {
    const user = userEvent.setup();
    render(<CourseCatalog onStartQuiz={vi.fn()} />);

    // Click 'Language' category pill
    const langPill = screen.getByRole('tab', { name: 'Language' });
    await user.click(langPill);

    expect(screen.getByText('TypeScript Type Gymnastics')).toBeInTheDocument();
    expect(screen.queryByText('Frontend Performance Systems')).not.toBeInTheDocument();
  });

  it('filters courses by search query', async () => {
    const user = userEvent.setup();
    render(<CourseCatalog onStartQuiz={vi.fn()} />);

    const searchInput = screen.getByPlaceholderText(/search tracks/i);
    await user.type(searchInput, 'Raft');

    expect(screen.getByText('Distributed Systems & Consensus')).toBeInTheDocument();
    expect(screen.queryByText('React 19 Architecture')).not.toBeInTheDocument();
  });

  it('renders CourseCard metadata and difficulty', () => {
    const course = SEED_COURSES[0];
    render(<CourseCard course={course} onSelectCourse={vi.fn()} />);

    expect(screen.getByText(course.title)).toBeInTheDocument();
    expect(screen.getByText(course.difficulty)).toBeInTheDocument();
    expect(screen.getByText(`+${course.xpReward} XP`)).toBeInTheDocument();
  });
});
