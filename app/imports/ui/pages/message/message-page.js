import { Template } from 'meteor/templating';
// import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
// import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Messages } from '/imports/api/message/MessageCollection';

Template.Message_Page.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Messages.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.context = Messages.getSchema().namedContext('Message_Page');
});

Template.Message_Page.helpers({
  recentMessages() {
    return Messages.find({}, { sort: { username: 1 } });
  },
});

Template.Message_Page.events({
  'submit .message-body': function (event, instance) {
    event.preventDefault();
    const message = event.target.message.value;
    const events = event.target.event.value;
    // const sendDate = new Date();
    const username = FlowRouter.getParam('username');
    const updatedMessageData = { username, message, events };

    console.log(updatedMessageData);
    instance.context.reset();
    const cleanData = Messages.getSchema().clean(updatedMessageData);
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      console.log('valid');
      const docID = Messages.findDoc(FlowRouter.getParam('username'))._id;
      Messages.update(docID, { $set: cleanData });
      this.event.target.text.value = '';
    } else {
      console.log('invalid');
    }
  },
});
