import {MigrationInterface, QueryRunner} from 'typeorm';

export class InitDB1578929481932 implements MigrationInterface {
    name = 'InitDB1578929481932';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `account_permissions` (`id` varchar(255) NOT NULL, `created_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `account_id` varchar(255) NOT NULL, `permission_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `permissions` (`id` varchar(255) NOT NULL, `created_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `role_permissions` (`id` varchar(255) NOT NULL, `created_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `role_id` varchar(255) NOT NULL, `permission_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `roles` (`id` varchar(255) NOT NULL, `created_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `description` varchar(255) NULL, UNIQUE INDEX `IDX_648e3f5447f725579d7d4ffdfb` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `account_roles` (`id` varchar(255) NOT NULL, `created_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `account_id` varchar(255) NOT NULL, `role_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('CREATE TABLE `accounts` (`id` varchar(255) NOT NULL, `created_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `first_name` varchar(255) NOT NULL, `last_name` varchar(255) NULL, `avatar` varchar(255) NULL, `username` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `branch_id` varchar(255) NULL, `password` varchar(255) NOT NULL, `token_reset_password` varchar(255) NULL, `is_disabled` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX `IDX_477e3187cedfb5a3ac121e899c` (`username`), UNIQUE INDEX `IDX_ee66de6cdc53993296d1ceb8aa` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
        await queryRunner.query('ALTER TABLE `account_permissions` ADD CONSTRAINT `FK_21707749b5e26ea1d72ff458fc8` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `account_permissions` ADD CONSTRAINT `FK_7bba5aa59faae241e2816f93d07` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `role_permissions` ADD CONSTRAINT `FK_178199805b901ccd220ab7740ec` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `role_permissions` ADD CONSTRAINT `FK_17022daf3f885f7d35423e9971e` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `account_roles` ADD CONSTRAINT `FK_0e94d53a5ed46deaae79475e427` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION', undefined);
        await queryRunner.query('ALTER TABLE `account_roles` ADD CONSTRAINT `FK_70186a37bf7b84898bd08f61fba` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `account_roles` DROP FOREIGN KEY `FK_70186a37bf7b84898bd08f61fba`', undefined);
        await queryRunner.query('ALTER TABLE `account_roles` DROP FOREIGN KEY `FK_0e94d53a5ed46deaae79475e427`', undefined);
        await queryRunner.query('ALTER TABLE `role_permissions` DROP FOREIGN KEY `FK_17022daf3f885f7d35423e9971e`', undefined);
        await queryRunner.query('ALTER TABLE `role_permissions` DROP FOREIGN KEY `FK_178199805b901ccd220ab7740ec`', undefined);
        await queryRunner.query('ALTER TABLE `account_permissions` DROP FOREIGN KEY `FK_7bba5aa59faae241e2816f93d07`', undefined);
        await queryRunner.query('ALTER TABLE `account_permissions` DROP FOREIGN KEY `FK_21707749b5e26ea1d72ff458fc8`', undefined);
        await queryRunner.query('DROP INDEX `IDX_ee66de6cdc53993296d1ceb8aa` ON `accounts`', undefined);
        await queryRunner.query('DROP INDEX `IDX_477e3187cedfb5a3ac121e899c` ON `accounts`', undefined);
        await queryRunner.query('DROP TABLE `accounts`', undefined);
        await queryRunner.query('DROP TABLE `account_roles`', undefined);
        await queryRunner.query('DROP INDEX `IDX_648e3f5447f725579d7d4ffdfb` ON `roles`', undefined);
        await queryRunner.query('DROP TABLE `roles`', undefined);
        await queryRunner.query('DROP TABLE `role_permissions`', undefined);
        await queryRunner.query('DROP TABLE `permissions`', undefined);
        await queryRunner.query('DROP TABLE `account_permissions`', undefined);
    }

}
