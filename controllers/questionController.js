const questionService = require("../services/questionService");

exports.addQuestion = async (req, res) => {
  try {
    const { categoryId, question, options, correctAnswerIndex } = req.body;

    if (
      !categoryId ||
      !question ||
      !options ||
      options.length !== 4 ||
      correctAnswerIndex === undefined
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const result = await questionService.addQuestion(
      categoryId,
      question,
      options,
      correctAnswerIndex
    );

    res.status(201).json({
      message: "Question added successfully",
      data: result,
    });
  } catch (err) {
    console.error("Add Question Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getQuestion = async (req, res) => {
  try {
    const questions  = await questionService.getQuestions();
    res.json(questions );
  } catch (err) {
    console.error("questions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.editQuestion = async (req, res) => {
  try {
    const { id, categoryId, questionText, options, correctAnswerIndex } = req.body; 

    if (
      !id ||
      !categoryId ||
      !questionText ||
      !Array.isArray(options) ||
      options.length !== 4 ||
      correctAnswerIndex === undefined
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const affectedRows = await questionService.editQuestion(
      id,
      categoryId,
      questionText,
      options,
      correctAnswerIndex
    );

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Question not found or no changes made" });
    }

    res.json({ message: "Question updated successfully" });
  } catch (err) {
    console.error("EditQuestion error:", err);
    res.status(500).json({ message: "Server error" });  
  }
};

exports.deleteQuestion = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Please provide id" });
  }

  try {
    const affectedRows = await questionService.deleteQuestion(id);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Question not found or no changes made" });
    }

    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error("deleteQuestion error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Question ID is required" });
    }

    const question = await questionService.getQuestionById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // If options are stored as JSON string, parse them into an array
    if (typeof question.options === "string") {
      try {
        question.options = JSON.parse(question.options);
      } catch (err) {
        console.warn("Failed to parse options JSON:", err);
        question.options = [];
      }
    }

    res.status(200).json(question);
  } catch (err) {
    console.error("Error fetching question by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
};
