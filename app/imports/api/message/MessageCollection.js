import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
// import { Meteor } from 'meteor/meteor';
// import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

class MessageCollection extends BaseCollection {
  constructor() {
    super('Message', new SimpleSchema({
      username: { type: String },
      event: { type: String },
      message: { type: String },
      datetime: { type: String },
    }, { tracker: Tracker }));
  }

  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const username = doc.username;
    const event = doc.event;
    const message = doc.message;
    const datetime = doc.datetime;
    return { username, message, datetime, event };
  }

  define({
           username, message = '', datetime, event = '',
         }) {
    // make sure required fields are OK.
    const checkPattern = { username: String, message: String, datetime: String, event: String };
    check({ username, message, datetime, event }, checkPattern);
    return this._collection.insert({
      username, message, datetime, event,
    });
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Messages = new MessageCollection();
