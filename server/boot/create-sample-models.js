var async = require('async');
module.exports = function(app) {
  //data sources
  var mongoDB = app.dataSources.mongoDB;
  //create all models
  async.parallel({
    users: async.apply(createUsers),
    companies: async.apply(createCompanies),
  }, function(err, results) {
    if (err) throw err;
    createVicores(results.users, results.companies, function(err) {
      console.log('> models created sucessfully');
    });
  });
  //create users
  function createUsers(cb) {
    mongoDB.automigrate('user', function(err) {
      if (err) return cb(err);
      var user = app.models.user;
      user.create([{
        email: 'foo@bar.com',
        password: 'foobar'
      }, {
        email: 'john@doe.com',
        password: 'johndoe'
      }, {
        email: 'jane@doe.com',
        password: 'janedoe'
      }], cb);
    });
  }
  //create coffee shops
  function createCompanies(cb) {
    mongoDB.automigrate('Company', function(err) {
      if (err) return cb(err);
      var Company = app.models.Company;
      Company.create([{
      name: 'pfm',
      city: 'La Paz'
    }, {
      name: 'Hosp.Obrero',
      city: 'La Paz'
    }, {
      name: 'Clínica Fides',
      city: 'El Alto'
    }, ], cb);
    });
  }
  //create Vicores
  function createVicores(users, companies, cb) {
    mongoDB.automigrate('Vicore', function(err) {
      if (err) return cb(err);
      var Vicore = app.models.Vicore;
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
      Vicore.create([{
        date: Date.now() - (DAY_IN_MILLISECONDS * 4),
        rating: 5,
        comments: 'Cool.',
        publisherId: users[0].id,
        CompanyId: companies[0].id,
      }, {
        date: Date.now() - (DAY_IN_MILLISECONDS * 3),
        rating: 5,
        comments: 'Quite pleasant.',
        publisherId: users[1].id,
        CompanyId: companies[0].id,
      }, {
        date: Date.now() - (DAY_IN_MILLISECONDS * 2),
        rating: 4,
        comments: 'It was ok.',
        publisherId: users[1].id,
        CompanyId: companies[1].id,
      }, {
        date: Date.now() - (DAY_IN_MILLISECONDS),
        rating: 4,
        comments: 'I go here everyday.',
        publisherId: users[2].id,
        CompanyId: companies[2].id,
      }], cb);
    });
  }
};
