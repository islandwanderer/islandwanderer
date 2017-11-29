import { Template } from 'meteor/templating';
// import { Event } from '../../api/events/events.js';

Template.Event_Page.helpers({

  /**
   * @returns {*} All of the Events documents.
   */
  contactsList() {
    // return Event.find();
  },
});

Template.Event_Page.onCreated(function onCreated() {
  this.subscribe('Events');
});
