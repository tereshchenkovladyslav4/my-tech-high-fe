export enum StudentStatus {
  PENDING = 0,
  ACTIVE = 1,
  WITHDRAWN = 2,
  GRADUATED = 3,
  APPLIED = 5,
  ACCEPTED = 6,
  REAPPLIED = 7,
  /**
   * Packet is deleted by Admin
   */
  DELETED = 8,
  /**
   * This is not stored DB and used to pass the filter option
   */
  MID_YEAR = 50,
}
