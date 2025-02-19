const { generateDateRange } = require('./utils/dateUtils');
const { randomBytes } = require('crypto');

class CommitGenerator {
    constructor(simpleGit) {
        this.git = simpleGit;
    }

    async validateBranch(branchName) {
        const branches = await this.git.branch();
        return branches.all.includes(branchName);
    }

    generateCommitDates(startDate, endDate, minCommitsPerDay, maxCommitsPerDay, commitChances) {
        const dates = [];
        const dateRange = generateDateRange(startDate, endDate);

        dateRange.forEach(date => {
            const day = date.getDay();
            const chance = commitChances[day];

            if (Math.random() * 100 < chance) {
                const numCommits = Math.floor(Math.random() * (maxCommitsPerDay - minCommitsPerDay + 1)) + minCommitsPerDay;
                for (let i = 0; i < numCommits; i++) {
                    dates.push(new Date(date));
                }
            }
        });

        return dates;
    }

    async createCommits(branchName, commitDates, commitMessage) {
        await this.git.checkout(branchName);
        for (const date of commitDates) {
            const randomMessage = commitMessage + ' ' + randomBytes(4).toString('hex');
            await this.git.commit(randomMessage, {
                '--date': date.toISOString()
            });
        }
    }
}

module.exports = CommitGenerator;