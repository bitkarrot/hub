CREATE TABLE `apps` (`id` integer,`user_id` integer,`name` text,`description` text,`nostr_pubkey` text,`created_at` datetime,`updated_at` datetime,PRIMARY KEY (`id`),CONSTRAINT `fk_users_apps` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`));
CREATE INDEX `idx_apps_nostr_pubkey` ON `apps`(`nostr_pubkey`);
CREATE INDEX `idx_apps_user_id` ON `apps`(`user_id`);
CREATE TABLE `app_permissions` (`id` integer,`app_id` integer,`request_method` text,`max_amount` integer,`budget_renewal` text,`expires_at` datetime,`created_at` datetime,`updated_at` datetime,PRIMARY KEY (`id`),CONSTRAINT `fk_app_permissions_app` FOREIGN KEY (`app_id`) REFERENCES `apps`(`id`) ON DELETE CASCADE);
CREATE INDEX `idx_app_permissions_request_method` ON `app_permissions`(`request_method`);
CREATE INDEX `idx_app_permissions_app_id` ON `app_permissions`(`app_id`);
CREATE TABLE `payments` (`id` integer,`app_id` integer,`nostr_event_id` integer,`amount` integer,`payment_request` text,`preimage` text,`created_at` datetime,`updated_at` datetime, `preimage2` text,PRIMARY KEY (`id`),CONSTRAINT `fk_payments_app` FOREIGN KEY (`app_id`) REFERENCES `apps`(`id`) ON DELETE CASCADE,CONSTRAINT `fk_payments_nostr_event` FOREIGN KEY (`nostr_event_id`) REFERENCES `nostr_events`(`id`));
CREATE INDEX `idx_payments_nostr_event_id` ON `payments`(`nostr_event_id`);
CREATE INDEX `idx_payments_app_id` ON `payments`(`app_id`);
CREATE TABLE `identities` (`id` integer,`created_at` datetime,`updated_at` datetime,`deleted_at` datetime,`privkey` text,PRIMARY KEY (`id`));
CREATE INDEX `idx_identities_deleted_at` ON `identities`(`deleted_at`);
CREATE TABLE IF NOT EXISTS "users" (`id` integer,`alby_identifier` text UNIQUE,`access_token` text,`refresh_token` text,`email` text,`expiry` datetime,`lightning_address` text,`created_at` datetime,`updated_at` datetime,PRIMARY KEY (`id`));
CREATE UNIQUE INDEX `idx_users_alby_identifier` ON `users`(`alby_identifier`);
CREATE TABLE IF NOT EXISTS "nostr_events" (`id` integer,`app_id` integer,`nostr_id` text UNIQUE,`reply_id` text,`content` text,`state` text,`replied_at` datetime,`created_at` datetime,`updated_at` datetime,PRIMARY KEY (`id`),CONSTRAINT `fk_nostr_events_app` FOREIGN KEY (`app_id`) REFERENCES `apps`(`id`) ON DELETE CASCADE);
CREATE UNIQUE INDEX `idx_nostr_events_nostr_id` ON `nostr_events`(`nostr_id`);
CREATE INDEX `idx_nostr_events_app_id` ON `nostr_events`(`app_id`);