import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Events } from '/imports/api/event/EventCollection';
Template.Calendar_Page.onCreated(function onCreated() {
  this.subscribe(Events.getPublicationName());
});
Template.Calendar.onRendered(function onRendered() {
  $('#event-calendar').fullCalendar({
    header: {
      right: 'today prev,next',
      center: 'title',
      left: '',
    },
  });
});
Template.Calendar_Page.helpers({});
Template.Calendar_Page.events({});