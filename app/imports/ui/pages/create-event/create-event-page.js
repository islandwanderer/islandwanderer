import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
<<<<<<< HEAD
import { Events } from '/imports/api/Event/EventCollection';
=======
import { Profiles } from '/imports/api/profile/ProfileCollection';
>>>>>>> create-event-page
import { Interests } from '/imports/api/interest/InterestCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

<<<<<<< HEAD
Template.Event_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Events.getSchema().namedContext('Event_Page');
});

Template.Event_Page.helpers({
=======
Template.Profile_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Profiles.getSchema().namedContext('Profile_Page');
});

Template.Profile_Page.helpers({
>>>>>>> create-event-page
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
<<<<<<< HEAD
  Event() {
    return Events.findDoc(FlowRouter.getParam('username'));
  },
  interests() {
    const Event = Events.findDoc(FlowRouter.getParam('username'));
    const selectedInterests = Event.interests;
    return Event && _.map(Interests.findAll(),
=======
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  interests() {
    const profile = Profiles.findDoc(FlowRouter.getParam('username'));
    const selectedInterests = profile.interests;
    return profile && _.map(Interests.findAll(),
>>>>>>> create-event-page
            function makeInterestObject(interest) {
              return { label: interest.name, selected: _.contains(selectedInterests, interest.name) };
            });
  },
  getUsername() {
    return FlowRouter.getParam('username');
  },
});


<<<<<<< HEAD
Template.Event_Page.events({
  'submit .Event-data-form'(event, instance) {
=======
Template.Create_Event_Page.events({
  'submit .profile-data-form'(event, instance) {
>>>>>>> create-event-page
    event.preventDefault();
    const firstName = event.target.First.value;
    const lastName = event.target.Last.value;
    const title = event.target.Title.value;
    const username = FlowRouter.getParam('username'); // schema requires username.
    const picture = event.target.Picture.value;
    const github = event.target.Github.value;
    const facebook = event.target.Facebook.value;
    const instagram = event.target.Instagram.value;
    const bio = event.target.Bio.value;
    const selectedInterests = _.filter(event.target.Interests.selectedOptions, (option) => option.selected);
    const interests = _.map(selectedInterests, (option) => option.value);

<<<<<<< HEAD
    const updatedEventData = { firstName, lastName, title, picture, github, facebook, instagram, bio, interests,
=======
    const updatedProfileData = { firstName, lastName, title, picture, github, facebook, instagram, bio, interests,
>>>>>>> create-event-page
      username };

    // Clear out any old validation errors.
    instance.context.reset();
<<<<<<< HEAD
    // Invoke clean so that updatedEventData reflects what will be inserted.
    const cleanData = Events.getSchema().clean(updatedEventData);
=======
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Profiles.getSchema().clean(updatedProfileData);
>>>>>>> create-event-page
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
<<<<<<< HEAD
      const docID = Events.findDoc(FlowRouter.getParam('username'))._id;
      const id = Events.update(docID, { $set: cleanData });
=======
      const docID = Profiles.findDoc(FlowRouter.getParam('username'))._id;
      const id = Profiles.update(docID, { $set: cleanData });
>>>>>>> create-event-page
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

