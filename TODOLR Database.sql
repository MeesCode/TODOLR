SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `todo` ;
CREATE SCHEMA IF NOT EXISTS `todo` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `todo` ;

-- -----------------------------------------------------
-- Table `todo`.`User`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `todo`.`User` ;

CREATE TABLE IF NOT EXISTS `todo`.`User` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Name` TEXT NULL,
  `Email` TEXT NULL,
  `Username` TEXT(20) NULL,
  `Password` TEXT NULL,
  PRIMARY KEY (`Id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `todo`.`ToDoList`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `todo`.`ToDoList` ;

CREATE TABLE IF NOT EXISTS `todo`.`ToDoList` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Name` TEXT NULL,
  `CreationDate` TIMESTAMP NULL,
  `Owner` INT(11) NULL,
  `IsPublic` TINYINT(1) NULL,
  PRIMARY KEY (`Id`),
  INDEX `list_owner_idx` (`Owner` ASC),
  CONSTRAINT `list_owner`
    FOREIGN KEY (`Owner`)
    REFERENCES `todo`.`User` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `todo`.`ToDoItem`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `todo`.`ToDoItem` ;

CREATE TABLE IF NOT EXISTS `todo`.`ToDoItem` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Title` TEXT NULL,
  `Text` TEXT NULL,
	`Pic` TEXT NULL,
  `CreationDate` TIMESTAMP NULL,
  `DueDate` TEXT NULL,
  `Completed` TINYINT(1) NULL,
  `CompletionDate` TIMESTAMP NULL,
  `Priority` INT(11) NOT NULL,
  `ToDoListID` INT(11) NULL,
  `Archived` INT(11) NULL,
  `ParentToDo` INT(11) NULL,
  PRIMARY KEY (`Id`, `Priority`),
  INDEX `item_list_idx` (`ToDoListID` ASC),
  INDEX `parent_child_idx` (`ParentToDo` ASC),
  CONSTRAINT `item_list`
    FOREIGN KEY (`ToDoListID`)
    REFERENCES `todo`.`ToDoList` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `parent_child`
    FOREIGN KEY (`ParentToDo`)
    REFERENCES `todo`.`ToDoItem` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `todo`.`ToDoAssignment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `todo`.`ToDoAssignment` ;

CREATE TABLE IF NOT EXISTS `todo`.`ToDoAssignment` (
  `ToDoId` INT(11) NOT NULL AUTO_INCREMENT,
  `AssigneeId` INT(11) NOT NULL,
  `AssignDate` TIMESTAMP NULL,
  PRIMARY KEY (`ToDoId`, `AssigneeId`),
  INDEX `assignee_id_idx` (`AssigneeId` ASC),
  CONSTRAINT `assingment_todo`
    FOREIGN KEY (`ToDoId`)
    REFERENCES `todo`.`ToDoItem` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `assignment_assignee`
    FOREIGN KEY (`AssigneeId`)
    REFERENCES `todo`.`User` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
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



