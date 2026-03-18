export type Profile = {
  id: string
  email: string
  name: string
  age: number
  gender: string
  region: string
  city: string
  native_language: string
  learning_languages: string[]
  interests: string[]
  bio: string
  avatar_url: string | null
  is_foreigner: boolean
  created_at: string
  updated_at: string
}

export type Match = {
  id: string
  from_user_id: string
  to_user_id: string
  status: 'pending' | 'matched' | 'rejected'
  created_at: string
}

export type ChatRoom = {
  id: string
  user1_id: string
  user2_id: string
  created_at: string
  last_message_at: string | null
}

export type Message = {
  id: string
  room_id: string
  sender_id: string
  content: string
  created_at: string
  is_read: boolean
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      matches: {
        Row: Match
        Insert: Omit<Match, 'id' | 'created_at'>
        Update: Partial<Omit<Match, 'id' | 'created_at'>>
      }
      chat_rooms: {
        Row: ChatRoom
        Insert: Omit<ChatRoom, 'id' | 'created_at'>
        Update: Partial<Omit<ChatRoom, 'id' | 'created_at'>>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, 'id' | 'created_at'>
        Update: Partial<Omit<Message, 'id' | 'created_at'>>
      }
    }
  }
}
