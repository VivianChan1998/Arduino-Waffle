from Enums import AnswerType

class Question():
    def __init__(self, parent, parameter_keyname, question_text, answer_type, answer_options, follow_up_question = None) -> None:
        self.question_text = question_text
        self.answer_type = answer_type
        self.answer_options = answer_options
        self.follow_up_question = follow_up_question
        self.answer = None
        self.parent = parent
        self.parameter_keyname = parameter_keyname
    
    def ask(self):
        # TEMP wait for frontend
        print(self.question_text)
        for a in self.answer_options:
            print(a.text)
        ans = input("> ")

        self.set_answer(ans)
        self.follow_up()

    def set_answer(self, ans):
        if self.answer_type == AnswerType.MULTI_OPTION:
            self.answer = self.answer_options[int(ans)].value
        elif self.answer_type == AnswerType.NUMERCIAL:
            self.answer = int(ans)
        
        self.parent.parameter[self.parameter_keyname] = self.answer

    def follow_up(self):
        if self.follow_up_question is not None:
            self.follow_up_question.ask()
    

class Answer():
    def __init__(self, answer_text, value) -> None:
        self.text = answer_text
        self.value = value
        pass