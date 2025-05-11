const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number cannot be longer than 20 characters']
  },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Window Shopper', 'Deal Closed', 'Returning Client'],
    default: 'Active'
  },
  value: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  lastContact: {
    type: Date,
    default: Date.now
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update company totalValue when customer is created/updated/deleted
CustomerSchema.statics.updateCompanyTotalValue = async function(companyId) {
  const obj = await this.aggregate([
    {
      $match: { company: companyId }
    },
    {
      $group: {
        _id: '$company',
        totalValue: { $sum: '$value' }
      }
    }
  ]);

  try {
    await this.model('Company').findByIdAndUpdate(companyId, {
      totalValue: obj.length > 0 ? obj[0].totalValue : 0
    });
  } catch (err) {
    console.error(err);
  }
};

CustomerSchema.post('save', function() {
  this.constructor.updateCompanyTotalValue(this.company);
});

CustomerSchema.pre('deleteOne', { document: true, query: false }, function() {
  this.constructor.updateCompanyTotalValue(this.company);
});

module.exports = mongoose.model('Customer', CustomerSchema);
