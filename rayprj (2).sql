-- phpMyAdmin SQL Dump
-- version 4.4.3
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 25, 2016 at 05:26 AM
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
  `domain` varchar(100) NOT NULL,
  `standard_retailer_name` varchar(100) NOT NULL,
  `standard_retailer_country` varchar(100) NOT NULL,
  `retailer_currency` varchar(3) NOT NULL,
  `deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `domains`
--

TRUNCATE TABLE `domains`;
--
-- Dumping data for table `domains`
--

INSERT INTO `domains` (`id`, `domain`, `standard_retailer_name`, `standard_retailer_country`, `retailer_currency`, `deleted`) VALUES
(1, 'localhost', '', '', '', 0),
(2, 'www.amazon.in', '', '', '', 0),
(3, 'www.amazon.com', 'Amazon US', 'UNITED STATES', 'USD', 0);

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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `selectors`
--

TRUNCATE TABLE `selectors`;
--
-- Dumping data for table `selectors`
--

INSERT INTO `selectors` (`id`, `name`, `deleted`) VALUES
(1, ' acquired_page_title', 0),
(2, ' acquired_product_desc', 0),
(3, ' acquired_oem_sku_number', 0),
(4, ' acquired_retailer_sku_number', 0),
(5, ' acquired_product_upc', 0),
(6, ' acquired_date_first_available_at_retailer', 0),
(7, ' acquired_msrp_price', 0),
(8, ' acquired_offer_price', 0),
(9, ' acquired_sold_by', 0),
(10, ' acquired_discount', 0),
(11, ' acquired_shipping_charge', 0),
(12, ' acquired_stock_status', 0),
(13, ' acquired_product_ratings', 0),
(14, ' acquired_customer_reviews', 0),
(15, ' acquired_promo_information', 0),
(16, ' acquired_bestseller_ranking', 0),
(17, ' add_to_cart_flag', 0),
(18, ' buy_box_reseller', 0),
(19, ' transformed_product_ratings_five_stars', 0),
(20, ' transformed_product_ratings_four_stars', 0),
(21, ' transformed_product_ratings_three_stars', 0),
(22, ' transformed_product_ratings_two_stars', 0),
(23, ' transformed_product_ratings_one_star', 0),
(24, ' transformed_bestseller_category_1', 0),
(25, ' transformed_bestseller_rank_1', 0),
(26, ' transformed_bestseller_category_2', 0),
(27, ' transformed_bestseller_rank_2', 0),
(28, ' transformed_bestseller_category_3', 0),
(29, ' transformed_bestseller_rank_3', 0),
(30, ' transformed_bestseller_category_4', 0),
(31, ' transformed_bestseller_rank_4', 0),
(32, ' transformed_bestseller_category_5', 0),
(33, ' transformed_bestseller_rank_5', 0),
(34, ' custom_defined_text_field_2', 0);

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
  `domain_id` int(10) NOT NULL,
  `comment` varchar(10000) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `urls`
--

TRUNCATE TABLE `urls`;
--
-- Dumping data for table `urls`
--

INSERT INTO `urls` (`id`, `url`, `status`, `deleted`, `domain_id`, `comment`) VALUES
(1, 'http://localhost:8080/', 99, 0, 0, '{\\"code\\":\\"ECONNREFUSED\\",\\"errno\\":\\"ECONNREFUSED\\",\\"syscall\\":\\"connect\\",\\"address\\":\\"127.0.0.1\\",\\"port\\":8080}');

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `urls_data`
--

TRUNCATE TABLE `urls_data`;
--
-- Dumping data for table `urls_data`
--

INSERT INTO `urls_data` (`id`, `url_id`, `manufacturer_sku_number`, `retailer_sku_number`, `product_upc_code`, `list_price`, `offer_price`, `discount`, `shipping_charges`, `stock_status`, `sold_by`, `overall_product_rating`, `number_customer_reviews`, `bestseller_ranking_overview`, `promo_information`, `page_title`, `product_description`, `date_first_available`, `screen_shot`, `screen_shot_url`) VALUES
(1, 1, '', '', '', '', '$49.95', '', '', '', '', '', '', '', '', '', 'Fulfillment by Amazon (FBA) is a service we offer sellers that lets them store their products in Amazon''s fulfillment centers, and we directly pack, ship, and provide customer service for these products. Something we hope you''ll especially enjoy: FBA items qualify for FREE Shipping and .', '0000-00-00', '', ''),
(2, 1, '', '', '', '', '$49.95', '', '', '', '', '', '', '', '', '', 'Fulfillment by Amazon (FBA) is a service we offer sellers that lets them store their products in Amazon''s fulfillment centers, and we directly pack, ship, and provide customer service for these products. Something we hope you''ll especially enjoy: FBA items qualify for FREE Shipping and .', '0000-00-00', '', ''),
(3, 1, '', '', '', '', '$49.95', '', '', '', '', '', '', '', '', '', 'Fulfillment by Amazon (FBA) is a service we offer sellers that lets them store their products in Amazon''s fulfillment centers, and we directly pack, ship, and provide customer service for these products. Something we hope you''ll especially enjoy: FBA items qualify for FREE Shipping and .', '0000-00-00', '', ''),
(4, 1, '', '', '', '', '$49.95', '', '', '', '', '', '', '', '', '', 'Fulfillment by Amazon (FBA) is a service we offer sellers that lets them store their products in Amazon''s fulfillment centers, and we directly pack, ship, and provide customer service for these products. Something we hope you''ll especially enjoy: FBA items qualify for FREE Shipping and .', '0000-00-00', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `urls_data_denormal`
--

DROP TABLE IF EXISTS `urls_data_denormal`;
CREATE TABLE IF NOT EXISTS `urls_data_denormal` (
  `id` bigint(40) NOT NULL,
  `url_id` bigint(20) NOT NULL,
  `selector` varchar(100) NOT NULL,
  `value` varchar(2000) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `urls_data_denormal`
--

TRUNCATE TABLE `urls_data_denormal`;
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
-- Indexes for table `urls_data_denormal`
--
ALTER TABLE `urls_data_denormal`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `domains`
--
ALTER TABLE `domains`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `domains_selectors`
--
ALTER TABLE `domains_selectors`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `selectors`
--
ALTER TABLE `selectors`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=35;
--
-- AUTO_INCREMENT for table `urls`
--
ALTER TABLE `urls`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `urls_data`
--
ALTER TABLE `urls_data`
  MODIFY `id` bigint(40) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
