class CRUD {

  static async save (model, data) {
    return model
      .create(data)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw { message: err.message };
      });
  }

  static async create (model, data) {
    return model
      .create(data)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw { message: err.message };
      });
  }

  static async aggregate (model, query) {
    return model
      .aggregate(query)
      .exec()
      .then((result) => {
        return result[0];
      })
      .catch((err) => {
        throw err;
      });
  }

  static async findAll (model, query) {
    return model
      .find(query)
      .exec()
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  static async find (model, query) {
    const offset = query?.offset || 0;
    const limit = query?.pageSize || 10;
    const filter = query?.filter || {};
    const select = query?.select || {};
    const sort = query?.sort || {};
    return model
      .find(filter)
      .select(select)
      .sort(sort)
      .skip(offset)
      .limit(limit)
      .exec()
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  static async updateOne (model, query, updateData) {
    return model
      .updateOne(query, updateData)
      .exec()
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log('err --  ', err);
        throw err;
      });
  }

  static async findOneAndUpdate (model, query, updateData, options = {}) {
    return model
      .findOneAndUpdate(query, updateData, options)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log('err --  ', err);
        throw err;
      });
  }

  static async findOne (model, query) {
    const filter = query?.filter || {};
    const select = query?.select || {};
    return model
      .findOne(filter)
      .select(select)
      .lean()
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  static async count (model, query) {
    const filter = query?.filter || {};
    return model
      .find(filter)
      .exec()
      .count()
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  static async distinct (model, uniqueKey, query) {
    return model
      .distinct(uniqueKey, query)
      .exec()
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }
}

module.exports = { CRUD };
