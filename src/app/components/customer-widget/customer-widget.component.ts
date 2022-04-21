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
      this.listChats();
      
      //this.getChatData();
      //this.updateQueuingState();

      //this.startNewChat();
      //this.queueHasBeenUpdate();
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

  listChats(): void {
    this.customerSDK.listChats()
      .then(({ chatsSummary, totalChats }) => {
        console.log(chatsSummary);
        console.log(totalChats);

        for (const chatEntity of chatsSummary) {
          this.getChat(chatEntity.id);
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  getChatData(): void {
    this.customerSDK.on('incoming_chat', payload => {
      const { chat } = payload;
      const { id, access, users, properties, thread } = chat;

      console.log('incoming_chat', { id, access, users, properties, thread });

      this.getChat(payload.chat.id);
      this.getChatHistory(payload.chat.id);
    })
  }

  getChat(chatId: string): void {
    console.log(chatId);

    this.customerSDK
      .getChat({
        chatId: chatId,
      })
      .then(chat => {
        const { id, access, users, properties, thread } = chat
        console.log({ id, access, users, properties, thread })
      })
      .catch(error => {
        console.log(error)
      })
  }

  getChatHistory(chatId: string): void {
    let wholeChatHistoryLoaded = false

    const history = this.customerSDK.getChatHistory({ chatId: 'OU0V0P0OWT' })

    history.next().then(result => {
      if (result.done) {
        wholeChatHistoryLoaded = true
      }

      const { threads } = result.value

      const events = threads
        .map(thread => thread.events || [])
        .reduce((acc, current) => acc.concat(current), [])

      console.log(events)
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
