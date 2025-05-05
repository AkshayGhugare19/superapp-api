const express = require('express');
const groupControllers = require('../modules/chats/groups/controllers');
const auth = require('../middlewares/auth');
const { roles } = require('../config/enums');
const validate = require('../middlewares/validate');
const groupValidations = require('../modules/chats/groups/group.validations')
const router = express.Router();


router.route('/create').post(auth([roles.consumer, roles.merchant,roles.agent]), validate(groupValidations.createGroupSchema), groupControllers.createGroup);
router.route('/delete/:id').delete(auth([roles.consumer, roles.merchant,roles.agent]),  groupControllers.deleteGroup);
router.route('/:id/members').post(auth([roles.consumer, roles.merchant,roles.agent]), validate(groupValidations.addMembersSchema), groupControllers.addGroupMembers);
router.route('/:id/members/:memberId').delete(auth([roles.consumer, roles.merchant,roles.agent]), groupControllers.removeMember);



module.exports = router;






// POST /api/groups
//  Create a new group.


// GET /api/groups
//  Retrieve all groups for the authenticated user.


// GET /api/groups/:id
//  Retrieve a specific group by ID.


// PATCH /api/groups/:id
//  Update group details (e.g., name, avatar).


// DELETE /api/groups/:id
//  Delete a group.


// POST /api/groups/:id/members
//  Add a member to the group.


// GET /api/groups/:id/members
//  List members in the group.


// PATCH /api/groups/:id/members/:memberId
//  Update member role or status.


// DELETE /api/groups/:id/members/:memberId
//  Remove a member from the group.