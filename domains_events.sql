-- phpMyAdmin SQL Dump
-- version 4.4.3
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 16, 2016 at 01:13 PM
-- Server version: 5.6.24
-- PHP Version: 5.5.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `rayprj`
--

-- --------------------------------------------------------

--
-- Table structure for table `domains_events`
--

DROP TABLE IF EXISTS `domains_events`;
CREATE TABLE IF NOT EXISTS `domains_events` (
  `id` bigint(20) NOT NULL,
  `event` varchar(255) DEFAULT NULL,
  `argument` varchar(255) DEFAULT NULL,
  `domain_id` bigint(20) NOT NULL,
  `deleted` bigint(10) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `domains_events`
--

TRUNCATE TABLE `domains_events`;
--
-- Dumping data for table `domains_events`
--

INSERT INTO `domains_events` (`id`, `event`, `argument`, `domain_id`, `deleted`) VALUES
(1, 'wait', '2000', 13, 0),
(2, 'click', '#reviews-accordion > button', 13, 0),
(3, 'wait', '2000', 13, 0),
(4, 'click', '#BVRRQTFilterHeaderToggleShowHistogramsID', 13, 0),
(5, 'wait', '2000', 13, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `domains_events`
--
ALTER TABLE `domains_events`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `domains_events`
--
ALTER TABLE `domains_events`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
