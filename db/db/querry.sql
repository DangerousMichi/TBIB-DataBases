create database TBIBDatabases;
use TBIBDusuariosatabases;

# USUARIO CLASE  ##############################################################################
create table USUARIOS(
id_usu int not null primary key auto_increment,
nom_usu varchar(40) not null,
corr_usu varchar(30) not null,
usu_usu varchar(20) not null, 
con_usu varchar(20) not null
);

delimiter $$
create procedure transacciones_usu(
 transaccion varchar(10),
 id_usuP int,
 nom_usuP varchar(40),
 corr_usuP varchar(30),
 usu_usuP varchar(20),
 con_usuP varchar(20))
 
 begin
 case transaccion
	when "insertar" then 
    insert into usuarios values(id_usuP, nom_usuP, corr_usuP, usu_usuP, con_usuP );
    
    when "consultar" then
    select * from usuarios where id_usu= id_usuP;
    
     end case;
 end $$
 delimiter $$;
 delimiter ;



# BDS CLASE #############################################################################

create table BDS (
id_bd int not null primary key,
nom_bd varchar(20) not null,
id_usu1 int not null,

foreign key (id_usu1) references USUARIOS(id_usu) on update cascade on delete cascade
);

# TABLES CLASE ##############################################################################

create table TABLES_BD(
id_tab int not null primary key,
nom_tab varchar(15) not null,
id_bd1 int not null,

foreign key (id_bd1) references BDS(id_bd) on update cascade on delete cascade
);


# CONSULTAS ##############################################################################

select nom_usu
from USUARIOS
WHERE id_usu in (select id_usu1 
				 from BDS 
                 where id_bd in (select id_bd1 
								from tables_bd
								where nom_tab=albumes))