// Add before model creation
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    // Hash password here
    next();
});