export const ContactEnum = {
  PHONE: 'phone',
  EMAIL: 'email',
} as const;

export type ContactType = (typeof ContactEnum)[keyof typeof ContactEnum];
