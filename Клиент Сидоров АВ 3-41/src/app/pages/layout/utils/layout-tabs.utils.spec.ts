import { getDefaultLayoutPath, getLayoutMenu } from './layout-tabs.utils';

describe('layout tabs utils', () => {
  it('returns empty menu for unknown role', () => {
    expect(getLayoutMenu(null)).toEqual([]);
  });

  it('returns role menu and default path for candidate', () => {
    const menu = getLayoutMenu('candidate');

    expect(menu.length).toBeGreaterThan(0);
    expect(menu[0].path).toBe('candidate/vacancies');
    expect(getDefaultLayoutPath('candidate')).toBe('/layout/candidate/vacancies');
  });

  it('returns admin statistics as default route', () => {
    expect(getDefaultLayoutPath('admin')).toBe('/layout/admin/statistics');
  });
});
