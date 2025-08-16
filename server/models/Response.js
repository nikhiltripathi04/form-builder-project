import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    questionType: { type: String, required: true },
    // --- Answer format for 'Categorize' ---
    categorizedItems: [{
        itemName: String,
        assignedCategory: String
    }],
    // --- Answer format for 'Cloze' ---
    clozeAnswers: [String], // Array of answers for each blank
    // --- Answer format for 'Comprehension' ---
    comprehensionAnswers: [{
        question: String,
        selectedOption: String
    }]
}, { _id: false });


const responseSchema = new mongoose.Schema({
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    submittedBy: { type: String }, // Could be an email or user ID
    answers: [answerSchema],
}, { timestamps: true });

const Response = mongoose.model('Response', responseSchema);
export default Response;