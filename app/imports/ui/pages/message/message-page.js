import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Tags } from '/imports/api/tag/TagCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Message_Page.onCreated(function onCreated() {
  this.subscribe(Tags.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Profiles.getSchema().namedContext('Profile_Page');
});

Template.Message_Page.helpers({
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
  iags() {
    const profile = Profiles.findDoc(FlowRouter.getParam('username'));
    const selectedTags = profile.iags;
    return profile && _.map(Tags.findAll(),
            function makeTagObject(iag) {
              return { label: iag.name, selected: _.contains(selectedTags, iag.name) };
            });
  },
  recentMessages() {
    return Messages.find({}, { sort: { createdAt: 1 } });
  },
});

Template.Message_Page.events({
  'submit .new-message': function (event) {
    const text = event.target.text.value;
    Meteor.call('sendMessage', text);
    event.target.text.value = '';
    return false;
  },
  // 'submit .profile-data-form'(event, instance) {
  //   event.preventDefault();
  //   const firstName = event.target.First.value;
  //   const lastName = event.target.Last.value;
  //   const title = event.target.Title.value;
  //   const username = FlowRouter.getParam('username'); // schema requires username.
  //   const picture = event.target.Picture.value;
  //   const github = event.target.Github.value;
  //   const facebook = event.target.Facebook.value;
  //   const instagram = event.target.Instagram.value;
  //   const bio = event.target.Bio.value;
  //   const selectedTags = _.filter(event.target.Tags.selectedOptions, (option) => option.selected);
  //   const iags = _.map(selectedTags, (option) => option.value);
  //
  //   const updatedProfileData = { firstName, lastName, title, picture, github, facebook, instagram, bio, iags,
  //     username };
  //
  //   // Clear out any old validation errors.
  //   instance.context.reset();
  //   // Invoke clean so that updatedProfileData reflects what will be inserted.
  //   const cleanData = Profiles.getSchema().clean(updatedProfileData);
  //   // Determine validity.
  //   instance.context.validate(cleanData);
  //
  //   if (instance.context.isValid()) {
  //     const docID = Profiles.findDoc(FlowRouter.getParam('username'))._id;
  //     const id = Profiles.update(docID, { $set: cleanData });
  //     instance.messageFlags.set(displaySuccessMessage, id);
  //     instance.messageFlags.set(displayErrorMessages, false);
  //   } else {
  //     instance.messageFlags.set(displaySuccessMessage, false);
  //     instance.messageFlags.set(displayErrorMessages, true);
  //   }
  // },
});

