# AI Assistant Coding Guidelines & Workflow

This document outlines the required workflow, coding standards, and best practices for AI assistants working on this codebase.

---

## 1. Always Review Code First

**Before making any changes, you must:**

- ✅ **View and analyze existing code** using the `view` tool
- ✅ **Use `codebase-retrieval`** to understand current implementations and patterns
- ✅ **Search for similar functionality** that already exists in the codebase
- ✅ **Verify assumptions** by checking actual code, never assume structure without verification
- ❌ **Never make changes** based on assumptions about code you haven't seen

**Example workflow:**
```
1. User requests a feature
2. Use codebase-retrieval to find similar implementations
3. View relevant files to understand current patterns
4. Propose solution based on actual code review
5. Get approval before implementing
```

---

## 2. Task Planning & Management

**For any complex work:**

- ✅ **Create a detailed task list** using task management tools
- ✅ **Break down changes** into clear, actionable steps (each ~20 minutes of work)
- ✅ **Get user approval** on the plan before implementing
- ✅ **Update task states** as work progresses
- ❌ **Never start implementation** without a clear plan for complex features

**Task states:**
- `[ ]` = Not started
- `[/]` = In progress
- `[x]` = Completed
- `[-]` = Cancelled

---

## 3. Context Gathering

**Always gather complete context:**

- ✅ **Ask for full context** if information is missing or unclear
- ✅ **Check related modules** and existing implementations before suggesting changes
- ✅ **Look for existing utilities/components** that can be reused
- ✅ **Use `codebase-retrieval`** to find similar patterns already in use
- ✅ **Review type definitions** to understand data structures
- ✅ **Check API endpoints** to understand backend contracts
- ❌ **Never proceed** with incomplete information

**Key areas to check:**
- Type definitions (`app/types/`)
- API services (`app/services/`)
- Existing hooks (`app/hooks/`)
- Similar components (`app/components/`)
- Route handlers (`app/routes/`)

---

## 4. Code Quality Standards

**Maintain high code quality:**

- ✅ **Keep code clean** and self-documenting
- ✅ **Use descriptive variable/function names**
- ✅ **Follow existing patterns** in the codebase
- ✅ **Maintain consistent formatting** with existing code
- ✅ **Propose changes first** and wait for approval before implementing
- ❌ **DO NOT add code comments** unless explicitly requested by the user
- ❌ **DO NOT make self-assumed changes** without user approval
- ❌ **DO NOT deviate** from established patterns without discussion

**Code style:**
- Use TypeScript strict typing
- Prefer functional components with hooks
- Use `useMemo` and `useCallback` for performance optimization
- Follow React best practices
- Use TanStack Query for data fetching

---

## 5. Testing Responsibility

**Important: Testing is the USER's responsibility**

- ✅ **Suggest test scenarios** after implementing changes
- ✅ **Provide clear instructions** on how to test changes
- ✅ **Explain expected behavior** for each change
- ✅ **Document edge cases** that should be tested
- ❌ **DO NOT assume** tests will be run automatically
- ❌ **DO NOT claim** something works without user confirmation

**After implementing changes, always:**
1. Explain what was changed
2. List expected behavior
3. Suggest specific test scenarios
4. Wait for user feedback on testing results

---

## 6. Reusability First

**Before creating new code:**

- ✅ **Search for existing components/utilities** that can be reused
- ✅ **Look for similar implementations** in the codebase
- ✅ **Prefer extending existing code** over creating duplicates
- ✅ **Use existing patterns** as templates for new features
- ✅ **Check for shared utilities** in common directories
- ❌ **DO NOT create duplicate functionality**
- ❌ **DO NOT reinvent the wheel**

**Common reusable patterns in this codebase:**
- Query hooks factory (`app/hooks/queryHookFactory.ts`)
- API service builder (`app/services/apiServiceBuilder.ts`)
- Form components and validation patterns
- Table components with filtering/sorting
- Modal/dialog patterns

---

## 7. Error Handling & Debugging

**When errors occur:**

- ✅ **Ask for complete error messages** including stack traces
- ✅ **Request API response details** (status, payload, headers)
- ✅ **Check network tab** information if available
- ✅ **Verify data flow** from UI → API → Backend
- ✅ **Compare with working implementations**
- ❌ **DO NOT guess** at solutions without proper diagnosis
- ❌ **DO NOT make multiple changes** without testing each one

