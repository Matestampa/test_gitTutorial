const mongoose=require("mongoose");

const {goalSchema}=require("@matestampa/diffum-goals_mongoose-schemas");

 // Creación del modelo a partir del esquema
const GoalModel = mongoose.model('Goal', goalSchema);


console.log(goalSchema.tree)

module.exports= {GoalModel};