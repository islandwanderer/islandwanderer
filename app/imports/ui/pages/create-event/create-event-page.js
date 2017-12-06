import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Events } from '/imports/api/event/EventCollection';
import { Tags } from '/imports/api/tag/TagCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Create_Event_Page.onCreated(function onCreated() {
  this.subscribe(Tags.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Events.getSchema().namedContext(' Event_Page');
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
  event() {
    return Events.findDoc(FlowRouter.getParam('username'));
  },
  tags() {
    const event = Events.findDoc(FlowRouter.getParam('username'));
    const selectedTags = event.tags;
    return event && _.map(Tags.findAll(),
        function makeTagObject(tag) {
          return { label: tag.name, selected: _.contains(selectedTags, tag.name) };
        });
  },
  getUsername() {
    return FlowRouter.getParam('username');
  },
});

Template.Create_Event_Page.events({
  /* eslint max-len:0 */
  'submit .event-data-form'(event, instance) {
    event.preventDefault();
    const creator = Profiles.findDoc(FlowRouter.getParam('username'))._id;
    const name = event.target.eventName.value;
    const max = event.target.maxPeople.value;
    const location = event.target.eventLocation.value;
    const username = FlowRouter.getParam('username'); // schema requires username.
    const meetup = event.find('input:radio[name=meetupLocation]:checked');
    const additional = event.target.eventAdditional.value;
    const start = event.target.eventStart.value;
    const end = event.target.eventEnd.value;
    const selectedTags = _.filter(event.target.Tags.selectedOptions, (option) => option.selected);
    const tags = _.map(selectedTags, (option) => option.value);
    Events.insert({ $addToSet: { Events: creator } });

    const createEventData = { creator, name, max, location, meetup, additional, start, end, tags, username };
    const eventTags = { creator, name, location, start, end };
    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that createdEventData reflects what will be inserted.
    const cleanData = Events.getSchema().clean(createEventData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      const docID = Events.findDoc(FlowRouter.getParam('username'))._id;
      const id = Events.insert(docID, { $set: cleanData });
      Events.insert(docID, { $set: eventTags });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
      FlowRouter.go('Home_Page');
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

