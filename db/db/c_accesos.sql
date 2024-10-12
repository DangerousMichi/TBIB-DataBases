#MODIFICACION D TABLAS AGREGANDO AUTOINCREMENT
alter table admins modify id_admin int auto_increment; 
alter table invitados modify id_guest int auto_increment; 

DROP PROCEDURE IF EXISTS crearAcceso;

DELIMITER //

CREATE PROCEDURE crearAcceso(
    IN nomP VARCHAR(40),
    IN tipo_Acceso VARCHAR(20),
    IN nom_usuP VARCHAR(20),
    IN conP VARCHAR(20)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- En caso de error, realizar rollback
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error en el procedimiento crearAcceso';
    END;

    -- Comenzar la transacción
    START TRANSACTION;

    -- Validación de los parámetros de entrada
    IF CHAR_LENGTH(nomP) > 40 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El nombre excede el límite de 40 caracteres';
    END IF;

    IF CHAR_LENGTH(nom_usuP) > 20 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El nombre de usuario excede el límite de 20 caracteres';
    END IF;

    IF CHAR_LENGTH(conP) > 20 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La contraseña excede el límite de 20 caracteres';
    END IF;

    -- Verificación del tipo de acceso y la tabla de destino
    IF tipo_Acceso = 'ADMIN' THEN
        -- Insertar en la tabla de admins
        INSERT INTO admins (nom_admin, usu_admin, con_admin) VALUES (nomP, nom_usuP, conP);

    ELSEIF tipo_Acceso = 'invitado' THEN
        -- Insertar en la tabla de invitados
        INSERT INTO invitados (nom_guest, usu_guest, con_guest) VALUES (nomP, nom_usuP, conP);

    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tipo de acceso no válido';
    END IF;

    -- Si todo está correcto, realizar commit
    COMMIT;
END //

DELIMITER ;

-- Ejemplo de llamada al procedimiento
INSERT INTO ADMINS VALUES (NULL, "ULISES EDUARDO LOPEZ ACOSTA", "DANGEROUS_MICHI", "DANGMICHI");
CALL crearAcceso("ULISES EDUARDO LOPEZ ACOSTA", "ADMIN", "DANGEROUS_MICHI", "DANGMICHI");
