import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Event */

/**
 * Represents a specific event, such as "Diamond Head Hike".
 * @extends module:Base~BaseCollection
 */
class EventCollection extends BaseCollection {

  /**
   * Creates the Event collection.
   */
  constructor() {
    super('Event', new SimpleSchema({
      eventName: { type: String },
      name: { type: Number, min: 0 },
      maxPeople: { type: String },
      eventDate: { type: String,
        regEx: /^(?:(?:31(\\|-|\\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/ },
      eventTime: { type: String, regEx: /^((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))/ },
      eventLocation: { type: String },
      eventAdditional: { type: String, optional: true },
      eventTags: { type: String, optional: true },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Event.
   * @example
   * Event.define({ eventName: 'Diamond Head Hike',
   *               maxPeople: 25,
   *               eventDate: '12.23.2017,
   *               eventTime: 5 AM,
   *               eventLocation: 'Diamon Head
   *               eventAdditional: 'Bring H20!',
   *               eventTags: 'hiking, diamondHead, overBreak;, });
   * @param { Object } description Object with keys name and description.
   * eventNme must be previously undefined. eventAdditional and eventTags are optional.
   * Creates a "slug" for this name and stores it in the slug field.
   * @throws {Meteor.Error} If the event definition includes a defined name.
   * @returns The newly created docID.
   */
  define({ eventName, eventDate, eventTime, eventLocation, eventAdditional, eventTags }) {
    check(eventName, String);
    check(eventLocation, String);
    check(eventAdditional, String);
    check(eventTags, String);
    check(eventDate, String);
    check(eventTime, String);
    if (this.find({ eventName }).count() > 0) {
      throw new Meteor.Error(`${eventName} is previously defined in another Interest`);
    }
    return this._collection.insert({ eventName, eventDate, eventTime, eventLocation, eventAdditional, eventTags });
  }

  /**
   * Returns the Event name corresponding to the passed event docID.
   * @param eventID An event docID.
   * @returns { String } An event name.
   * @throws { Meteor.Error} If the event docID cannot be found.
   */
  findName(eventID) {
    this.assertDefined(eventID);
    return this.findDoc(eventID).name;
  }

  /**
   * Returns a list of Event names corresponding to the passed list of Event docIDs.
   * @param eventIDs A list of Event docIDs.
   * @returns { Array }
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  findNames(eventIDs) {
    return eventIDs.map(eventID => this.findName(eventID));
  }

  /**
   * Throws an error if the passed eventName is not a defined Event name.
   * @param name The name of an event.
   */
  assertName(name) {
    this.findDoc(name);
  }

  /**
   * Throws an error if the passed list of names are not all Event names.
   * @param names An array of (hopefully) Event names.
   */
  assertNames(names) {
    _.each(names, name => this.assertName(name));
  }

  /**
   * Returns the docID associated with the passed Event name, or throws an error if it cannot be found.
   * @param { String } name An event name.
   * @returns { String } The docID associated with the event.
   * @throws { Meteor.Error } If name is not associated with an Event.
   */
  findID(name) {
    return (this.findDoc(name)._id);
  }

  /**
   * Returns the docIDs associated with the array of Event names, or throws an error if any name cannot be found.
   * If nothing is passed, then an empty array is returned.
   * @param { String[] } names An array of event names.
   * @returns { String[] } The docIDs associated with the names.
   * @throws { Meteor.Error } If any instance is not an Event name.
   */
  findIDs(names) {
    return (names) ? names.map((instance) => this.findID(instance)) : [];
  }

  /**
   * Returns an object representing the Event docID in a format acceptable to define().
   * @param docID The docID of an Event.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.eventName;
    const date = doc.eventDate;
    const time = doc.eventTime;
    const location = doc.eventLocation;
    const additional = doc.eventAdditional;
    const tags = doc.EventTags;
    return { name, date, time, location, additional, tags };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Events = new EventCollection();
