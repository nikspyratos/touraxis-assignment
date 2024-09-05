'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        try {
            // Generate a random 6-digit number
            const randomSuffix = Math.floor(100000 + Math.random() * 900000);
            const username = `nik_${randomSuffix}`;

            // Create a new user with the random username
            await queryInterface.bulkInsert('Users', [{
                username: username,
                first_name: "Nik",
                last_name: "Spyratos",
                createdAt: new Date(),
                updatedAt: new Date()
            }]);

            // Fetch the inserted user
            const [user] = await queryInterface.sequelize.query(
                `SELECT id FROM Users WHERE username = :username`,
                {
                    replacements: { username: username },
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            if (!user) {
                throw new Error('Failed to retrieve the inserted user');
            }

            // Generate random tasks
            const taskNames = [
                "Take out the trash",
                "Do laundry",
                "Buy groceries",
                "Clean the house",
                "Pay bills"
            ];

            const taskStatuses = ["pending", "in_progress", "completed"];

            const tasks = Array.from({ length: Math.max(2, Math.floor(Math.random() * 5) + 1) }, () => ({
                user_id: user.id,
                status: taskStatuses[Math.floor(Math.random() * taskStatuses.length)],
                name: taskNames[Math.floor(Math.random() * taskNames.length)],
                date_time: new Date(),
                next_execute_date_time: new Date(new Date().getTime() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
                createdAt: new Date(),
                updatedAt: new Date()
            }));

            await queryInterface.bulkInsert('Tasks', tasks, {});

        } catch (error) {
            console.error('Seeder Error:', error);
            throw error;
        }
    },
    
    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Tasks', null, {});
        await queryInterface.bulkDelete('Users', { username: { [Sequelize.Op.like]: 'nik_%' } }, {});
    }
};