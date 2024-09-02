-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `resetPasswordToken` VARCHAR(191) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_resetPasswordToken_key`(`resetPasswordToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_salas` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `salaId` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_salas_userId_salaId_key`(`userId`, `salaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `salas` (
    `id` VARCHAR(191) NOT NULL,
    `tituloSala` VARCHAR(191) NOT NULL,
    `descricaoSala` VARCHAR(191) NULL,
    `cor` VARCHAR(191) NULL,
    `totalMembros` INTEGER NOT NULL,
    `maximoDeMembros` INTEGER NOT NULL,
    `tokkenAcesso` VARCHAR(191) NOT NULL,
    `resetPasswordToken` VARCHAR(191) NULL,

    UNIQUE INDEX `salas_tokkenAcesso_key`(`tokkenAcesso`),
    UNIQUE INDEX `salas_resetPasswordToken_key`(`resetPasswordToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria` (
    `id` VARCHAR(191) NOT NULL,
    `tipoCategoria` VARCHAR(191) NOT NULL,
    `descricaoCategoria` VARCHAR(191) NULL,
    `porcentagemDepreciacaoCategoria` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `categoria_tipoCategoria_key`(`tipoCategoria`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patrimonios` (
    `id` VARCHAR(191) NOT NULL,
    `tituloPatrimonio` VARCHAR(191) NOT NULL,
    `descricaoPatrimonio` VARCHAR(191) NULL,
    `codigo` INTEGER NOT NULL,
    `valorDaAquisicao` INTEGER NOT NULL,
    `valorFinal` INTEGER NOT NULL,
    `valorAtual` INTEGER NOT NULL,
    `situacao` INTEGER NOT NULL,
    `localizacao` VARCHAR(191) NOT NULL,
    `porcentagemDesvalorizacao` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gastos` (
    `id` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `preco` INTEGER NOT NULL,
    `dataGasto` DATETIME(3) NOT NULL,
    `repeticao` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_salas` ADD CONSTRAINT `user_salas_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_salas` ADD CONSTRAINT `user_salas_salaId_fkey` FOREIGN KEY (`salaId`) REFERENCES `salas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patrimonios` ADD CONSTRAINT `patrimonios_id_fkey` FOREIGN KEY (`id`) REFERENCES `categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
