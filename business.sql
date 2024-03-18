-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-03-2024 a las 03:36:25
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `business`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `audit_log`
--

CREATE TABLE `audit_log` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action_description` varchar(255) DEFAULT NULL,
  `action_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `audit_log`
--

INSERT INTO `audit_log` (`log_id`, `user_id`, `action_description`, `action_date`) VALUES
(1, 13, 'El usuario 13 actualizó la venta 2', '2024-03-17 20:57:26'),
(4, 13, 'El rol del usuario 13 ha sido actualizado a buyer.', '2024-03-17 21:07:51'),
(5, 13, 'El rol del usuario 13 ha sido actualizado a vendor.', '2024-03-17 21:08:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productinventory`
--

CREATE TABLE `productinventory` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `quantity_in_stock` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `entry_date` date DEFAULT NULL,
  `is_entry` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productinventory`
--

INSERT INTO `productinventory` (`product_id`, `product_name`, `description`, `quantity_in_stock`, `price`, `entry_date`, `is_entry`) VALUES
(2, 'celular', 'samsung', 6, 2000.00, '2024-03-17', 1),
(3, 'ventilador', 'mini ventilador manual', 2, 4000.00, '2024-03-16', 1),
(4, 'celular', 'samsung', -8, 10000.00, '2024-03-16', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `saleproduct`
--

CREATE TABLE `saleproduct` (
  `sale_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity_sold` int(11) DEFAULT NULL,
  `sale_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `saleproduct`
--

INSERT INTO `saleproduct` (`sale_id`, `user_id`, `product_id`, `quantity_sold`, `sale_date`) VALUES
(2, 13, 4, 2, '2024-03-17'),
(7, 1, 3, 1, '2024-03-16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','vendor','buyer') NOT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `role`, `email`) VALUES
(1, 'admin', 'admin2024', 'admin', 'admin@gmail.com'),
(13, 'sale1', 's1', 'vendor', 'sale1@gmail.com');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `audit_log`
--
ALTER TABLE `audit_log`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `productinventory`
--
ALTER TABLE `productinventory`
  ADD PRIMARY KEY (`product_id`);

--
-- Indices de la tabla `saleproduct`
--
ALTER TABLE `saleproduct`
  ADD PRIMARY KEY (`sale_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `audit_log`
--
ALTER TABLE `audit_log`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `productinventory`
--
ALTER TABLE `productinventory`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `saleproduct`
--
ALTER TABLE `saleproduct`
  MODIFY `sale_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `audit_log`
--
ALTER TABLE `audit_log`
  ADD CONSTRAINT `audit_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Filtros para la tabla `saleproduct`
--
ALTER TABLE `saleproduct`
  ADD CONSTRAINT `saleproduct_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `productinventory` (`product_id`),
  ADD CONSTRAINT `saleproduct_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
