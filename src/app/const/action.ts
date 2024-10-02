export enum WorkFlowTrigger {
  WORKFLOW_TRIGGER_BIRHTDAY_REMINDER = 'Birthday Reminder',
  WORKFLOW_TRIGGER_CONTACT_Tag = 'Contact Tag',
  WORKFLOW_TRIGGER_CONTACT_CHANGED = 'Contact Changed',
  WORKFLOW_TRIGGER_CONTACT_CREATED = 'Contact Created',
  WORKFLOW_TRIGGER_CONTACT_DND = 'Contact DND',
  WORKFLOW_TRIGGER_CUSTOM_DATE_REMINDER = 'Custom Date Reminder',
}

export enum WorkFlowAction {
  WORKFLOW_ACTION_EMAIL = 'Send Email',
  WORKFLOW_ACTION_SMS = 'Send SMS',
}

export enum WorkFlowStatus {
  PUBLISHED = 'Published',
  SAVED = 'Saved',
  ACTIVE = 'Active',
  DELETED = 'Deleted',
}
