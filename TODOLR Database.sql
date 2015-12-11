SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `todo` ;
CREATE SCHEMA IF NOT EXISTS `todo` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `todo` ;

-- -----------------------------------------------------
-- Table `todo`.`ToDoItem`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `todo`.`ToDoItem` ;

CREATE TABLE IF NOT EXISTS `todo`.`ToDoItem` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Title` TEXT NULL,
  `Text` TEXT NULL,
  `Pic` TEXT NULL,
  `DueDate` TEXT NULL,
  `Completed` BOOLEAN NOT NULL,
  `Priority` BOOLEAN NOT NULL,
  `Archived` BOOLEAN NOT NULL,

  PRIMARY KEY (`Id`))

ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `todo`.`Tag`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `todo`.`Tag` ;

CREATE TABLE IF NOT EXISTS `todo`.`Tag` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Text` TEXT NULL,

  PRIMARY KEY (`Id`))

ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `todo`.`ItemTag`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `todo`.`ItemTag` ;

CREATE TABLE IF NOT EXISTS `todo`.`ItemTag` (
  `ToDoId` INT(11) NOT NULL,
  `TagId` INT(11) NOT NULL,
  PRIMARY KEY (`ToDoId`, `TagId`),
  INDEX `tag_id_idx` (`TagId` ASC),
  CONSTRAINT `tag_todo`
    FOREIGN KEY (`ToDoId`)
    REFERENCES `todo`.`ToDoItem` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `tag_tag`
    FOREIGN KEY (`TagId`)
    REFERENCES `todo`.`Tag` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
    
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
