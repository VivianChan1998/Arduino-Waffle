from Enums import ComponentType
import Library
from abc import ABCMeta, abstractmethod

class Component(metaclass=ABCMeta):
    def __init__(self, id: int):
        self.id = id
        pass

    def get_include(self):
        """
        The #include<...> part of each generated code
        """
        if self.library is not None:
            return self.str_include(self.library)
        pass
    
    def get_global_var(self):
        """
        The #define ... and global variables for each component
        """
        pass

    def get_setup(self):
        """
        Code to put inside `void setup() {}`
        """
        pass
    
    def get_loop_start(self):
        """
        Code to put inside `void loop {}`
        """
        pass
    
    def get_loop_logic(self):
        # TODO
        pass
    
    def get_loop_end(self):
        """
        Code to put inside `void loop {}`
        """
        pass
    
    def get_helper_function(self):
        return ""

    def str_include(self, name):
        return "#include <" + name + "> \n"
    
    def str_pinMode(self, name, io):
        ret = "pinMode(" + name + ', '
        if io is 'i':
            ret += "INPUT);\n"
        else:
            ret += "OUTPUT);\n"
        return ret
    
    def str_define(self, var, val):
        return "#define " + var + " " + str(val) + '\n'
    
    def str_init_variable(self, var_type, var, val):
        return var_type + " " + var + " = " + str(val) + ';\n'
    
    def str_assign_variable(self, left, right):
        return left + " = " + right + ";\n"
    
    def str_call_function(self, obj, func_name, list_to_pass):
        ret = obj + '.' + func_name + '(' 
        for el in list_to_pass:
            ret += str(el) + ',' #TODO handle extra comma
        ret += ');\n'
        return ret
    
