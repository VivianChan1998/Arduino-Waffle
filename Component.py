from enum import Enum
class ComponentType(Enum):
    INPUT_DEVICE_DIGITAL = 0
    INPUT_DEVICE_ANALOG = 1
    INPUT_DEVICE_W_LIBRARY = 2
    OUTPUT_DEVICE_DIGITAL = 3
    OUTPUT_DEVICE_ANALOG = 4
    OUTPUT_DEVICE_W_LIBRARY = 5

class Component:
    def __init__(self, name:str):
