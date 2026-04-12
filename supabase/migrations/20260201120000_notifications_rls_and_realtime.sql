-- Notifications: enum, tables (if missing), payload for member_added copy, RLS, Realtime publication.
-- Run in Supabase SQL Editor or via CLI if you use migrations.
-- If tables already exist from your triggers, the IF NOT EXISTS / ADD COLUMN IF NOT EXISTS parts are safe.

DO $$ BEGIN
  CREATE TYPE notification_event AS ENUM (
    'new_invite',
    'invite_rejected',
    'member_added',
    'member_removed'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS notification_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type notification_event NOT NULL,
  sender_id uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notification_events
  ADD COLUMN IF NOT EXISTS payload jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event uuid NOT NULL REFERENCES notification_events (id) ON DELETE CASCADE,
  target_user_id uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  is_read boolean NOT NULL DEFAULT false,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_target_user_created
  ON notifications (target_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_target_user_unread
  ON notifications (target_user_id)
  WHERE is_read = false;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own notifications" ON notifications;
CREATE POLICY "Users read own notifications" ON notifications
  FOR SELECT
  TO authenticated
  USING (target_user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users update own notifications" ON notifications;
CREATE POLICY "Users update own notifications" ON notifications
  FOR UPDATE
  TO authenticated
  USING (target_user_id = (select auth.uid()))
  WITH CHECK (target_user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users read events for own notifications" ON notification_events;
CREATE POLICY "Users read events for own notifications" ON notification_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM notifications n
      WHERE n.event = notification_events.id
        AND n.target_user_id = (select auth.uid())
    )
  );

-- Realtime: replicate notifications for postgres_changes (respects RLS for clients)
ALTER TABLE notifications REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  END IF;
END $$;
