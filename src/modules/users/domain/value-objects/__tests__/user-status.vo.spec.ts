import { UserStatus } from '../user-status.vo';

describe('UserStatus', () => {
  it('should create active status by default', () => {
    const status = new UserStatus();
    expect(status.value).toBe(true);
    expect(status.isActive).toBe(true);
    expect(status.isInactive).toBe(false);
  });

  it('should create active status explicitly', () => {
    const status = new UserStatus(true);
    expect(status.value).toBe(true);
    expect(status.isActive).toBe(true);
    expect(status.isInactive).toBe(false);
  });

  it('should create inactive status', () => {
    const status = new UserStatus(false);
    expect(status.value).toBe(false);
    expect(status.isActive).toBe(false);
    expect(status.isInactive).toBe(true);
  });

  it('should activate status', () => {
    const status = new UserStatus(false);
    const activatedStatus = status.activate();
    expect(activatedStatus.value).toBe(true);
    expect(activatedStatus.isActive).toBe(true);
  });

  it('should deactivate status', () => {
    const status = new UserStatus(true);
    const deactivatedStatus = status.deactivate();
    expect(deactivatedStatus.value).toBe(false);
    expect(deactivatedStatus.isInactive).toBe(true);
  });

  it('should return string representation for active', () => {
    const status = new UserStatus(true);
    expect(status.toString()).toBe('active');
  });

  it('should return string representation for inactive', () => {
    const status = new UserStatus(false);
    expect(status.toString()).toBe('inactive');
  });

  it('should compare equality correctly', () => {
    const status1 = new UserStatus(true);
    const status2 = new UserStatus(true);
    const status3 = new UserStatus(false);

    expect(status1.equals(status2)).toBe(true);
    expect(status1.equals(status3)).toBe(false);
  });
});
