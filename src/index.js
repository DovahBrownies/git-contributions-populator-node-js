const blessed = require('blessed');
const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');
const CommitGenerator = require('./commitGenerator');

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const version = packageJson.version;

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const WEEK_ENDS = ['Saturday', 'Sunday'];
const COLORS = ['white', 'magenta', 'yellow', 'cyan'];

const MARGIN_TOP = 3;
const FIRST_MARGIN_TOP = MARGIN_TOP - 1;

const YESTERDAY = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
const FIRST_DAY_OF_YEAR = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

const TITLE = `Commit Generator v${version}`;
const SUBTITLE = '(Use UP/DOWN arrow keys or TAB to navigate)';

const DEFAULTS_VALUES = {
    MIN_COMMITS_PER_DAY: '1',
    MAX_COMMITS_PER_DAY: '5',
    WEEK_DAY_COMMIT_CHANGE: '100',
    WEEK_END_COMMIT_CHANGE: '0'
};

const getMarginForRow = (row) => FIRST_MARGIN_TOP + MARGIN_TOP * row;
const getBorderColor = (index) => ({ border: { fg: COLORS[index % COLORS.length] } });

const BASIC_STYLES = {
    FULL_WIDTH: { width: '99%' },
    HALF_WIDTH: { width: '49.5%' },
    STD_HEIGHT: { height: 3 },
    LARGE_HEIGHT: { height: 5 },
    STD_BORDER: { border: { type: 'line' } },
    INPUT_ON_FOCUS: { inputOnFocus: true },
    HALF_WIDTH_SECOND_COL: { left: '50%' }
};

const STYLES = {
    FULL_WIDTH_INPUT: {
        ...BASIC_STYLES.FULL_WIDTH,
        ...BASIC_STYLES.STD_HEIGHT,
        ...BASIC_STYLES.STD_BORDER,
        ...BASIC_STYLES.INPUT_ON_FOCUS
    },
    HALF_WIDTH_INPUT: {
        ...BASIC_STYLES.HALF_WIDTH,
        ...BASIC_STYLES.STD_HEIGHT,
        ...BASIC_STYLES.STD_BORDER,
        ...BASIC_STYLES.INPUT_ON_FOCUS
    }
};

function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regex)) return false;

    const date = new Date(dateString);
    const timestamp = date.getTime();
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) return false;

    return dateString === date.toISOString().split('T')[0];
}

