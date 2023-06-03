export class EventModel {
  constructor(
    title, description, location, datetime,
    created_by, created_on, 
    ) {
      this.title = title;
      this.description = description;
      this.location = location;
      this.datetime = datetime;
      this.created_by = created_by;
      this.created_on = created_on;
    }
}