import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
// import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Messages } from '/imports/api/message/MessageCollection';
import { Interests } from '/imports/api/interest/InterestCollection';

Template.Message_Page.onCreated(function onCreated() {
  this.subscribe(Messages.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.context = Messages.getSchema().namedContext('Message_Page');
});

Template.Message_Page.helpers({
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  recentMessages() {
    return Messages.find({}, { sort: { createdAt: 1 } });
  },
});

Template.Message_Page.events({
  'submit .message-body': function (event, instance) {
    event.preventDefault();
    const username = event.target.username.value;
    const message = event.target.message.value;
    const datetime = event.target.datetime.value;

    const updatedMessage = { username, message, datetime };

    instance.context.reset();
    const cleanData = Messages.getSchema().clean(updatedMessage);
    instance.context.validate(cleanData);

    Meteor.call('sendMessage', message);

    if (instance.context.isValid()) {
      const docID = Messages.findDoc(FlowRouter.getParam('username'))._id;
      Messages.update(docID, { $set: cleanData });
    }
    this.event.target.message.value = '';

    // return false;
  },
});

