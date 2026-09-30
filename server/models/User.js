const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' },
  profile: {
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'All'] },
    state: { type: String },
    district: { type: String },
    isUrban: { type: Boolean, default: false },
    maritalStatus: { type: String, enum: ['Single', 'Married', 'Widowed', 'Divorced', 'Any'] },
    annualIncome: { type: Number },
    isBPL: { type: Boolean, default: false },
    occupation: { type: String },
    employmentStatus: { type: String },
    socialCategory: { type: String, enum: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Any'] },
    isStudent: { type: Boolean, default: false },
    isFarmer: { type: Boolean, default: false },
    isDisability: { type: Boolean, default: false },
    disabilityPercentage: { type: Number, default: 0 },
    landOwnershipAcres: { type: Number, default: 0 },
    familyMembersCount: { type: Number, default: 1 }
  }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);