async function createForm(screen, form, callback) {
    const formData = {};

    blessed.box({
        parent: form,
        ...BASIC_STYLES.FULL_WIDTH,
        ...BASIC_STYLES.STD_BORDER,
        ...BASIC_STYLES.LARGE_HEIGHT,
        content: `${TITLE}\n${SUBTITLE}`,
        align: 'center',
        valign: 'middle',
        style: { fg: 'white', bg: 'blue' }
    });

    const repoPathInput = blessed.textbox({
        parent: form,
        label: 'Git Repository Path',
        top: getMarginForRow(1),
        style: getBorderColor(0),
        value: process.cwd(),
        ...STYLES.FULL_WIDTH_INPUT
    });

    const branchNameInput = blessed.textbox({
        parent: form,
        label: 'Branch Name (Auto filled on valid git directory)',
        top: getMarginForRow(2),
        style: getBorderColor(1),
        ...STYLES.FULL_WIDTH_INPUT
    });

    const startDateInput = blessed.textbox({
        parent: form,
        label: 'Start Date (YYYY-MM-DD)',
        top: getMarginForRow(3),
        style: getBorderColor(2),
        value: FIRST_DAY_OF_YEAR,
        ...STYLES.HALF_WIDTH_INPUT
    });

    const endDateInput = blessed.textbox({
        parent: form,
        label: 'End Date (YYYY-MM-DD)',
        top: getMarginForRow(3),
        style: getBorderColor(2),
        value: YESTERDAY,
        ...BASIC_STYLES.HALF_WIDTH_SECOND_COL,
        ...STYLES.HALF_WIDTH_INPUT
    });

    const minCommitsInput = blessed.textbox({
        parent: form,
        label: 'Min Commits Per Day',
        top: getMarginForRow(4),
        style: getBorderColor(3),
        value: DEFAULTS_VALUES.MIN_COMMITS_PER_DAY,
        ...STYLES.HALF_WIDTH_INPUT
    });

    const maxCommitsInput = blessed.textbox({
        parent: form,
        label: 'Max Commits Per Day',
        top: getMarginForRow(4),
        style: getBorderColor(3),
        value: DEFAULTS_VALUES.MAX_COMMITS_PER_DAY,
        ...BASIC_STYLES.HALF_WIDTH_SECOND_COL,
        ...STYLES.HALF_WIDTH_INPUT
    });

    const commitChancesInputs = [...WEEK_DAYS, ...WEEK_ENDS].map((day, index) => {
        const weekendIndex = WEEK_ENDS.findIndex(weekend => weekend === day);
        const isWeekend = weekendIndex !== -1;

        const options = isWeekend
            ? {
                top: getMarginForRow(5) + weekendIndex * MARGIN_TOP,
                value: DEFAULTS_VALUES.WEEK_END_COMMIT_CHANGE,
                ...BASIC_STYLES.HALF_WIDTH,
                ...BASIC_STYLES.HALF_WIDTH_SECOND_COL
            }
            : {
                top: getMarginForRow(5) + index * MARGIN_TOP,
                value: DEFAULTS_VALUES.WEEK_DAY_COMMIT_CHANGE,
            };

        return blessed.textbox({
            parent: form,
            label: `${day} Chance (%)`,
            style: getBorderColor(4),
            ...STYLES.HALF_WIDTH_INPUT,
            ...options
        });
    });

    const errorMessage = blessed.box({
        parent: form,
        top: getMarginForRow(5) + WEEK_DAYS.length * MARGIN_TOP,
        width: '99%',
        height: 3,
        content: '',
        style: { fg: 'red' },
        focusable: false
    });

    const submitButton = blessed.button({
        parent: form,
        top: getMarginForRow(6) + WEEK_DAYS.length * MARGIN_TOP,
        width: '49.5%',
        height: 3,
        content: 'Submit',
        border: { type: 'line' },
        style: { border: { fg: 'green' }, focus: { bg: 'green' } }
    });

    const cancelButton = blessed.button({
        parent: form,
        top: getMarginForRow(6) + WEEK_DAYS.length * MARGIN_TOP,
        left: '50%',
        width: '49.5%',
        height: 3,
        content: 'Cancel',
        border: { type: 'line' },
        style: { border: { fg: 'red' }, focus: { bg: 'red' } }
    });

    repoPathInput.on('blur', async () => {
        const repoPath = repoPathInput.getValue();

        if (!fs.existsSync(repoPath)) {
            branchNameInput.setValue('');
            errorMessage.setContent('Error: Directory does not exist.');
            screen.render();
            return;
        }

        const git = simpleGit(repoPath);

        try {
            const isRepo = await git.checkIsRepo();
            if (isRepo) {
                const branchSummary = await git.branch();
                const currentBranch = branchSummary.current;
                branchNameInput.setValue(currentBranch);
                errorMessage.setContent('');
                screen.render();
            } else {
                branchNameInput.setValue('');
                errorMessage.setContent('Error: Directory is not a Git repository.');
                screen.render();
            }
        } catch (error) {
            branchNameInput.setValue('');
            errorMessage.setContent('Error: Unable to check repository.');
            screen.render();
        }
    });

    submitButton.on('press', async () => {
        const repoPath = repoPathInput.getValue();
        const branchName = branchNameInput.getValue();
        const startDate = startDateInput.getValue();
        const endDate = endDateInput.getValue();
        const minCommitsPerDay = parseInt(minCommitsInput.getValue(), 10);
        const maxCommitsPerDay = parseInt(maxCommitsInput.getValue(), 10);

        if (!fs.existsSync(repoPath)) {
            errorMessage.setContent('Error: Directory does not exist.');
            screen.render();
            return;
        }

        const git = simpleGit(repoPath);

        try {
            const isRepo = await git.checkIsRepo();
            if (!isRepo) {
                errorMessage.setContent('Error: Directory is not a Git repository.');
                screen.render();
                return;
            }
        } catch (error) {
            errorMessage.setContent('Error: Unable to check repository.');
            screen.render();
            return;
        }

        if (!branchName) {
            errorMessage.setContent('Error: Branch name is required.');
            screen.render();
            return;
        }

        if (!isValidDate(startDate)) {
            errorMessage.setContent('Error: Start Date must be in YYYY-MM-DD format.');
            screen.render();
            return;
        }

        if (!isValidDate(endDate)) {
            errorMessage.setContent('Error: End Date must be in YYYY-MM-DD format.');
            screen.render();
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            errorMessage.setContent('Error: Start Date cannot be after End Date.');
            screen.render();
            return;
        }

        if (isNaN(minCommitsPerDay) || minCommitsPerDay < 1) {
            errorMessage.setContent('Error: Min Commits Per Day must be a positive number.');
            screen.render();
            return;
        }

        if (isNaN(maxCommitsPerDay) || maxCommitsPerDay < minCommitsPerDay || maxCommitsPerDay > 100) {
            errorMessage.setContent('Error: Max Commits Per Day must be a number between Min Commits Per Day and 100.');
            screen.render();
            return;
        }

        for (const input of commitChancesInputs) {
            const value = parseInt(input.getValue(), 10);
            if (isNaN(value) || value < 0 || value > 100 || !Number.isInteger(value)) {
                errorMessage.setContent('Error: Commit Chances must be whole numbers between 0 and 100.');
                screen.render();
                return;
            }
        }

        formData.repoPath = repoPath;
        formData.branchName = branchName;
        formData.startDate = startDate;
        formData.endDate = endDate;
        formData.minCommitsPerDay = minCommitsPerDay;
        formData.maxCommitsPerDay = maxCommitsPerDay;
        formData.commitChances = commitChancesInputs.map(input => parseInt(input.getValue(), 10));

        callback(formData);
    });

    cancelButton.on('press', () => {
        process.exit(0);
    });

    screen.key(['tab'], () => screen.focusNext());
    screen.key(['S-tab'], () => screen.focusPrevious());
    screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
    screen.render();

    repoPathInput.focus();
}

async function init() {
    const screen = blessed.screen({
        smartCSR: true,
        title: TITLE
    });

    const form = blessed.form({
        parent: screen,
        width: '100%',
        height: '100%',
        keys: true,
        vi: true,
        border: { type: 'line' },
        style: { border: { fg: 'blue' } }
    });

    await createForm(screen, form, async (formData) => {
        const { repoPath, branchName, startDate, endDate, minCommitsPerDay, maxCommitsPerDay, commitChances } = formData;

        const git = simpleGit(repoPath);
        const commitGenerator = new CommitGenerator(git);
        await commitGenerator.createCommits(repoPath, branchName, startDate, endDate, minCommitsPerDay, maxCommitsPerDay, commitChances, 'Automated commit');

        // Show a prompt to close the app
        const closePrompt = blessed.message({
            parent: screen,
            top: 'center',
            left: 'center',
            width: '50%',
            height: 'shrink',
            label: 'Info',
            border: { type: 'line' },
            style: { border: { fg: 'blue' } }
        });

        closePrompt.display('Commits generated successfully. Press any key to exit.', 0, () => {
            process.exit(0);
        });
    });
}

init().catch(err => {
    console.error('Error initializing the application:', err);
});