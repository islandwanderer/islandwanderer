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
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  event() {
    return Event.findDoc(FlowRouter.getParam('eventName'));
  },
  tags() {
    const event = Profiles.findDoc(FlowRouter.getParam('eventName'));
    const selectedTags = event.tags;
    return event && _.map(Tags.findAll(),
            function makeTagObject(tag) {
              return { label: tag.name, selected: _.contains(selectedTags, tag.name) };
            });
  },
  getUsername() {
    return Profiles.FlowRouter.getParam('username');
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

    const updatedProfileData = { name, max, date, time, location, additional, tags,
      username };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Profiles.getSchema().clean(updatedProfileData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      const docID = Profiles.findDoc(FlowRouter.getParam('username'))._id;
      const id = Profiles.update(docID, { $set: cleanData });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

