import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Events } from '/imports/api/event/EventCollection';
import { Tags } from '/imports/api/tag/TagCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';

const displayErrorMessages = 'displayErrorMessages';
const selectedTagsKey = 'selectedTags';

export const maxPeopleList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', ' 19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];

Template.Create_Event_Page.onCreated(function onCreated() {
  this.subscribe(Tags.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(selectedTagsKey, undefined);
  this.context = Events.getSchema().namedContext('Create_Event_Page');
});

Template.Create_Event_Page.helpers({

  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  event() {
    return Events.findDoc(FlowRouter.getParam('_id'));
  },
  maxPeoples() {
    return _.map(maxPeopleList, function makemeetupObject(maxPeople) { return { label: maxPeople }; });
  },
  getUser(event) {
    if (event.username === FlowRouter.getParam('username')) { return 1; }
    return 0;
  },
  eventTag() {
    return _.map(Tags.findAll(),
        function makeTagObject(tag) {
          return { label: tag.name };
        });
  },
});

Template.Create_Event_Page.events({
  /* eslint max-len:0 */
  'submit .event-data-form'(event, instance) {
    event.preventDefault();
    const eventName = event.target.eventName.value;
    const max = event.target.maxPeople.value;
    const eventLocation = event.target.eventLocation.value;
    const username = FlowRouter.getParam('username'); // schema requires username.
    const additional = event.target.eventAdditional.value;
    const eventStart = event.target.startDate.value + event.target.startTime.value;
    const eventEnd = event.target.endDate.value + event.target.endTime.value;
    const selectedTags = _.filter(event.target.Tags.selectedOptions, (option) => option.selected);
    const tags = _.map(selectedTags, (option) => option.value);
    const createEventData = { eventName, max, eventLocation, additional, eventStart, eventEnd, tags, username };

    //
    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that createdEventData reflects what will be inserted.
    const cleanData = Events.getSchema().clean(createEventData);
    // Determine validity.
    instance.context.validate(cleanData);
    // Events.insert({ $addToSet: { Events: creator } });

    if (instance.context.isValid()) {
      console.log('calid');
      const userName = FlowRouter.getParam('username');
      const id = Events.define(cleanData);
      const eventID = instance.data.event._id;
      Events.update(eventID, { $push: { attending: userName } });
      instance.messageFlags.set(displayErrorMessages, false);
      instance.find('event-data-form ').reset();
      FlowRouter.go('Event_Page', { username: userName, _id: id });
    } else {
      instance.messageFlags.set(displayErrorMessages, true);
      console.log('invalid');
    }
  },
});

