import { BaseModel } from "./base.model";

export class EventModel extends BaseModel {
  constructor(
    title, description, location, datetime,
    img_src, created_at, created_by
  ) {
    if (!title) throw 'Event title is required';
    if (!description) throw 'Event description is required';
    if (!location) throw 'Event location is required';

    super(created_at, created_by);
    this.title = title;
    this.description = description;
    this.location = location;
    this.datetime = datetime;
    this.img_src = img_src;
  }
}