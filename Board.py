from Enums import PinType

class Board():
    def __init__(self, name: str):
        self.name = name
        self.pins = []
        # all available pins on a board with its functionalitis

    def register_one_pin(self, device_name:str, required_pin_type: PinType):
        """
        """
        # TODO: find which pin is available for required pin type
        pin_num = 0

        self.pins[pin_num].set_in_use(required_pin_type)
        return pin_num



class Pin():
    def __init__(self, pin_types:Array[PinType], in_use:bool=False):
        self.pin_types = pin_types
        self.in_use = in_use
        self.used_as = PinType.DIGITAL

    def set_in_use(self, used_as):
        self.in_use = True
        self.used_as = used_as



