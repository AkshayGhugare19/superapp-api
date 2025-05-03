// services/deleteGroup.service.js

const { db, sequelize } = require('../../../../db/db');

const deleteGroup = async (id) => {
	console.log("id",id);
	
  const t = await sequelize.transaction();

  try {
    // Check if the group exists
    const group = await db.Group.findOne({ where: { id } });

    if (!group) {
      await t.rollback();
      return { status: false, code: 404, msg: 'Group not found.' };
    }

    // Delete the group
	console.log("group123",group)
	return  { status: false, code: 500, msg: group };;
    await db.Group.destroy({ where: { id }, transaction: t });

    // TODO: Optionally delete related records like conversation, messages, etc.

    await t.commit();

    return {
      status: true,
      code: 200,
      msg: 'Group deleted successfully.',
    };
  } catch (error) {
    await t.rollback();
    console.error('Error deleting group:', error);
    return { status: false, code: 500, msg: error.message };
  }
};

module.exports = deleteGroup;


