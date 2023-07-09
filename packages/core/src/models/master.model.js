import { BaseModel } from "./base.model";

export class MasterModel extends BaseModel {
  constructor(id, fullname, location, img_src, created_at, created_by) {
    if (!fullname) throw 'Master fullname is required.';
    if (!location) throw 'Master location is required.';
    super(id, created_at, created_by, 'MASTER')
    this.fullname = fullname;
    this.location = location;
    this.img_src = img_src;
  }
}