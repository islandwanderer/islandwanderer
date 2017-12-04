import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Events } from '/imports/api/event/EventCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Create_Event_Page.onCreated(function onCreated() {
  this.subscribe(Events.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Profiles.getSchema().namedContext('Profile_Page');
});

Template.Create_Event_Page.helpers({
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  events() {
    return Events.findDoc(FlowRouter.getParam('eventName'));
  },
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  tags() {
    const events = Events.findDoc(FlowRouter.getParam('eventName'));
    const selectedTags = events.tags;
    return events && _.map(Tags.findAll(),
            function makeTagObject(tag) {
              return { label: tag.name, selected: _.contains(selectedTags, tags.name) };
            });
  },
  getUsername() {
    return FlowRouter.getParam('eventName');
  },
});


Template.Create_Event_Page.events({
  'submit .event-data-form'(event, instance) {
    event.preventDefault();
    const creator = event.target.username.value;
    const name = event.target.eventName.value;
    const max = event.target.maxPeople.value;
    const username = FlowRouter.getParam('eventName'); // schema requires username.
    const date = event.target.eventDate.selected.value;
    const time = event.target.eventTime.selected.value;
    const meetup = event.target.meetupLocation.selected.value;
    const additional = event.target.eventAdditional.value;
    const location = event.target.location.value;
    const selectedTags = _.filter(event.target.Tags.selectedOptions, (option) => option.selected);
    const tags = _.map(selectedTags, (option) => option.value);

    const updatedEventData = { creator, name, max, date, time, meetup, location, additional, tags,
      username };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Events.getSchema().clean(updatedEventData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      const docID = Events.findDoc(FlowRouter.getParam('username'))._id;
      const id = Events.update(docID, { $set: cleanData });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

