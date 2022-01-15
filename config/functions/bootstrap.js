'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

 async function init_roles () {
    const role_orm = strapi.query('role', 'users-permissions')
    const auth_role = await role_orm.findOne({id: 1}, ['permissions'])
    if (auth_role.name !== 'Reseller') {
        await role_orm.update({id: auth_role.id}, {name: 'Reseller', description: 'This is a role of Reseller.'})
    }
    const creator_role = await role_orm.findOne({name: 'Creator'}, [])
    if (!creator_role) {
        const data = {
            name: 'Creator',
            description: 'This is a role for Creator.',
            permissions: auth_role.permissions
        }
        await role_orm.create(data);
        console.log('Creator is created')
    }
 }

 async function get_roles() {
    const role_orm = strapi.query('role', 'users-permissions')
    const role_list = await role_orm.find({}, [])
  
    const roles = {}
  
    for (let role of role_list) {
      roles[ role._id ] = role
      roles[ role.name ] = role
    }
  
    return roles
  }

 async function get_permissions( selected_role, selected_type, selected_controller ) {
    const roles          = await get_roles()
    const permission_orm = strapi.query('permission', 'users-permissions')
  
    let permission_list  = await permission_orm.find({_limit: 999}, [])
    if ( selected_role       ) permission_list = permission_list.filter( ({ role       }) => `${role}`       === `${roles[selected_role].id}` )
    if ( selected_type       ) permission_list = permission_list.filter( ({ type       }) => `${type}`       === `${selected_type}`            )
    if ( selected_controller ) permission_list = permission_list.filter( ({ controller }) => `${controller}` === `${selected_controller}`      )
    return permission_list
  }
  
  async function enable_permissions(role, type, controller) {
    const permission_orm = strapi.query('permission', 'users-permissions')
  
    const permissions = await get_permissions(role, type, controller)
  
    for (let { id, enabled } of permissions) {
        if (!enabled) {
            console.log(id, enabled);
            await permission_orm.update({ id }, { enabled: true })
        }
    }
  }

  async function enable_all_controllers(role, type) {
    const permission_orm = strapi.query('permission', 'users-permissions')
    let permission_list  = await permission_orm.find({_limit: 999}, [])
    permission_list.filter( async ({ controller }) => {
        await enable_permissions(role, type, controller)
    })
  }
  
  async function initPermissions() {
    await enable_all_controllers('Public', 'application')
    await enable_all_controllers('Public', 'upload')
    await enable_all_controllers('Public', 'users-permissions')
    
    await enable_all_controllers('Reseller', 'application')
    await enable_all_controllers('Reseller', 'upload')
    await enable_all_controllers('Reseller', 'users-permissions')

    await enable_all_controllers('Creator', 'application')
    await enable_all_controllers('Creator', 'upload')
    await enable_all_controllers('Creator', 'users-permissions')
  }
  

module.exports = () => {
    init_roles();
    initPermissions();
};