**Debugging workflow:**
1. Get complete error information
2. Identify the exact failure point
3. Review related code
4. Propose targeted fix
5. Get approval before implementing

---

## 8. Communication Standards

**When interacting with users:**

- ✅ **Be clear and concise** in explanations
- ✅ **Provide context** for proposed changes
- ✅ **Explain trade-offs** when multiple solutions exist
- ✅ **Ask clarifying questions** when requirements are unclear
- ✅ **Acknowledge mistakes** and propose corrections
- ❌ **DO NOT use flattery** or unnecessary praise
- ❌ **DO NOT make assumptions** about user intent
- ❌ **DO NOT proceed** without clear approval for significant changes

---

## 9. Package Management

**For dependency management:**

- ✅ **Use appropriate package managers** (npm, yarn, pnpm)
- ✅ **Run package manager commands** instead of editing config files
- ✅ **Check existing dependencies** before adding new ones
- ❌ **DO NOT manually edit** `package.json`, `requirements.txt`, etc.
- ❌ **DO NOT add dependencies** without user approval

**Examples:**
- Use `npm install <package>` instead of editing `package.json`
- Use `pip install <package>` instead of editing `requirements.txt`

---

## 10. File Operations

**When working with files:**

- ✅ **Use `str-replace-editor`** for editing existing files
- ✅ **Use `save-file`** for creating new files
- ✅ **Make targeted edits** rather than rewriting entire files
- ✅ **Preserve existing code** that isn't being changed
- ❌ **DO NOT delete and recreate** files to make edits
- ❌ **DO NOT use shell commands** for file editing

---

## 11. Technology Stack Reference

**This project uses:**

- **Frontend:** React 19, TypeScript, Remix
- **Styling:** Tailwind CSS
- **Data Fetching:** TanStack Query (React Query)
- **Forms:** React Hook Form (where applicable)
- **Date Handling:** date-fns
- **Icons:** Lucide React
- **Backend API:** NestJS (MongoDB)

**Key patterns:**
- Route-based file structure (`app/routes/`)
- Component-based architecture (`app/components/`)
- Custom hooks for data fetching (`app/hooks/`)
- Centralized API services (`app/services/`)
- TypeScript interfaces for type safety (`app/types/`)

---

## 12. Common Pitfalls to Avoid

❌ **DO NOT:**
- Make changes without reviewing existing code first
- Add comments unless explicitly requested
- Create duplicate functionality
- Assume code structure without verification
- Proceed with incomplete context
- Make multiple unrelated changes at once
- Edit package files manually
- Delete and recreate files for edits
- Use `useEffect` when `useMemo` or computed values would work
- Fetch data on every filter change (prefer client-side filtering)
- Create infinite loops with improper dependency arrays

✅ **DO:**
- Review code before making changes
- Ask for clarification when needed
- Reuse existing patterns and components
- Get approval before implementing
- Make targeted, focused changes
- Use appropriate tools for each task
- Follow established patterns
- Optimize for performance (useMemo, useCallback)
- Implement client-side filtering when possible
- Test dependency arrays to avoid infinite loops

---

## 13. Approval Required For

**Always get user approval before:**

- Installing or removing dependencies
- Making architectural changes
- Creating new files or directories
- Refactoring existing code
- Changing API contracts or types
- Modifying database schemas
- Deploying or committing code
- Making breaking changes
- Adding new features beyond the original request

---

## Summary

**The Golden Rules:**

1. 📖 **Review first, code later**
2. 📋 **Plan complex work with tasks**
3. 🔍 **Gather complete context**
4. 🎯 **Reuse before creating**
5. ✋ **Get approval before implementing**
6. 🧪 **User tests, you suggest**
7. 💬 **Communicate clearly**
8. 🚫 **No comments unless requested**

Following these guidelines ensures high-quality, maintainable code that aligns with project standards and user expectations.

GIT_AUTHOR_DATE="2025-10-06T12:00:00" GIT_COMMITTER_DATE="2025-10-06T12:00:00" git commit --amend --no-edit --date="2025-10-06T12:00:00"