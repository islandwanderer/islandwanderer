import { Template } from 'meteor/templating';
// import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Messages } from '/imports/api/message/MessageCollection';
import { Events } from '/imports/api/event/EventCollection';

Template.Message_Page.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Messages.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.context = Messages.getSchema().namedContext('Message_Page');
  this.currentUser = FlowRouter.getParam('username')
});

Template.Message_Page.helpers({
  recentMessages() {
    return Messages.find({}, { sort: { sendDate: 1 } });
  },

  urEvents() {
    const eventList = _.map(Events.findAll(), function (oneEvent) {
      const username = FlowRouter.getParam('username');
      let eventObject = {};
      const checkEventSubscription = _.contains(oneEvent.eventAttending, username);
      if (checkEventSubscription) {
        eventObject = { label: oneEvent.eventName };
      }
      return eventObject;
    });
    return eventList;
  },

// return [{ label: 'event1', value: 'event1' }, { label: 'event2', value: 'event2' }];
//       return {
//         label: oneEvent.eventAttending,
//         selected: _.contains(Template.instance().messageFlags.get(selectedInterestsKey), oneEvent.eventAttending),

});

Template.Message_Page.events({
  'submit .message-body': function (event, instance) {
    event.preventDefault();
    const message = event.target.message.value;
    const events = event.target.events.value;
    const sendDate = new Date();
    const username = FlowRouter.getParam('username');
    const updatedMessageData = { username, events, message, sendDate };

    instance.context.reset();
    const cleanData = Messages.getSchema().clean(updatedMessageData);
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      Messages.insert({
        username: username,
        events: events,
        sendDate: sendDate,
        message: message,
      });
      event.target.reset();
    }
  },
});
