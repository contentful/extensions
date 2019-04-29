export const eventTypes = {
  REVIEW_REQUESTED: 'REVIEW_REQUESTED',
  REVIEW_REQUEST_CANCELED: 'REVIEW_REQUEST_CANCELED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PUBLISHED: 'PUBLISHED',
};

export const eventNames = {
  [eventTypes.REVIEW_REQUESTED]: 'Review requested',
  [eventTypes.REVIEW_REQUEST_CANCELED]: 'Review canceled',
  [eventTypes.APPROVED]: 'Approved',
  [eventTypes.REJECTED]: 'Rejected',
  [eventTypes.PUBLISHED]: 'Published',
};

export const eventTagTypes = {
  [eventTypes.REVIEW_REQUESTED]: 'primary',
  [eventTypes.REVIEW_REQUEST_CANCELED]: 'warning',
  [eventTypes.APPROVED]: 'positive',
  [eventTypes.REJECTED]: 'negative',
  [eventTypes.PUBLISHED]: 'primary',
};
