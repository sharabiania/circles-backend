export class BaseModel {
  constructor(id, created_at, created_by) {
    this.id = id;
    this.created_at = created_at;
    this.created_by = created_by;
  }
}