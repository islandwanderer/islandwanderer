import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';


Template.Calendar_Page.onRendered(function onRendered() {
  this.$('#events-calendar').fullCalendar();
});

Template.Calendar_Page.onCreated(function onCreated() {
});

Template.Calendar_Page.helpers({
});

Template.Calendar_Page.events({
});
