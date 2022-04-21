import { Component, OnInit } from '@angular/core';
import { init } from '@livechat/customer-sdk';

@Component({
  selector: 'app-customer-widget',
  templateUrl: './customer-widget.component.html',
  styleUrls: ['./customer-widget.component.scss']
})
export class CustomerWidgetComponent implements OnInit {
  agentIsOnline = false;
  agentProfilePhoto = null;
  agentName = null;
  customerSDK;

  constructor() {
    this.customerSDK = init({
      licenseId: 14016456,
      clientId: '1a91c60c41a16e5c4d71cbc5a2fc8bc0'
    });
  }

  ngOnInit(): void {
    //console.log(this.customerSDK);

    this.customerSDK.on('connected', payload => {
      const { customer, availability, greeting } = payload;
      
      this.agentIsOnline = payload.availability === "online" ? true : false;
      this.agentProfilePhoto = payload.availability === "online" ? payload.greeting.agent.avatar : null;
      this.agentName = payload.availability === "online" ? payload.greeting.agent.name : null;

      console.log('connected', { customer, availability, greeting });
      
      this.fetchPrechat();
      this.updateQueuingState();

      //this.startNewChat();
      this.queueHasBeenUpdate();
    })

    this.customerSDK.on('new_event', newEvent => {
      console.log(newEvent)
    })
  }

  fetchPrechat(): void {
    this.customerSDK
      .getForm({
        groupId: 0,
        type: 'prechat',
      })
      .then(response => {
        console.log(response);
        if (response.enabled) {
          // prechat form is enabled for this group in the configurator
          console.log(response.form)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  updateQueuingState(): void {
    this.customerSDK.on('queue_position_updated', payload => {
      console.log(payload.chatId)
      console.log(payload.threadId)
      console.log(payload.queue.position)
      console.log(payload.queue.waitTime)
    })
  }

  startNewChat(): void {
    this.customerSDK
      .startChat({
        chat: {
          thread: {
            events: [],
          },
        },
      })
      .then(chat => {
        console.log(chat)
      })
      .catch(error => {
        console.log(error)
      })
  }

  queueHasBeenUpdate(): void {
    this.customerSDK.on('queue_position_updated', payload => {
      console.log(payload.chatId)
      console.log(payload.threadId)
      console.log(payload.queue.position)
      console.log(payload.queue.waitTime)
    })
  }
}
