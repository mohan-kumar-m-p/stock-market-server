const mongoose = require("mongoose");

const definition = {
  //=== === === stock news details starts here ======
  source: { type: String },
  headline: { type: String },
  subject:{type:String},
  date: { type: Date },
  assetId: [ {type: String } ],
  hyperLinks : [
    {
      title : { type: String },
      link : { type: String },
      assetId: [ {type: String } ],
    }
  ],
  //=== === === stock news details ends here ==========
  //=== === === general fields starts here ============
  id: { type:String, unique:true },
  companyId:{ type:String },
  isActive: { type: Boolean, default: true },
  createdBy:{ type:String, required:true },
  modifiedBy:{ type:String },
  //=== === === general fields ends here ==============
};

const newsSchema = mongoose.Schema(definition, { timestamps: true });

newsSchema.pre("save", function () {
  this.id = this._id;
});

const newsModel = mongoose.model("stocknews", newsSchema);

module.exports = { newsModel };
