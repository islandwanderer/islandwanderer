import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { Tags } from '/imports/api/tag/TagCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Event */

/**
 * Events provide portfolio data for a user.
 * @extends module:Base~BaseCollection
 */
class EventCollection extends BaseCollection {

  /**
   * Creates the Event collection.
   */
  constructor() {
    super('Event', new SimpleSchema({
      creator: { type: String },
      eventName: { type: String },
      maxPeople: { type: String, regEx: /^\d[3]$/ },
      eventDate: { type: String },
      eventTime: { type: String },
      tags: { type: Array, optional: true },
      'tags.$': { type: String },
      eventLocation: { type: String },
      meetupLocation: { type: String },
      eventAdditional: { type: String, optional: true },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Event.
   * @example
   * Events.define({ eventName: 'Diamond Head Hike',
   *                   maxPeople: '20',
   *                   creator: 'kieraw',
   *                   eventDate: '12-12-2017',
   *                   tags: [' Hike ', ' Sunset ', 'Diamond Head '],
   *                   eventTime: ' 5 PM ',
   *                   eventLocation: ' Diamond Head',
   *                   meetupLocation: ' At Location',
   *                   eventAdditional: ' Bring Water',
   * @param { Object } description Object with required key eventName.
   * eventName must be unique for all events.
   * Tags is an array of defined tag names.
   * @throws { Meteor.Error } If a user with the supplied eventName already exists, or
   * if one or more tags are not defined
   * @returns The newly created docID.
   */
  define({ eventName = '', maxPeople = '', creator, eventDate = '', tags = [], eventTime = '', eventLocation = '', meetupLocation = '',
      eventAdditional = '' }) {
    // make sure required fields are OK.
    const checkPattern = { eventName: String, eventDate: String, username: String, eventTime: String, eventLocation: String,
      meetupLocation: String, eventAdditional: String };
    check({ eventName, eventDate, creator, eventTime, eventLocation, meetupLocation, eventAdditional }, checkPattern);

    if (this.find({ eventName }).count() > 0) {
      throw new Meteor.Error(`${eventName} is previously defined Event`);
    }

    // Throw an error if any of the passed Tag names are not defined.
    Tags.assertNames(tags);

    // Throw an error if there are duplicates in the passed tag names.
    if (tags.length !== _.uniq(tags).length) {
      throw new Meteor.Error(`${tags} contains duplicates`);
    }
    return this._collection.insert({ eventName, maxPeople, eventDate, creator, eventTime, eventLocation, meetupLocation, eventAdditional, Tags });
  }

  /**
   * Returns an object representing the Event docID in a format acceptable to define().
   * @param docID The docID of a Event.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.eventName;
    const max = doc.maxPeople;
    const creator = doc.creator;
    const date = doc.eventDate;
    const tags = doc.tags;
    const time = doc.eventTime;
    const location = doc.eventLocation;
    const meetup = doc.meetupLocation;
    const additional = doc.eventAdditional;
    return { name, max, creator, date, tags, time, location, meetup, additional };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Events = new EventCollection();
