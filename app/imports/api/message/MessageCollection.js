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
      events: { type: String },
      message: { type: String },
      // sendDate: { type: Date, optional: true },
    }, { tracker: Tracker }));
  }

  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const username = doc.username;
    const events = doc.event;
    const message = doc.message;
    // const sendDate = doc.sendDate;
    return { username, message, events };
  }

  define({ username, message = '', events = '' }) {
    // make sure required fields are OK.
    const checkPattern = { username: String, message: String, events: String };
    check({ username, message, events }, checkPattern);
    return this._collection.insert({
      username, message, events,
    });
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Messages = new MessageCollection();
