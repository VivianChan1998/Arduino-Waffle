from Enums import AnswerType

class Question():
    def __init__(self, parent, parameter_keyname, question_text, answer_type, answer_options = [], follow_up_question = None) -> None:
        self.question_text = question_text
        self.answer_type = answer_type
        self.answer_options = answer_options
        #self.follow_up_question = follow_up_question
        self.answer = None
        self.parent = parent
        self.parameter_keyname = parameter_keyname
    
    def ask(self):
        # TEMP wait for frontend
        print(self.question_text)
        for a in self.answer_options:
            print(a.text)
        ans = input("> ")

        self.set_answer(int(ans))
        self.follow_up(int(ans))

    def set_answer(self, ans: int):
        if self.answer_type == AnswerType.MULTI_OPTION:
            self.answer = self.answer_options[ans].value
        elif self.answer_type == AnswerType.NUMERCIAL:
            self.answer = ans
        
        self.parent.parameter[self.parameter_keyname] = self.answer

    def follow_up(self, ans: int):
        if self.answer_type == AnswerType.MULTI_OPTION:
            follow_up = self.answer_options[ans].follow_up
            if follow_up != None:
                follow_up.ask()
    

class Answer():
    def __init__(self, answer_text, value, follow_up = None) -> None:
        self.text = answer_text
        self.value = value
        self.follow_up = follow_up
        pass