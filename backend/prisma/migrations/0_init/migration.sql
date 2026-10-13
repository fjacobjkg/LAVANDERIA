-- CreateTable
CREATE TABLE `bitacora` (
    `id_bitacora` BIGINT NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NULL,
    `id_servicio` INTEGER NULL,
    `accion` VARCHAR(50) NOT NULL,
    `tabla_afectada` VARCHAR(50) NULL,
    `id_registro` BIGINT NULL,
    `estado_anterior` VARCHAR(30) NULL,
    `estado_nuevo` VARCHAR(30) NULL,
    `descripcion` VARCHAR(255) NULL,
    `fecha` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_bitacora_servicio_fecha`(`id_servicio`, `fecha`),
    INDEX `idx_bitacora_usuario_fecha`(`id_usuario`, `fecha`),
    PRIMARY KEY (`id_bitacora`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cliente` (
    `id_cliente` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `telefono` VARCHAR(20) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `fecha_registro` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_cliente_nombre`(`nombre`),
    INDEX `idx_cliente_telefono`(`telefono`),
    PRIMARY KEY (`id_cliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `incidente` (
    `id_incidente` BIGINT NOT NULL AUTO_INCREMENT,
    `id_servicio` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,
    `tipo` ENUM('CORRECCION', 'CANCELACION', 'QR_DANADO', 'FALTA_CONTACTO', 'CONFUSION_SERVICIO', 'OTRO') NOT NULL,
    `motivo` VARCHAR(150) NOT NULL,
    `detalle` VARCHAR(255) NULL,
    `fecha` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_incidente_usuario`(`id_usuario`),
    INDEX `idx_incidente_servicio`(`id_servicio`),
    PRIMARY KEY (`id_incidente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notificacion` (
    `id_notificacion` BIGINT NOT NULL AUTO_INCREMENT,
    `id_servicio` INTEGER NOT NULL,
    `telefono_destino` VARCHAR(20) NOT NULL,
    `estado_envio` ENUM('PENDIENTE', 'ENVIADO', 'FALLIDO') NOT NULL DEFAULT 'PENDIENTE',
    `fecha_intento` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_envio` DATETIME(0) NULL,
    `detalle_respuesta` VARCHAR(255) NULL,

    INDEX `idx_notificacion_servicio`(`id_servicio`),
    PRIMARY KEY (`id_notificacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rol` (
    `id_rol` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(30) NOT NULL,
    `descripcion` VARCHAR(150) NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    PRIMARY KEY (`id_rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicio` (
    `id_servicio` INTEGER NOT NULL AUTO_INCREMENT,
    `id_cliente` INTEGER NULL,
    `id_operador` INTEGER NOT NULL,
    `codigo_servicio` VARCHAR(30) NOT NULL,
    `token_qr` VARCHAR(100) NOT NULL,
    `total_prendas` INTEGER NOT NULL,
    `observaciones` VARCHAR(255) NULL,
    `estado` ENUM('RECIBIDA', 'EN_PROCESO', 'LISTA_PARA_RECOGER', 'ENTREGADA', 'CANCELADA') NOT NULL DEFAULT 'RECIBIDA',
    `qr_impreso` BOOLEAN NOT NULL DEFAULT false,
    `fecha_ultima_impresion_qr` DATETIME(0) NULL,
    `fecha_recepcion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_entrega` DATETIME(0) NULL,

    UNIQUE INDEX `codigo_servicio`(`codigo_servicio`),
    UNIQUE INDEX `token_qr`(`token_qr`),
    INDEX `fk_servicio_cliente`(`id_cliente`),
    INDEX `fk_servicio_operador`(`id_operador`),
    INDEX `idx_servicio_codigo`(`codigo_servicio`),
    INDEX `idx_servicio_estado`(`estado`),
    INDEX `idx_servicio_fecha_entrega`(`fecha_entrega`),
    INDEX `idx_servicio_fecha_recepcion`(`fecha_recepcion`),
    PRIMARY KEY (`id_servicio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `id_rol` INTEGER NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `nombre_usuario` VARCHAR(50) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `nombre_usuario`(`nombre_usuario`),
    INDEX `fk_usuario_rol`(`id_rol`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bitacora` ADD CONSTRAINT `fk_bitacora_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicio`(`id_servicio`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `bitacora` ADD CONSTRAINT `fk_bitacora_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `incidente` ADD CONSTRAINT `fk_incidente_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicio`(`id_servicio`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `incidente` ADD CONSTRAINT `fk_incidente_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notificacion` ADD CONSTRAINT `fk_notificacion_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicio`(`id_servicio`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `servicio` ADD CONSTRAINT `fk_servicio_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente`(`id_cliente`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `servicio` ADD CONSTRAINT `fk_servicio_operador` FOREIGN KEY (`id_operador`) REFERENCES `usuario`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol`(`id_rol`) ON DELETE NO ACTION ON UPDATE NO ACTION;
