import { BaseModel } from "./base.model";

export class EventModel extends BaseModel {
  constructor(
    id, title, description, location, datetime,
    img_src, created_at, created_by
  ) {
    if (!title) throw 'Event title is required';
    if (!description) throw 'Event description is required';
    if (!location) throw 'Event location is required';

    super(id, created_at, created_by, 'EVENT');
    this.title = title;
    this.description = description;
    this.location = location;
    this.datetime = datetime;
    this.img_src = img_src;
    this.joinRequests = [];
    this.approvedRequests = [];
  }

  RequestToJoin(userId) {
    if (!this.joinRequests)
      this.joinRequests = [];
    this.JoinRequests.push(userId);
  }

  ApproveRequest(userId) {    
    this.joinRequests = this.joinRequests.filter(x => x !== userId);
    if (!this.approvedRequests)
      this.approvedRequests = [];
    this.approvedRequests.push(userId);
  }
}