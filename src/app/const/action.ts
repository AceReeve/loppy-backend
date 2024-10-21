export enum WorkFlowTrigger {
  WORKFLOW_TRIGGER_BIRHTDAY_REMINDER = 'Birthday Reminder',
  WORKFLOW_TRIGGER_CONTACT_Tag = 'Contact Tag',
  WORKFLOW_TRIGGER_CONTACT_CHANGED = 'Contact Changed',
  WORKFLOW_TRIGGER_CONTACT_CREATED = 'Contact Created',
  WORKFLOW_TRIGGER_CONTACT_DND = 'Contact DND',
  WORKFLOW_TRIGGER_CUSTOM_DATE_REMINDER = 'Custom Date Reminder',
  WORKFLOW_TRIGGER_OPPORTUNITY_STATUS_CHANGED = 'Opportunity Status Changed',
  WORKFLOW_TRIGGER_OPPORTUNITY_CREATED = 'Opportunity Created',
  WORKFLOW_TRIGGER_OPPORTUNITY_CHANGED = 'Opportunity Changed',
  WORKFLOW_TRIGGER_PIPELINE_STAGE_CHANGED = 'Pipeline Stage Changed',
  WORKFLOW_TRIGGER_STALE_OPPORTUNITIES = 'Stale Opportunities',
}

export enum WorkFlowAction {
  WORKFLOW_ACTION_EMAIL = 'Send Email',
  WORKFLOW_ACTION_SMS = 'Send SMS',
  WORKFLOW_ACTION_CREATE_NEW_OPPORTUNITY = 'Create new Opportunity',
}

export enum WorkFlowStatus {
  PUBLISHED = 'Published',
  SAVED = 'Saved',
  ACTIVE = 'Active',
  DELETED = 'Deleted',
}
