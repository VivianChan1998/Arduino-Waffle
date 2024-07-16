from Enums import ComponentType

class Component:
    def __init__(self, name:str, device_type: ComponentType):
        self.name = name
        self.device_type = device_type

    def get_include(self):
        """
        The #include<...> part of each generated code

        """
        
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
    
    def get_loop(self):
        """
        Code to put inside `void loop {}`
        """
        return ""
    
    def get_helper_function(self):
        return ""
