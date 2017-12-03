import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Tags } from '/imports/api/tag/TagCollection';
import { Event } from '/imports/api/event/EventCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Create_Event_Page.onCreated(function onCreated() {
  this.subscribe(Tags.getPublicationName());
  this.subscribe(Event.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Event.getSchema().namedContext('Edit_Event_Page');
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
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  event() {
    return Event.findDoc(FlowRouter.getParam('eventName'));
  },
  tags() {
    const event = Events.findDoc(FlowRouter.getParam('eventName'));
    const selectedTags = event.tags;
    return event && _.map(Tags.findAll(),
        function makeTagObject(tag) {
          return { label: tag.name, selected: _.contains(selectedTags, tag.name) };
        });
  },
  getUsername() {
    return Profiles.FlowRouter.getParam('username');
  },
  eventDataField(fieldName) {
    const eventData = Event.findOne(FlowRouter.getParam('_id'));
    // See https://dweldon.silvrback.com/guards to understand '&&' in next line.
    return eventData && eventData[fieldName];
  },
  fieldError(fieldName) {
    const invalidKeys = Template.instance().context.invalidKeys();
    const errorObject = _.find(invalidKeys, (keyObj) => keyObj.name === fieldName);
    return errorObject && Template.instance().context.keyErrorMessage(errorObject.name);
  },
});


Template.Create_Event_Page.events({
  'submit .profile-data-form'(event, instance) {
    event.preventDefault();
    const name = event.target.eventName.value;
    const max = event.target.maxPeople.value;
    const username = FlowRouter.getParam('username'); // schema requires username
    const selectedyear = Event.elements.Year.selectedIndex.options.value;
    const selectedmonth = Event.elements.Month.selectedIndex.options.value;
    const selectedday = Event.elements.Day.selectedIndex.options.value;
    const selecteddate = selectedyear + selectedmonth + selectedday;
    const date = selecteddate;
    const selectedhour = Event.elements.Hour.selectedIndex.options.value;
    const selectedminute = Event.elements.Minute.selectedIndex.options.value;
    const selectedm = Event.elements.meridiem.selectedIndex.options.value;
    const selectedtime = selectedhour + selectedminute + selectedm;
    const time = selectedtime;
    const location = event.elements.Location.selectedIndex.options.value;
    const additional = event.target.eventAdditional.value;
    const selectedTags = _.filter(event.target.Tags.selectedOptions, (option) => option.selected);
    const tags = _.map(selectedTags, (option) => option.value);
    const attending = _.map(event.target.eventAttending.selectedOptions, (option) => option.selected.value);

    const updatedEventData = { name, max, date, time, location, additional, tags, attending, username };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedEventData reflects what will be inserted.
    const cleanData = Event.getSchema().clean(updatedEventData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      const docID = Event.findDoc(FlowRouter.getParam('eventName'))._id;
      Event.update(FlowRouter.getParam('_id'), { $set: cleanData });
      const id = Event.update(docID, { $set: cleanData });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
  'click .delete'(event, instance) {
    const selected = instance.context.get('Event');
    instance.context.remove({ _id: selected });
    FlowRouter.go('Home_Page');
  },
});

