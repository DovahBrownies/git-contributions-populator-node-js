const inquirer = require('inquirer');
const simpleGit = require('simple-git');
const CommitGenerator = require('./commitGenerator');

const git = simpleGit();

const validateNotEmpty = input => input ? true : 'Can\'t be empty, bud.';
const validateDateFormat = input => /\d{4}-\d{2}-\d{2}/.test(input) ? true : 'Wrong format, dude. Try YYYY-MM-DD';
const validatePositiveNumber = input => !isNaN(input) && input > 0 ? true : 'How are you trying to use a number less than 1 right now?';
const validatePercentage = input => !isNaN(input) && input >= 0 && input <= 100 ? true : 'Percentage numbers are between 0 and 100, my guy.';

async function init() {
    const { branchName, startDate, endDate, minCommitsPerDay, maxCommitsPerDay, commitChanceMonday, commitChanceTuesday, commitChanceWednesday, commitChanceThursday, commitChanceFriday, commitChanceSaturday, commitChanceSunday } = await inquirer.prompt([
        {
            type: 'input',
            name: 'branchName',
            message: 'Enter the branch name:',
            validate: validateNotEmpty
        },
        {
            type: 'input',
            name: 'startDate',
            message: 'Enter the start date (YYYY-MM-DD):',
            validate: validateDateFormat
        },
        {
            type: 'input',
            name: 'endDate',
            message: 'Enter the end date (YYYY-MM-DD):',
            validate: validateDateFormat
        },
        {
            type: 'input',
            name: 'minCommitsPerDay',
            message: 'Enter the minimum number of commits per day:',
            default: 1,
            validate: validatePositiveNumber
        },
        {
            type: 'input',
            name: 'maxCommitsPerDay',
            message: 'Enter the maximum number of commits per day:',
            default: 5,
            validate: validatePositiveNumber
        },
        {
            type: 'input',
            name: 'commitChanceMonday',
            message: 'Enter the chance of generating a commit on Monday:',
            default: 100,
            validate: validatePercentage
        },
        {
            type: 'input',
            name: 'commitChanceTuesday',
            message: 'Enter the chance of generating a commit on Tuesday:',
            default: 100,
            validate: validatePercentage
        },
        {
            type: 'input',
            name: 'commitChanceWednesday',
            message: 'Enter the chance of generating a commit on Wednesday:',
            default: 100,
            validate: validatePercentage
        },
        {
            type: 'input',
            name: 'commitChanceThursday',
            message: 'Enter the chance of generating a commit on Thursday:',
            default: 100,
            validate: validatePercentage
        },
        {
            type: 'input',
            name: 'commitChanceFriday',
            message: 'Enter the chance of generating a commit on Friday:',
            default: 100,
            validate: validatePercentage
        },
        {
            type: 'input',
            name: 'commitChanceSaturday',
            message: 'Enter the chance of generating a commit on Saturday:',
            default: 0,
            validate: validatePercentage
        },
        {
            type: 'input',
            name: 'commitChanceSunday',
            message: 'Enter the chance of generating a commit on Sunday:',
            default: 0,
            validate: validatePercentage
        },
    ]);

    const commitChancesArray = [
        commitChanceSunday,
        commitChanceMonday,
        commitChanceTuesday,
        commitChanceWednesday,
        commitChanceThursday,
        commitChanceFriday,
        commitChanceSaturday
    ].map(Number);

    const commitGenerator = new CommitGenerator(git);
    await commitGenerator.generateCommits(branchName, startDate, endDate, minCommitsPerDay, maxCommitsPerDay, commitChancesArray);
}

init().catch(err => {
    console.error('Error initializing the application:', err);
});