import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@microsoft/signalr';
import { of } from 'rxjs';
import { ChatValue } from 'src/app/core/models/values/chat-value';
import { UserValue } from 'src/app/core/models/values/user-value';
import { AuthService } from 'src/app/core/services/api/auth.service';
import { ChatService } from 'src/app/core/services/api/chat.service';
import { ChatKeyHelperService } from 'src/app/core/services/security/chat-key-helper.service';
import { CreateChatComponent } from './create-chat.component';

describe('CreateChatComponent', () => {
    let fakeChatService: ChatService;
    let fakeAuthService: AuthService;
    let fakeChatKeyHelperService: ChatKeyHelperService;
    let fixture: ComponentFixture<CreateChatComponent>;
    let fakeCreatedNewChat: ChatValue = {
        id: "123456",
        name: "New chat",
        countOfUnreadMessages: 0
    }
    let fakeUser: UserValue = {id: '1', userName: 'user', firstName: 'first', lastName: 'last', email: 'email@gmail.com', publicKey: '123'};
    beforeEach(async () => {
        fakeChatService = jasmine.createSpyObj<ChatService>('ChatService', {
            createChat: of<ChatValue>(fakeCreatedNewChat),
            loadChats: of<ChatValue[]>([
                {
                    id: "1",
                    name: "chat 1",
                    countOfUnreadMessages: 0
                },
                {
                    id: "2",
                    name: "chat 2",
                    countOfUnreadMessages: 0
                },
                {
                    id: "3",
                    name: "chat 3",
                    countOfUnreadMessages: 0
                },
            ])
        });
        fakeAuthService = jasmine.createSpyObj<AuthService>('AuthService', {
            getUser: of<UserValue>(fakeUser),
        })
        fakeChatKeyHelperService = jasmine.createSpyObj<ChatKeyHelperService>('ChatKeyHelperService', {
            decrypt: undefined,
            encrypt: undefined,
            initChatKey: undefined,
            prepareChatKeys: undefined
        })
        await TestBed.configureTestingModule({
            declarations: [
                CreateChatComponent
            ],
            providers: [
                {provide: ChatService, useValue: fakeChatService},
                {provide: AuthService, useValue: fakeAuthService},
                {provide: ChatKeyHelperService, useValue: fakeChatKeyHelperService}
            ]
        }).compileComponents()
    });

    it('should create component', () => {
        const fixture = TestBed.createComponent(CreateChatComponent);
        const instance = fixture.componentInstance;
        expect(instance).toBeTruthy();
    })
})
