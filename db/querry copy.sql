create database TBIBDatabases;
use TBIBDatabases;

# BDS CLASE #############################################################################

create table BDS (
id_bd int not null primary key,
nom_bd varchar(20) not null,
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