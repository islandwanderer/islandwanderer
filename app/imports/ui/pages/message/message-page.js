import { Template } from 'meteor/templating';
// import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Messages } from '/imports/api/message/MessageCollection';

Template.Message_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Messages.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.context = Messages.getSchema().namedContext('Message_Page');
});

Template.Message_Page.helpers({
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  interests() {
    const profile = Profiles.findDoc(FlowRouter.getParam('username'));
    const selectedInterests = profile.interests;
    return profile && _.map(Interests.findAll(),
        function makeInterestObject(interest) {
          return { label: interest.name, selected: _.contains(selectedInterests, interest.name) };
        });
  },
  recentMessages() {
    return Messages.find({}, { sort: { sendDate: 1 } });
  },
});

Template.Message_Page.events({
  'submit .new-message': function (event, instance) {
    const message = event.target.message.value;
    const events = event.target.event.value;
    const sendDate = event.target.sendDate.value;
    const username = event.target.username.value;
    // Meteor.call('sendMessage', text);
    const updatedMessageData = { message, events, sendDate, username };

    instance.context.reset();
    const cleanData = Profiles.getSchema().clean(updatedMessageData)
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      const docID = Profiles.findDoc(FlowRouter.getParam('username'))._id;
      Messages.update(docID, { $set: cleanData });
      this.event.target.text.value = '';
    }

    // return false;
  },

});

