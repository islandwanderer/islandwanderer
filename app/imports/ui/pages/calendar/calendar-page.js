import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Events } from '/imports/api/event/EventCollection';

Template.Calendar_Page.onCreated(function onCreated() {
  this.subscribe(Events.getPublicationName());
});

Template.Calendar_Page.onRendered(function onRendered() {
  // wait 3 seconds for subscription to complete
  Meteor.setTimeout(function () {
    $('#event-calendar').fullCalendar({
      header: {
        right: 'today prev,next',
        center: 'title',
        left: '',
      },
    });
  }, 3000);
});


Template.Calendar_Page.helpers({});

Template.Calendar_Page.events({});
