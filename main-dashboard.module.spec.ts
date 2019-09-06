import { MainDashboardModule } from './main-dashboard.module';

describe('MainDashboardModule', () => {
  let mainDashboardModule: MainDashboardModule;

  beforeEach(() => {
    mainDashboardModule = new MainDashboardModule();
  });

  it('should create an instance', () => {
    expect(mainDashboardModule).toBeTruthy();
  });
});
