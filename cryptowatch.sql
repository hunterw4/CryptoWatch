-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema cryptowatch
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema cryptowatch
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `cryptowatch` DEFAULT CHARACTER SET utf8 ;
USE `cryptowatch` ;

-- -----------------------------------------------------
-- Table `cryptowatch`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cryptowatch`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  `password` VARCHAR(255) NULL,
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cryptowatch`.`coins`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cryptowatch`.`coins` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  `symbol` VARCHAR(45) NULL,
  `created_at` VARCHAR(45) NULL,
  `updated_at` VARCHAR(45) NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_coins_users_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_coins_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `cryptowatch`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
