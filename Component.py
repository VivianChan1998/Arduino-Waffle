from Board import Board

class Component():
    def __init__(self, id: int, board: Board):
        self.id = id
        self.parameter = None
        self.question = None
        self.init_question = None
        self.pin_spec = None
        self.library = None
        self.board = board
        self.states = []
        self.init = {}
        self.parameter = {}  # ONLY params associated with loop or helper functions
        self.is_analog = False
        self.analog_max = -1
        pass

    def get_include(self):
        """
        The #include<...> part of each generated code
        """
        if self.library is not None:
            return self.str_include(self.library)
        return ""
    
    def get_global_var(self):
        """
        The #define ... and global variables for each component
        """
        return ""

    def get_setup(self):
        """
        Code to put inside `void setup() {}`
        """
        return ""
    
    def get_loop_start(self):
        """
        Code to put inside `void loop {}`
        """
        return ""
    
    def get_loop_logic(self, state_num = 0):
        return ""
    
    def get_loop_end(self):
        """
        Code to put inside `void loop {}`
        """
        return ""

    def choose_state(self, state_num):
        self.state = self.state_names[int(state_num)]

    def get_helper_function(self):
        return ""

    def str_include(self, name):
        return "#include <" + name + ">"
    
    def str_pinMode(self, name, io):
        ret = "pinMode(" + name + ', '
        if io is 'i':
            ret += "INPUT)"
        else:
            ret += "OUTPUT)"
        return ret
    
    def str_define(self, var, val):
        return "#define " + var + " " + str(val)
    
    def str_init_variable(self, var_type, var, val):
        return var_type + " " + var + " = " + str(val)
    
    def str_assign_variable(self, left, right):
        return left + " = " + right
    
    def str_call_function(self, obj, func_name, list_to_pass):
        ret = obj + '.' + func_name + '(' 
        for el in list_to_pass[:-1]:
            ret += str(el) + ',' #TODO handle extra comma. I think i fixed? - xiaorui 
        ret += str(list_to_pass[-1])
        ret += ')'
        return ret
    
    def __getitem__(self, key):
        return getattr(self, key)
    
    def __setitem__(self, key, val):
        self[key] = val

    def ask_init_question(self):
        if self.init_question != None:
            self.init_question.ask()



    def ask_question(self) -> int:
        if self.question == None:
            return -1
        if(self.is_analog):
            self.question_analog.ask()
        else:
            self.question.ask()
        self.states.append(dict(self.parameter))
        return (len(self.states) - 1)
    
    # ANALOG SPECIFIC #
    def set_analog(self):
        self.is_analog = True
        pass