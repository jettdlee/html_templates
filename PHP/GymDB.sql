-- MySQL dump 10.13  Distrib 5.5.39, for Linux (x86_64)
--
-- Host: mysql    Database: m7jtl
-- ------------------------------------------------------
-- Server version	5.6.34-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ClassSchedule`
--

DROP TABLE IF EXISTS `ClassSchedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ClassSchedule` (
  `schId` varchar(10) NOT NULL,
  `classNo` varchar(10) NOT NULL,
  `time` varchar(20) NOT NULL,
  `capacity` int(11) NOT NULL,
  PRIMARY KEY (`schId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ClassSchedule`
--

LOCK TABLES `ClassSchedule` WRITE;
/*!40000 ALTER TABLE `ClassSchedule` DISABLE KEYS */;
INSERT INTO `ClassSchedule` VALUES ('1','1','Monday, 9:00',2),('10','4','Wednesday, 13:00',2),('11','5','Friday, 14:00',2),('2','1','Tuesday, 9:00',2),('3','1','Wednesday, 9:00',2),('4','2','Thursday, 10:00',4),('5','2','Friday, 10:00',4),('6','3','Monday, 11:00',3),('7','3','Wednesday, 11:00',3),('8','3','Friday, 11:00',3),('9','4','Tuesday, 13:00',2);
/*!40000 ALTER TABLE `ClassSchedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ClassId`
--

DROP TABLE IF EXISTS `ClassId`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ClassId` (
  `classNo` varchar(10) NOT NULL,
  `className` varchar(20) NOT NULL,
  PRIMARY KEY (`classNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ClassId`
--

LOCK TABLES `ClassId` WRITE;
/*!40000 ALTER TABLE `ClassId` DISABLE KEYS */;
INSERT INTO `ClassId` VALUES ('1','Boot Camp'),('2','Boxercise'),('3','Pilates'),('4','Yoga'),('5','Zumba');
/*!40000 ALTER TABLE `ClassId` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MemberBooking`
--

DROP TABLE IF EXISTS `MemberBooking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MemberBooking` (
  `bookRef` varchar(10) NOT NULL,
  `mName` varchar(50) NOT NULL,
  `mNo` varchar(20) NOT NULL,
  `schId` varchar(10) NOT NULL,
  PRIMARY KEY (`bookRef`),
  KEY `schId_cSch` (`schId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MemberBooking`
--

LOCK TABLES `MemberBooking` WRITE;
/*!40000 ALTER TABLE `MemberBooking` DISABLE KEYS */;
/*!40000 ALTER TABLE `MemberBooking` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-12-15 15:46:32
