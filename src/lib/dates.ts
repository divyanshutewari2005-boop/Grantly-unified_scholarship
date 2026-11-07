/**
 * Date and deadline utility functions for GRANTLY.
 */

export interface DeadlineUrgency {
  daysLeft: number;
  label: string;
  badgeVariant: 'urgent' | 'warning' | 'neutral' | 'danger';
  isExpired: boolean;
  isClosingSoon: boolean;
}

export function getDaysLeft(deadlineStr: string): number {
  try {
    const target = new Date(deadlineStr);
    target.setHours(23, 59, 59, 999);
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

export function formatIndianDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function getDeadlineUrgency(deadlineStr: string): DeadlineUrgency {
  const days = getDaysLeft(deadlineStr);

  if (days < 0) {
    return {
      daysLeft: days,
      label: 'Expired',
      badgeVariant: 'danger',
      isExpired: true,
      isClosingSoon: false
    };
  }

  if (days === 0) {
    return {
      daysLeft: 0,
      label: 'Closes Today!',
      badgeVariant: 'urgent',
      isExpired: false,
      isClosingSoon: true
    };
  }

  if (days === 1) {
    return {
      daysLeft: 1,
      label: 'Closes Tomorrow',
      badgeVariant: 'urgent',
      isExpired: false,
      isClosingSoon: true
    };
  }

  if (days <= 7) {
    return {
      daysLeft: days,
      label: `${days} days left`,
      badgeVariant: 'urgent',
      isExpired: false,
      isClosingSoon: true
    };
  }

  if (days <= 15) {
    return {
      daysLeft: days,
      label: `${days} days left`,
      badgeVariant: 'warning',
      isExpired: false,
      isClosingSoon: false
    };
  }

  return {
    daysLeft: days,
    label: `${days} days left`,
    badgeVariant: 'neutral',
    isExpired: false,
    isClosingSoon: false
  };
}
