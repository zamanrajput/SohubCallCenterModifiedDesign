export interface GetChatsRequest {
  route: 'get_chats';
  id: string | number;
}

export interface RegisterUserRequest {
  route: 'register_user';
  data: {
    display_name: string;
    email: string;
    display_picture: string;
    sip_extension: string;
    sip_password: string;
    password: string;
  };
}

export interface LoginRequest {
  route: 'login';
  data: {
    email: string;
    password: string;
  };
}
export interface UserFromExtRequest {
  route: 'user_from_ext';
  ext:string
}



export interface NewChatRequest {
  route: 'new_chat';
  data: {
    members: string;
  };
}

export interface NewMessageRequest {
  route: 'new_message';
  data: {
    chat_id: string;
    to_id: string;
    from_id: string,
    attachment_url: string;
    message: string;
  };
}


const registerUserRequest: RegisterUserRequest = {
  route: 'register_user',
  data: {
    display_name: 'John Doe',
    email: 'john@example.com',
    display_picture: 'https://example.com/profile-picture.jpg',
    sip_extension: '1001',
    sip_password: 's3cr3t',
    password: 'hashed_password',
  },
};

const loginRequest: LoginRequest = {
  route: 'login',
  data: {
    email: 'user1@sohub.com',
    password: '12345678',
  },
};

const newChatRequest: NewChatRequest = {
  route: 'new_chat',
  data: {
    members: 'string,string',
  },
};

const newMessageRequest: NewMessageRequest = {
  route: 'new_message',
  data: {
    chat_id: 'string',
    from_id: "string",
    to_id: 'from_id',
    attachment_url: '',
    message: 'this is message',
  },
};
