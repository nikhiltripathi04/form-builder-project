import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    questionTitle: { type: String, required: true },
    questionType: {
        type: String,
        enum: ['Categorize', 'Cloze', 'Comprehension'],
        required: true
    },
    image: { type: String }, // URL for the question image
    // --- Fields for 'Categorize' type ---
    categories: [{ type: String }],
    items: [{
        name: String,
        category: String // The correct category for this item
    }],
    // --- Fields for 'Cloze' type ---
    clozeText: { type: String }, // The passage with underscores for blanks
    // --- Fields for 'Comprehension' type ---
    comprehensionPassage: { type: String },
    comprehensionQuestions: [{
        question: String,
        options: [String],
        correctAnswer: String
    }]
}, { _id: true });


const formSchema = new mongoose.Schema({
    title: { type: String, required: true },
    headerImage: { type: String }, // URL for the header image
    questions: [questionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional: if you add users
}, { timestamps: true });

const Form = mongoose.model('Form', formSchema);
export default Form;