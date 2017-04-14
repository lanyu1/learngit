/*
SQLyog 企业版 - MySQL GUI v7.14 
MySQL - 5.6.21-log : Database - jkxystudent
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/`jkxystudent` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;

USE `jkxystudent`;

/*Table structure for table `studentinfo` */

DROP TABLE IF EXISTS `studentinfo`;

CREATE TABLE `studentinfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nicheng` char(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `truename` char(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `xb` bit(1) DEFAULT NULL,
  `csrq` date DEFAULT NULL,
  `zy` char(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `kc` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `xq` char(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bz` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `studentinfo` */

insert  into `studentinfo`(`id`,`nicheng`,`truename`,`xb`,`csrq`,`zy`,`kc`,`xq`,`bz`) values (2,'李四','李晓兰','\0','1998-09-09','通信工程','数据结构&操作系统','book&web','我非常喜欢计算机'),(3,NULL,NULL,'',NULL,'通信工程','','',NULL),(4,'张四','李晓红','\0','1998-09-06','电气工程','数据库原理','','我有点喜欢这门课程'),(5,NULL,NULL,'',NULL,'通信工程','','',NULL);

/*Table structure for table `usertable` */

DROP TABLE IF EXISTS `usertable`;

CREATE TABLE `usertable` (
  `username` char(10) COLLATE utf8_unicode_ci NOT NULL,
  `password` char(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `usertable` */

insert  into `usertable`(`username`,`password`) values ('11','11'),('22','22');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
