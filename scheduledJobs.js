const cron = require('node-cron');
const { Task } = require('./models');
const { Op } = require('sequelize');

async function updatePendingTasks() {
  try {
    const tasksToUpdate = await Task.findAll({
      where: {
        status: 'pending',
        next_execute_date_time: {
          [Op.lt]: new Date() // less than current date/time
        }
      }
    });

    for (const task of tasksToUpdate) {
      console.log(`Updating task: ${task.id} - ${task.name}`);
      await task.update({ status: 'complete' });
    }

    console.log(`Updated ${tasksToUpdate.length} tasks.`);
  } catch (error) {
    console.error('Error updating tasks:', error);
  }
}

const job = cron.schedule('* * * * *', () => {
  console.log('Running scheduled task to update pending tasks...');
  updatePendingTasks();
});

module.exports = job;