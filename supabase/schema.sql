-- プロフィールテーブル
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  age INTEGER NOT NULL DEFAULT 18,
  gender TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  native_language TEXT NOT NULL DEFAULT '',
  learning_languages TEXT[] NOT NULL DEFAULT '{}',
  interests TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  is_foreigner BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- マッチングテーブル
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(from_user_id, to_user_id)
);

-- チャットルームテーブル
CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_at TIMESTAMPTZ,
  UNIQUE(user1_id, user2_id)
);

-- メッセージテーブル
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false
);

-- RLS (Row Level Security) 有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- プロフィールポリシー
CREATE POLICY "プロフィールは誰でも閲覧可能" ON profiles FOR SELECT USING (true);
CREATE POLICY "自分のプロフィールのみ更新可能" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "自分のプロフィールのみ作成可能" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- マッチングポリシー
CREATE POLICY "自分のマッチングのみ閲覧可能" ON matches FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE POLICY "いいねは自分から送信" ON matches FOR INSERT WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "マッチング状態の更新" ON matches FOR UPDATE USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- チャットルームポリシー
CREATE POLICY "自分のチャットルームのみ閲覧可能" ON chat_rooms FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "チャットルーム作成" ON chat_rooms FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "チャットルーム更新" ON chat_rooms FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- メッセージポリシー
CREATE POLICY "チャットルームのメンバーのみメッセージ閲覧可能" ON messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM chat_rooms WHERE id = messages.room_id AND (user1_id = auth.uid() OR user2_id = auth.uid())));
CREATE POLICY "チャットルームのメンバーのみメッセージ送信可能" ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id AND EXISTS (SELECT 1 FROM chat_rooms WHERE id = messages.room_id AND (user1_id = auth.uid() OR user2_id = auth.uid())));
CREATE POLICY "自分のメッセージのみ更新可能" ON messages FOR UPDATE USING (auth.uid() = sender_id);

-- Realtime有効化
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- updated_atの自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 新規ユーザー登録時にプロフィールを自動作成
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
