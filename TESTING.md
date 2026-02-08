# VaultDrive Testing Strategy 🧪

VaultDrive uses **Playwright** for end-to-end (E2E) testing to ensure that critical user journeys remain stable across updates.

## 🏗 Setup
Playwright is configured to run against the Next.js development server. Chromium is the primary test target.

### Dependencies
- `@playwright/test`
- Chromium (browser)

## 🏃 Running Tests
You can run the full E2E suite with a single command:
```bash
npm run test:e2e
```

To run tests in UI mode for debugging:
```bash
npx playwright test --ui
```

## 📂 Test Suites

### 1. Authentication Flow (`auth.spec.ts`)
- **Registration**: Verifies new user creation and API redirection.
- **Login**: Confirms credential validation and dashboard access.
- **Session Persistence**: Ensures JWT sessions survive page reloads.
- **Logout**: Validates session destruction and return to landing.

### 2. File Operations (`files.spec.ts`)
- **Upload**: Verifies file ingestion into the storage layer (Local or S3).
- **Rename**: Tests the unified `PATCH` API and UI updates.
- **Delete**: Confirms removal from storage and database.

### 3. Folder Management (`folders.spec.ts`)
- **Creation**: Validates nested folder markers.
- **Navigation**: Tests breadcrumb logic and deep-link consistency.
- **Recursive Deletion**: Ensures deleting a folder cleans up all child files in the storage provider and DB.

## 🛠 Best Practices
- **Isolation**: Each test suite uses a unique user (`test-${Date.now()}`) to prevent data collisions.
- **Web-First Assertions**: Uses `expect(page.locator(...)).toBeVisible()` to handle hydration and async rendering.
- **API Interception**: Monitors specific API responses (`waitForResponse`) to confirm backend success before proceeding with UI assertions.
