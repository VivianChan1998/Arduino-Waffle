class Question:
    def __init__(self, text, options, next_question):
        self.text = text
        self.options = options
        self.answer = None
        self.next_question = next_question

    def update_answer(self, input):
        self.answer = input


class Quiz:
    def __init__(self):
        self.questions = []

    def add_question(self, question):
        self.questions.append(question)

