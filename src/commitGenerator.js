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
        let currentDate = new Date(startDate);

        while (currentDate <= new Date(endDate)) {
            const day = currentDate.getDay();
            const chance = commitChances[day];

            if (Math.random() * 100 < chance) {
                const numCommits = Math.floor(Math.random() * (maxCommitsPerDay - minCommitsPerDay + 1)) + minCommitsPerDay;
                for (let i = 0; i < numCommits; i++) {
                    dates.push(new Date(currentDate));
                }
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    }

    async createCommits(branchName, commitDates, commitMessage) {
        await this.git.checkout(branchName);
        for (const date of commitDates) {
            await this.git.commit(commitMessage, {
                '--date': date.toISOString()
            });
        }
    }
}

module.exports = CommitGenerator;