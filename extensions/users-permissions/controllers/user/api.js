'use strict';

const _ = require('lodash');
const { sanitizeEntity } = require('strapi-utils');

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  });

const formatError = error => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

module.exports = {
  /**
   * Create a/an user record.
   * @return {Object}
   */
  async create(ctx) {
    const advanced = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'users-permissions',
        key: 'advanced',
      })
      .get();

    const { email, username, password, role, wallet } = ctx.request.body;

    if (!email) return ctx.badRequest('missing.email');
    if (!username) return ctx.badRequest('missing.username');
    if (!password) return ctx.badRequest('missing.password');

    const userWithSameUsername = await strapi
      .query('user', 'users-permissions')
      .findOne({ username });

    if (userWithSameUsername) {
      return ctx.badRequest(
        null,
        'Username already taken.'
      );
    }

    const authorWithSameUsername = await strapi.services.author.findOne({ username });
    if (authorWithSameUsername) {
      return ctx.badRequest(
        null,
        'Username already taken.'
      );
    }

    const userWithSameWallet = await strapi.services.author.findOne({ wallet });
    if (userWithSameWallet) {
      return ctx.badRequest(
        null,
        'Wallet address already taken. Please use another account.'
      );
    }

    if (advanced.unique_email) {
      const userWithSameEmail = await strapi
        .query('user', 'users-permissions')
        .findOne({ email: email.toLowerCase() });

      if (userWithSameEmail) {
        return ctx.badRequest(
          null,
          'Email already taken.'
        );
      }
    }

    const user = {
      ...ctx.request.body,
      provider: 'local',
    };

    user.email = user.email.toLowerCase();

    if (!role) {
      const defaultRole = await strapi
        .query('role', 'users-permissions')
        .findOne({ type: advanced.default_role }, []);

      user.role = 2; // default public user.
    }

    try {
      let author = {}, author_sale = {};
      try {
          let param = {
              sales: 0,
              volume: 0,
              daily_sales: 0,
              weekly_sales: 0,
              floor_price:0,
              owners: 0,
              assets: 0,
              author: null,
              created_by: 1,
              updated_by: 1
          }
          author_sale = await strapi.query('author-sales').create(param);
      } catch (err) {
          return ctx.badRequest(null, err);
      }

      try {
          let newParams = {
              name: user.name,
              username: user.username,
              followers: 0,
              author_sale: author_sale.id,
              wallet: user.wallet,
              created_by: 1,
              updated_by: 1
          }
          author = await strapi.query('author').create(newParams);
      } catch (err) {
          return ctx.badRequest(null, err);
      }
      
      user.author = author.id;
      const data = await strapi.plugins['users-permissions'].services.user.add(user);
      ctx.created(sanitizeUser(data));
    } catch (error) {
      ctx.badRequest(null, error);
    }
  },
  /**
   * Update a/an user record.
   * @return {Object}
   */

  async update(ctx) {
    const advancedConfigs = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'users-permissions',
        key: 'advanced',
      })
      .get();

    const { id } = ctx.params;
    const { email, username, password } = ctx.request.body;
    var populate = [ 'author', 'author.avatar', 'author.nfts', 'preview_image', 'bids.author', 'bids.author.avatar'];
    const user = await strapi.plugins['users-permissions'].services.user.fetch({
      id,
    }, populate);

    if (_.has(ctx.request.body, 'email') && !email) {
      return ctx.badRequest('email.notNull');
    }

    if (_.has(ctx.request.body, 'username') && !username) {
      return ctx.badRequest('username.notNull');
    }

    if (_.has(ctx.request.body, 'password') && !password && user.provider === 'local') {
      return ctx.badRequest('password.notNull');
    }

    if (_.has(ctx.request.body, 'username')) {
      const userWithSameUsername = await strapi
        .query('user', 'users-permissions')
        .findOne({ username });

      if (userWithSameUsername && userWithSameUsername.id != id) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.username.taken',
            message: 'username.alreadyTaken.',
            field: ['username'],
          })
        );
      }
    }

    if (_.has(ctx.request.body, 'email') && advancedConfigs.unique_email) {
      const userWithSameEmail = await strapi
        .query('user', 'users-permissions')
        .findOne({ email: email.toLowerCase() });

      if (userWithSameEmail && userWithSameEmail.id != id) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.email.taken',
            message: 'Email already taken',
            field: ['email'],
          })
        );
      }
      ctx.request.body.email = ctx.request.body.email.toLowerCase();
    }

    let updateData = {
      ...ctx.request.body,
    };

    if (_.has(ctx.request.body, 'password') && password === user.password) {
      delete updateData.password;
    }

    const data = await strapi.plugins['users-permissions'].services.user.edit({ id }, updateData);

    ctx.send(sanitizeUser(data));
  },
};
