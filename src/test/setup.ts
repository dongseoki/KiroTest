// Test setup file
import { beforeEach, afterEach, vi } from 'vitest';

// Mock localStorage for tests
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock navigator for PWA features
Object.defineProperty(window, 'navigator', {
  value: {
    ...window.navigator,
    onLine: true,
    serviceWorker: {
      register: vi.fn().mockResolvedValue({}),
    },
  },
});

// Clean up after each test
beforeEach(() => {
  // Reset localStorage mock
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
});

afterEach(() => {
  // Clean up DOM
  document.body.innerHTML = '';
});