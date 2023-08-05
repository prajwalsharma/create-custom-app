#!/usr/bin/env node
const inquirer = require("inquirer");
const path = require("path");
const fse = require("fs-extra");
const colors = require("colors");

const CURR_DIR = process.cwd();
const templatesDir = path.join(__dirname, "templates");
const templates = fse.readdirSync(templatesDir);

inquirer
  .prompt([
    {
      name: "projectName",
      type: "input",
      message: "Project name: ",
      default: "my-app",
    },
    {
      name: "template",
      type: "list",
      message: "Select a template: ",
      choices: templates.filter((template) => template !== "common"),
    },
  ])
  .then(async (answers) => {
    // Copy common base files
    let source = path.join(templatesDir, "common/base");
    let destination = path.join(CURR_DIR, answers.projectName);
    const copyBaseTemplate = await fse.copy(source, destination);

    console.info(`Scaffolding project in ${destination}...`.yellow);

    // Copy selected template files
    source = path.join(templatesDir, "common", answers.template);
    destination = path.join(
      CURR_DIR,
      answers.projectName,
      "src",
      answers.template
    );
    const copySelectedTemplate = await fse.copy(source, destination);
    printMessages(answers.projectName);
  });

const printMessages = (projectName) => {
  console.info("Done. Now run:".green);
  console.info(`\tcd ${projectName}`.blue);
  console.info("\tnpm install".blue);
  console.info("\tnpm start".blue);
};
