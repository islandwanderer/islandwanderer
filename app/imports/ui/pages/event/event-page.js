import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
// import { _ } from 'meteor/underscore';
import { Events } from '/imports/api/event/EventCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Event_Page.onCreated(function onCreated() {
  this.subscribe(Events.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Events.getSchema().namedContext('Event_Page');
});

Template.Event_Page.helpers({
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  event() {
    return Events.findDoc(FlowRouter.getParam('eventName'));
  },
  getUsername() {
    return FlowRouter.getParam('eventName');
  },
});

Template.Event_Page.events({
  'submit .event-data-form'(event, instance) {
    event.preventDefault();
    const name = event.target.eventName.value;
    const max = event.target.maxPeople.value;
    const username = FlowRouter.getParam('eventName'); // schema requires username.
    const date = event;
    const time = event;
    const meetup = event;
    const additional = event.target.eventAdditional.value;
    const tags = event.target.tags.value;
    const attending = event;

    const updatedEventData = {
      name,
      max,
      username,
      date,
      time,
      meetup,
      additional,
      tags,
      attending,
    };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedEventData reflects what will be inserted.
    const cleanData = Events.getSchema().clean(updatedEventData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      const docID = Events.findDoc(FlowRouter.getParam('eventName'))._id;
      const id = Events.update(docID, { $set: cleanData });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

