'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Then insert student data
    await queryInterface.bulkInsert('staffs', [
      { id: 1, staffName: 'Arun Prakash', role: 'Admin', experience: 10, password: '12345678', email: 'arun.prakash@example.com' },
      { id: 2, staffName: 'Gayathri', role: 'teacher', experience: 5, password: '12345678', email: 'gayathri@example.com' },
      { id: 3, staffName: 'Ram Kumar', role: 'Admin', experience: 10, password: '12345678', email: 'ram.kumar@example.com' },
      { id: 5, staffName: 'Ragul', role: 'Engineer', experience: 2, password: '12345678', email: 'ragul@example.com' },
      { id: 11, staffName: 'Ram', role: 'Teacher', experience: 5, password: 'pass1234', email: 'ram.teacher@example.com' },
      { id: 12, staffName: 'Sita', role: 'Admin', experience: 3, password: 'admin@321', email: 'sita@example.com' },
      { id: 13, staffName: 'Lakshman', role: 'Teacher', experience: 4, password: 'laksh@pass', email: 'lakshman@example.com' },
      { id: 14, staffName: 'Hanuman', role: 'Assistant', experience: 2, password: 'hanu$987', email: 'hanuman@example.com' },
      { id: 15, staffName: 'Ravan', role: 'Guest Lecturer', experience: 10, password: 'evil!123', email: 'ravan@example.com' },
    ], {});

    await queryInterface.bulkInsert('students', [
      { id: 1, studentName: 'Arjun', marks: 99, age: 20, password: '12345678', profile: '1741785439828.png', staff_id: 1 },
      { id: 2, studentName: 'Paul', marks: 100, age: 29, password: '12345678', profile: '1743512576015.png', staff_id: 2 },
      { id: 3, studentName: 'Ram', marks: 56, age: 26, password: '12345678', profile: '1746007436533-darkbackground.jpg', staff_id: 3 },
      { id: 4, studentName: 'ragu', marks: 80, age: 22, password: '12345678', profile: '1743747656128-back.jpg', staff_id: 1 },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Delete students first to avoid foreign key conflicts
    await queryInterface.bulkDelete('students', null, {});
    await queryInterface.bulkDelete('staffs', null, {});
  }
};
