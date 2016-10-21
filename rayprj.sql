-- phpMyAdmin SQL Dump
-- version 4.4.3
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 21, 2016 at 03:52 AM
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
CREATE DATABASE IF NOT EXISTS `rayprj` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `rayprj`;

-- --------------------------------------------------------

--
-- Table structure for table `domains`
--

DROP TABLE IF EXISTS `domains`;
CREATE TABLE IF NOT EXISTS `domains` (
  `id` bigint(20) NOT NULL,
  `domain` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `domains`
--

TRUNCATE TABLE `domains`;
-- --------------------------------------------------------

--
-- Table structure for table `domains_selectors`
--

DROP TABLE IF EXISTS `domains_selectors`;
CREATE TABLE IF NOT EXISTS `domains_selectors` (
  `id` int(10) NOT NULL,
  `domain_id` int(10) NOT NULL,
  `selector_id` int(10) NOT NULL,
  `type` enum('"text"',' "attribute"') NOT NULL DEFAULT '"text"',
  `filters` varchar(250) NOT NULL,
  `selector` text NOT NULL,
  `deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `domains_selectors`
--

TRUNCATE TABLE `domains_selectors`;
-- --------------------------------------------------------

--
-- Table structure for table `selectors`
--

DROP TABLE IF EXISTS `selectors`;
CREATE TABLE IF NOT EXISTS `selectors` (
  `id` int(10) NOT NULL,
  `name` varchar(200) NOT NULL,
  `deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `selectors`
--

TRUNCATE TABLE `selectors`;
--
-- Dumping data for table `selectors`
--

INSERT INTO `selectors` (`id`, `name`, `deleted`) VALUES
(1, 'manufacturer_sku_number', 0),
(2, 'retailer_sku_number', 0),
(3, 'product_upc_code', 0),
(4, 'list_price', 0),
(5, 'offer_price', 0),
(6, 'discount', 0),
(7, 'shipping_charges', 0),
(8, 'stock_status', 0),
(9, 'sold_by', 0),
(10, 'overall_product_rating', 0),
(11, 'number_customer_reviews', 0),
(12, 'bestseller_ranking_overview', 0),
(13, 'promo_information', 0),
(14, 'page_title', 0),
(15, 'product_description', 0),
(16, 'date_first_available', 0),
(17, 'screen_shot', 0);

-- --------------------------------------------------------

--
-- Table structure for table `urls`
--

DROP TABLE IF EXISTS `urls`;
CREATE TABLE IF NOT EXISTS `urls` (
  `id` bigint(20) NOT NULL,
  `url` varchar(3000) NOT NULL,
  `status` int(11) NOT NULL,
  `deleted` int(11) NOT NULL DEFAULT '0',
  `domain_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `urls`
--

TRUNCATE TABLE `urls`;
-- --------------------------------------------------------

--
-- Table structure for table `urls_data`
--

DROP TABLE IF EXISTS `urls_data`;
CREATE TABLE IF NOT EXISTS `urls_data` (
  `id` bigint(40) NOT NULL,
  `url_id` bigint(20) NOT NULL,
  `manufacturer_sku_number` varchar(200) NOT NULL,
  `retailer_sku_number` varchar(200) NOT NULL,
  `product_upc_code` varchar(200) NOT NULL,
  `list_price` varchar(100) NOT NULL,
  `offer_price` varchar(100) NOT NULL,
  `discount` varchar(10) NOT NULL,
  `shipping_charges` varchar(10) NOT NULL,
  `stock_status` varchar(100) NOT NULL,
  `sold_by` varchar(200) NOT NULL,
  `overall_product_rating` varchar(10) NOT NULL,
  `number_customer_reviews` varchar(10) NOT NULL,
  `bestseller_ranking_overview` varchar(10) NOT NULL,
  `promo_information` varchar(1000) NOT NULL,
  `page_title` varchar(4000) NOT NULL,
  `product_description` varchar(5000) NOT NULL,
  `date_first_available` date NOT NULL,
  `screen_shot` blob NOT NULL,
  `screen_shot_url` varchar(2000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `urls_data`
--

TRUNCATE TABLE `urls_data`;
--
-- Indexes for dumped tables
--

--
-- Indexes for table `domains`
--
ALTER TABLE `domains`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `domains_selectors`
--
ALTER TABLE `domains_selectors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `selectors`
--
ALTER TABLE `selectors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `urls`
--
ALTER TABLE `urls`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `urls_data`
--
ALTER TABLE `urls_data`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `domains`
--
ALTER TABLE `domains`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `domains_selectors`
--
ALTER TABLE `domains_selectors`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `selectors`
--
ALTER TABLE `selectors`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `urls`
--
ALTER TABLE `urls`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `urls_data`
--
ALTER TABLE `urls_data`
  MODIFY `id` bigint(40) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
