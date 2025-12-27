// Main application entry point
import './styles/main.css';

// Import core types and interfaces
import type { AppState, AppSettings } from '@/types';

// Application initialization
class BackHealthApp {
  private appState: AppState;
  private _settings: AppSettings; // Will be used in future tasks

  constructor() {
    this.appState = {
      currentView: 'dashboard',
      isOnline: navigator.onLine,
      lastSync: new Date(),
      notifications: []
    };

    this._settings = {
      theme: 'light',
      language: 'ko',
      dataRetentionDays: 365,
      autoBackup: true,
      offlineMode: false
    };

    this.init();
  }

  private async init(): Promise<void> {
    console.log('허리건강 관리 앱 초기화 중...');
    
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker 등록 성공:', registration);
      } catch (error) {
        console.error('Service Worker 등록 실패:', error);
      }
    }

    // Initialize UI event listeners
    this.initializeEventListeners();
    
    // Load saved data
    await this.loadAppData();
    
    console.log('앱 초기화 완료');
  }

  private initializeEventListeners(): void {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = (e.target as HTMLElement).getAttribute('href')?.substring(1);
        if (target) {
          this.navigateTo(target as AppState['currentView']);
        }
      });
    });

    // Online/offline status
    window.addEventListener('online', () => {
      this.appState.isOnline = true;
      console.log('온라인 상태로 변경됨');
    });

    window.addEventListener('offline', () => {
      this.appState.isOnline = false;
      console.log('오프라인 상태로 변경됨');
    });
  }

  private navigateTo(view: AppState['currentView']): void {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    // Show target view
    const targetView = document.getElementById(`${view}-view`);
    const targetLink = document.querySelector(`[href="#${view}"]`);
    
    if (targetView) {
      targetView.classList.add('active');
    }
    if (targetLink) {
      targetLink.classList.add('active');
    }

    this.appState.currentView = view;
  }

  private async loadAppData(): Promise<void> {
    try {
      // This will be implemented when LocalStorageService is created
      console.log('앱 데이터 로딩...');
    } catch (error) {
      console.error('앱 데이터 로딩 실패:', error);
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BackHealthApp();
});