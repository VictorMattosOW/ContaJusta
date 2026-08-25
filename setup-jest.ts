import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
try {
  setupZoneTestEnv();
} catch {
  // Angular builder (ng test) já chamou initTestEnvironment()
}
